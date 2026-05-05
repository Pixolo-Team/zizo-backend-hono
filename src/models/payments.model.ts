export type PaymentMode = 'cash' | 'upi' | 'card' | 'bank_transfer';

export type PaymentType = 'academy_fees' | 'tournament_fee' | 'equipment_fee';

export interface SubscriptionAllocation {
  subscriptionplanId: string;
  amount: number;
}

export interface PaymentRequest {
  organizationId: string;
  playerId: string;
  amount: number;
  currency?: string;
  paymentMode: PaymentMode;
  paymentType: PaymentType;
  subscriptionAllocations?: SubscriptionAllocation[];
  proofUrl?: string;
  transactionReference?: string;
  notes?: string;
}

export interface PaymentLinkedSubscription {
  subscriptionPlanId: string;
  allocatedAmount: number;
}

export interface PaymentResponse {
  paymentId: string;
  playerId: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  subscriptionsLinked: PaymentLinkedSubscription[];
  status: string;
}

export type CreatePaymentErrorCode = 'FORBIDDEN' | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT';

export interface CreatePaymentServiceResult {
  data: PaymentResponse | null;
  error: Error | null;
  errorCode?: CreatePaymentErrorCode;
}
