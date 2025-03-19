'use client';

import { QueryParams } from "@/types/common";
import { getPendingPaymentOrders } from "@/actions/orders.actions";
import { useUserStore } from "@/stores/user.store";
import { useResourceQuery } from "@/hooks/index.hooks";

export function usePendingPaymentOrdersQuery(params: QueryParams) {
  const { userId } = useUserStore();

  return useResourceQuery({
    resource: "orders:pending",
    fetcher: () => getPendingPaymentOrders(userId!, params),
    params
  });
}