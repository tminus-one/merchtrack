'use server';

import { updateOrderStatus } from "@/app/admin/orders/[orderId]/_actions";
import { OrderStatus } from "@/types/orders";

/**
 * Allows a user to mark their order as received/delivered.
 * This will trigger the delivery confirmation email and generate a survey.
 */
export async function markOrderAsReceived(
  orderId: string,
  userId: string,
): Promise<ActionsReturnType<{ success: boolean }>> {
  try {
    // Reuse the admin updateOrderStatus action, but only allow setting to DELIVERED
    const result = await updateOrderStatus(orderId, OrderStatus.DELIVERED, userId);
    
    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to mark order as received"
      };
    }

    return {
      success: true,
      data: { success: true }
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}