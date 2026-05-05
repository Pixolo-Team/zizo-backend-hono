export type BillingCycle = 'monthly' | 'quarterly' | 'annually';

export interface CreateSubscriptionPlanRequest {
  organizationId: string;
  centerId: string;
  name: string;
  description?: string;
  feeAmount: number;
  currency: 'INR';
  billingCycle: BillingCycle;
  daysPerWeek: number;
  durationInMonths: number;
  isActive: boolean;
}

export interface CreateSubscriptionPlanResponse {
  subscriptionPlanId: string;
  organizationId: string;
  centerId: string;
  name: string;
  description: string | null;
  feeAmount: number;
  currency: 'INR';
  billingCycle: BillingCycle;
  daysPerWeek: number;
  durationInMonths: number;
  isActive: boolean;
}

export type CreateSubscriptionPlanErrorCode = 'FORBIDDEN' | 'VALIDATION' | 'NOT_FOUND';

export interface CreateSubscriptionPlanServiceResult {
  data: CreateSubscriptionPlanResponse | null;
  error: Error | null;
  errorCode?: CreateSubscriptionPlanErrorCode;
}
