/**
 * Payments module — DO NOT EDIT.
 * Any changes require sign-off from the payments team.
 *
 * This module is intentionally minimal for the lab.
 */

export interface PaymentIntent {
  amount: number;
  currency: string;
  orderId: string;
}

export async function createPaymentIntent(
  intent: PaymentIntent
): Promise<{ success: boolean; transactionId: string }> {
  // Stub — real implementation lives in the payments service
  return {
    success: true,
    transactionId: `txn_${intent.orderId}_${Date.now()}`,
  };
}
