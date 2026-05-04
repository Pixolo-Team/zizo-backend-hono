import type {
  CreatePaymentServiceResult,
  PaymentRequest,
  PaymentResponse,
  SubscriptionAllocation,
} from '@/models/payments.model';

import { supabase } from '@/config/supabase';
import { tables } from '@/constants/database.constants';
import { logger } from '@/common/utils/logger.util';
import { hasOrganizationMemberRoleAccess } from '@/services/organization-member-role.service';

type SubscriptionPlanRecord = {
  id: string;
  organization_id: string;
  fee_amount: number;
  duration_in_months: number | null;
  is_active: boolean;
};

type PlayerSubscriptionRecord = {
  id: string;
  subscription_plan_id: string;
};

const PAYMENT_SUCCESS_STATUS = 'completed';
const SUBSCRIPTION_ACTIVE_STATUS = 'active';
const ALLOWED_PAYMENT_ROLE_NAMES = ['Admin', 'Manager', 'Coach'];
const DEFAULT_CURRENCY = 'INR';

const addMonthsToDate = (date: Date, months: number) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

const buildSubscriptionDates = (durationInMonths: number | null) => {
  const startDate = new Date();
  const endDate =
    typeof durationInMonths === 'number' && durationInMonths > 0
      ? addMonthsToDate(startDate, durationInMonths)
      : null;

  return {
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString() ?? null,
  };
};

const hasPaymentPermission = async (
  organizationId: string,
  authId: string
): Promise<{ allowed: boolean; error: Error | null }> => {
  return hasOrganizationMemberRoleAccess(organizationId, authId, ALLOWED_PAYMENT_ROLE_NAMES);
};

const validatePlayerOrganization = async (
  organizationId: string,
  playerId: string
): Promise<{ valid: boolean; error: Error | null }> => {
  const { data, error } = await supabase
    .from(tables.ORG_PLAYER)
    .select('id')
    .eq('organization_id', organizationId)
    .eq('player_id', playerId)
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error('Failed to validate player organization mapping:', error);
    return { valid: false, error: new Error(error.message) };
  }

  return { valid: !!data, error: null };
};

const fetchSubscriptionPlans = async (
  organizationId: string,
  allocations: SubscriptionAllocation[]
): Promise<{ plans: Map<string, SubscriptionPlanRecord> | null; error: Error | null }> => {
  if (allocations.length === 0) {
    return { plans: new Map(), error: null };
  }

  const planIds = allocations.map((allocation) => allocation.subscriptionplanId);

  const { data, error } = await supabase
    .from(tables.SUBSCRIPTION_PLANS)
    .select('id, organization_id, fee_amount, duration_in_months, is_active')
    .eq('organization_id', organizationId)
    .in('id', planIds);

  if (error) {
    logger.error('Failed to fetch subscription plans:', error);
    return { plans: null, error: new Error(error.message) };
  }

  const plans = new Map<string, SubscriptionPlanRecord>();

  (data ?? []).forEach((plan) => {
    plans.set(plan.id, plan as SubscriptionPlanRecord);
  });

  return { plans, error: null };
};

const rollbackPaymentCreation = async (paymentId: string | null, createdSubscriptionIds: string[]) => {
  if (!paymentId) {
    return;
  }

  const { error: paymentSubscriptionDeleteError } = await supabase
    .from(tables.PAYMENT_SUBSCRIPTION)
    .delete()
    .eq('payment_id', paymentId);

  if (paymentSubscriptionDeleteError) {
    logger.error('Failed to rollback payment_subscription rows:', paymentSubscriptionDeleteError);
  }

  if (createdSubscriptionIds.length > 0) {
    const { error: playerSubscriptionDeleteError } = await supabase
      .from(tables.PLAYER_SUBSCRIPTIONS)
      .delete()
      .in('id', createdSubscriptionIds);

    if (playerSubscriptionDeleteError) {
      logger.error('Failed to rollback player_subscriptions rows:', playerSubscriptionDeleteError);
    }
  }

  const { error: paymentDeleteError } = await supabase
    .from(tables.PAYMENTS)
    .delete()
    .eq('id', paymentId);

  if (paymentDeleteError) {
    logger.error('Failed to rollback payment row:', paymentDeleteError);
  }
};

const createPlayerSubscription = async (
  organizationId: string,
  playerId: string,
  plan: SubscriptionPlanRecord,
  collectedByUserId: string,
  createdAt: string
): Promise<{ subscription: PlayerSubscriptionRecord | null; error: Error | null }> => {
  const { startDate, endDate } = buildSubscriptionDates(plan.duration_in_months);

  const { data, error } = await supabase
    .from(tables.PLAYER_SUBSCRIPTIONS)
    .insert({
      organization_id: organizationId,
      player_id: playerId,
      subscription_plan_id: plan.id,
      fee_amount: plan.fee_amount,
      discount_amount: 0,
      net_amount: plan.fee_amount,
      start_date: startDate,
      end_date: endDate,
      status: SUBSCRIPTION_ACTIVE_STATUS,
      created_by_user_id: collectedByUserId,
      created_at: createdAt,
      notes: 'Auto-created during payment recording',
    })
    .select('id, subscription_plan_id')
    .single();

  if (error) {
    logger.error('Failed to create player subscription:', error);
    return { subscription: null, error: new Error(error.message) };
  }

  return {
    subscription: data as PlayerSubscriptionRecord,
    error: null,
  };
};

