export function getOrderStatus(orderId: string) {
  return { order_id: orderId, status: "In Transit", est_delivery: "Tomorrow" };
}

export function getUserTier(userId: string) {
  return { user_id: userId, current_tier: "Free", eligible_for_upgrade: true };
}