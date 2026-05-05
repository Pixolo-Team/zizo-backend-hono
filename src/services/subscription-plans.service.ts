import type {
  CreateSubscriptionPlanRequest,
  CreateSubscriptionPlanResponse,
  CreateSubscriptionPlanServiceResult,
} from '@/models/subscription-plans.model';

import { logger } from '@/common/utils/logger.util';
import { supabase } from '@/config/supabase';
import { tables } from '@/constants/database.constants';
import { getOrganizationMemberRoleAccess } from '@/services/organization-member-role.service';

type OrganizationRecord = {
  id: string;
};

type CenterRecord = {
  id: string;
  organization_id: string;
};

type SubscriptionPlanRecord = {
  id: string;
  organization_id: string;
  center_id: string;
  name: string;
  description: string | null;
  fee_amount: number;
  currency: 'INR';
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  days_per_week: number;
  duration_in_months: number;
  is_active: boolean;
};

const ALLOWED_SUBSCRIPTION_PLAN_ROLE_NAMES = ['Admin'];

const validateOrganizationExists = async (
  organizationId: string
): Promise<{ exists: boolean; error: Error | null }> => {
  const { data, error } = await supabase
    .from(tables.ORGS)
    .select('id')
    .eq('id', organizationId)
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error('Failed to validate organization existence:', error);
    return { exists: false, error: new Error(error.message) };
  }

  return { exists: !!(data as OrganizationRecord | null), error: null };
};

const validateCenterExists = async (
  centerId: string
): Promise<{ center: CenterRecord | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from(tables.CENTERS)
    .select('id, organization_id')
    .eq('id', centerId)
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error('Failed to validate center existence:', error);
    return { center: null, error: new Error(error.message) };
  }

  return { center: (data as CenterRecord | null) ?? null, error: null };
};

const mapSubscriptionPlanRecordToResponse = (
  plan: SubscriptionPlanRecord
): CreateSubscriptionPlanResponse => ({
  subscriptionPlanId: plan.id,
  organizationId: plan.organization_id,
  centerId: plan.center_id,
  name: plan.name,
  description: plan.description,
  feeAmount: plan.fee_amount,
  currency: plan.currency,
  billingCycle: plan.billing_cycle,
  daysPerWeek: plan.days_per_week,
  durationInMonths: plan.duration_in_months,
  isActive: plan.is_active,
});

export const createSubscriptionPlanService = async (
  subscriptionPlanDto: CreateSubscriptionPlanRequest,
  authId: string
): Promise<CreateSubscriptionPlanServiceResult> => {
  const membershipAccess = await getOrganizationMemberRoleAccess(
    subscriptionPlanDto.organizationId,
    authId,
    ALLOWED_SUBSCRIPTION_PLAN_ROLE_NAMES
  );

  if (membershipAccess.error) {
    return {
      data: null,
      error: membershipAccess.error,
    };
  }

  if (!membershipAccess.organizationMemberId) {
    return {
      data: null,
      error: new Error('User does not belong to the specified organization'),
      errorCode: 'FORBIDDEN',
    };
  }

  if (!membershipAccess.allowed) {
    return {
      data: null,
      error: new Error('User does not have permission to create subscription plans'),
      errorCode: 'FORBIDDEN',
    };
  }

  const organizationValidation = await validateOrganizationExists(subscriptionPlanDto.organizationId);

  if (organizationValidation.error) {
    return {
      data: null,
      error: organizationValidation.error,
    };
  }

  if (!organizationValidation.exists) {
    return {
      data: null,
      error: new Error('Organization not found'),
      errorCode: 'NOT_FOUND',
    };
  }

  const centerValidation = await validateCenterExists(subscriptionPlanDto.centerId);

  if (centerValidation.error) {
    return {
      data: null,
      error: centerValidation.error,
    };
  }

  if (!centerValidation.center) {
    return {
      data: null,
      error: new Error('Center not found'),
      errorCode: 'NOT_FOUND',
    };
  }

  if (centerValidation.center.organization_id !== subscriptionPlanDto.organizationId) {
    return {
      data: null,
      error: new Error('Center does not belong to the specified organization'),
      errorCode: 'VALIDATION',
    };
  }

  const { data, error } = await supabase
    .from(tables.SUBSCRIPTION_PLANS)
    .insert({
      organization_id: subscriptionPlanDto.organizationId,
      center_id: subscriptionPlanDto.centerId,
      name: subscriptionPlanDto.name,
      description: subscriptionPlanDto.description ?? null,
      fee_amount: subscriptionPlanDto.feeAmount,
      currency: subscriptionPlanDto.currency,
      billing_cycle: subscriptionPlanDto.billingCycle,
      days_per_week: subscriptionPlanDto.daysPerWeek,
      duration_in_months: subscriptionPlanDto.durationInMonths,
      is_active: subscriptionPlanDto.isActive,
      organization_member_id: membershipAccess.organizationMemberId,
    })
    .select(
      'id, organization_id, center_id, name, description, fee_amount, currency, billing_cycle, days_per_week, duration_in_months, is_active'
    )
    .single();

  if (error) {
    logger.error('Failed to create subscription plan:', error);
    return {
      data: null,
      error: new Error('Failed to create subscription plan'),
    };
  }

  return {
    data: mapSubscriptionPlanRecordToResponse(data as SubscriptionPlanRecord),
    error: null,
  };
};