export const createPaymentService = async (
  paymentDto: PaymentRequest,
  collectedByUserId: string
): Promise<CreatePaymentServiceResult> => {
  const paymentCurrency = paymentDto.currency ?? DEFAULT_CURRENCY;
  const subscriptionAllocations = paymentDto.subscriptionAllocations ?? [];
  const totalAllocated = subscriptionAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);

  if (totalAllocated > paymentDto.amount) {
    return {
      data: null,
      error: new Error('Invalid subscription allocation data'),
      errorCode: 'VALIDATION',
    };
  }

  const permissionCheck = await hasPaymentPermission(paymentDto.organizationId, collectedByUserId);

  if (permissionCheck.error) {
    return {
      data: null,
      error: permissionCheck.error,
    };
  }

  if (!permissionCheck.allowed) {
    return {
      data: null,
      error: new Error('User does not have permission to create payments'),
      errorCode: 'FORBIDDEN',
    };
  }

  const playerValidation = await validatePlayerOrganization(paymentDto.organizationId, paymentDto.playerId);

  if (playerValidation.error) {
    return {
      data: null,
      error: playerValidation.error,
    };
  }

  if (!playerValidation.valid) {
    return {
      data: null,
      error: new Error('Player not found in the specified organization'),
      errorCode: 'NOT_FOUND',
    };
  }

  const planFetchResult = await fetchSubscriptionPlans(paymentDto.organizationId, subscriptionAllocations);

  if (planFetchResult.error) {
    return {
      data: null,
      error: planFetchResult.error,
    };
  }

  const plansById = planFetchResult.plans ?? new Map<string, SubscriptionPlanRecord>();

  for (const allocation of subscriptionAllocations) {
    const plan = plansById.get(allocation.subscriptionplanId);

    if (!plan) {
      return {
        data: null,
        error: new Error(`Subscription plan not found: ${allocation.subscriptionplanId}`),
        errorCode: 'NOT_FOUND',
      };
    }

    if (!plan.is_active) {
      return {
        data: null,
        error: new Error(`Subscription plan is inactive: ${allocation.subscriptionplanId}`),
        errorCode: 'VALIDATION',
      };
    }

  }

  let paymentId: string | null = null;
  const createdSubscriptionIds: string[] = [];

  try {
    const createdAt = new Date().toISOString();
    const collectedAt = new Date().toISOString();

    const { data: insertedPayment, error: paymentInsertError } = await supabase
      .from(tables.PAYMENTS)
      .insert({
        organization_id: paymentDto.organizationId,
        player_id: paymentDto.playerId,
        amount: paymentDto.amount,
        currency: paymentCurrency,
        payment_mode: paymentDto.paymentMode,
        payment_type: paymentDto.paymentType,
        collected_by_user_id: collectedByUserId,
        collected_at: collectedAt,
        created_at: createdAt,
        proof_url: paymentDto.proofUrl ?? null,
        transaction_reference: paymentDto.transactionReference ?? null,
        status: PAYMENT_SUCCESS_STATUS,
        notes: paymentDto.notes ?? null,
      })
      .select('id, player_id, amount, currency, payment_mode, payment_type, status')
      .single();

    if (paymentInsertError || !insertedPayment) {
      logger.error('Failed to create payment:', paymentInsertError);
      return {
        data: null,
        error: new Error(paymentInsertError?.message ?? 'Failed to create payment'),
      };
    }

    paymentId = insertedPayment.id;

    for (const allocation of subscriptionAllocations) {
      const existingSubscriptionQuery = await supabase
        .from(tables.PLAYER_SUBSCRIPTIONS)
        .select('id, subscription_plan_id')
        .eq('organization_id', paymentDto.organizationId)
        .eq('player_id', paymentDto.playerId)
        .eq('subscription_plan_id', allocation.subscriptionplanId)
        .limit(1)
        .maybeSingle();

      if (existingSubscriptionQuery.error) {
        throw new Error(existingSubscriptionQuery.error.message);
      }

      let playerSubscription = existingSubscriptionQuery.data as PlayerSubscriptionRecord | null;

      if (!playerSubscription) {
        const plan = plansById.get(allocation.subscriptionplanId);

        if (!plan) {
          throw new Error(`Subscription plan not found: ${allocation.subscriptionplanId}`);
        }

        const subscriptionCreation = await createPlayerSubscription(
          paymentDto.organizationId,
          paymentDto.playerId,
          plan,
          collectedByUserId,
          createdAt
        );

        if (subscriptionCreation.error || !subscriptionCreation.subscription) {
          throw subscriptionCreation.error ?? new Error('Failed to create player subscription');
        }

        playerSubscription = subscriptionCreation.subscription;
        createdSubscriptionIds.push(playerSubscription.id);
      }

      const { error: paymentSubscriptionError } = await supabase
        .from(tables.PAYMENT_SUBSCRIPTION)
        .insert({
          payment_id: paymentId,
          subscription_id: playerSubscription.id,
          amount: allocation.amount,
          created_at: createdAt,
        });

      if (paymentSubscriptionError) {
        throw new Error(paymentSubscriptionError.message);
      }
    }

    const response: PaymentResponse = {
      paymentId: insertedPayment.id,
      playerId: insertedPayment.player_id,
      amount: insertedPayment.amount,
      currency: insertedPayment.currency ?? paymentCurrency,
      paymentType: insertedPayment.payment_type,
      paymentMode: insertedPayment.payment_mode,
      subscriptionsLinked: subscriptionAllocations.map((allocation) => ({
        subscriptionPlanId: allocation.subscriptionplanId,
        allocatedAmount: allocation.amount,
      })),
      status: insertedPayment.status,
    };

    return {
      data: response,
      error: null,
    };
  } catch (err) {
    logger.error('Transaction failed during payment processing:', err);
    await rollbackPaymentCreation(paymentId, createdSubscriptionIds);

    return {
      data: null,
      error: err instanceof Error ? err : new Error('Transaction failed during payment processing'),
      errorCode: 'CONFLICT',
    };
  }
};
