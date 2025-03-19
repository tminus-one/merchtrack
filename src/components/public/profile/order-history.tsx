'use client';

import { toast } from 'sonner';
import { FaStar } from "react-icons/fa";
import { Package, ClipboardList, Search, CircleAlert } from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import MyProfileSideBar from './my-profile-sidebar';
import { OrderDetailsDialog } from './order-details-dialog';
import { PaymentDialog } from './payment-dialog';
import { useOrdersQuery } from '@/hooks/orders.hooks';
import { useUserStore } from '@/stores/user.store';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { markOrderAsReceived } from "@/app/user/orders/_actions";

const getOrderStatusStyle = (status: OrderStatus) => {
  switch (status) {
  case 'PENDING': return 'bg-yellow-100 text-yellow-800';
  case 'PROCESSING': return 'bg-blue-100 text-blue-800';
  case 'READY': return 'bg-purple-100 text-purple-800';
  case 'DELIVERED': return 'bg-green-100 text-green-800';
  default: return 'bg-gray-100 text-gray-800';
  }
};

const ORDER_STATUS_TABS = [
  { value: 'ALL', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Delivered' },
] as const;

export function OrderHistory() {
  const { userId } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | OrderStatus>('ALL');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: ordersResponse, isLoading, refetch } = useOrdersQuery({
    where: {
      customerId: userId,
      isDeleted: false
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      CustomerSatisfactionSurvey: true,
    }
  });

  const orders = ordersResponse?.data || [];
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePaymentModalOpen = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrderId(null);
    refetch();
  };

  const handleMarkAsReceived = async (orderId: string) => {
    try {
      const result = await markOrderAsReceived(orderId, userId!);
      if (result.success) {
        toast.success('Order marked as received! A survey has been generated for your feedback.');
        refetch();
      } else {
        toast.error(result.message || 'Failed to mark order as received');
      }
    } catch {
      toast.error('An error occurred while marking the order as received');
    }
  };

  const handleTakeSurvey = (surveyId: string) => {
    window.location.href = `/survey?id=${surveyId}`;
  };

  const handleReviewProduct = (productId: string) => {
    window.location.href = `/products/${productId}#reviews`;
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="w-full lg:w-1/4">
          <MyProfileSideBar />
        </div>
        
        <div className="flex-1">
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-6 text-blue-600" />
                <div>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track all your orders</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6">
                <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as typeof selectedStatus)}>
                  <TabsList className="mb-4 w-full">
                    {ORDER_STATUS_TABS.map((tab) => (
                      <TabsTrigger 
                        key={tab.value} 
                        value={tab.value}
                        className="flex-1"
                      >
                        {tab.label}
                        <span className="ml-2 text-xs">
                          ({orders.filter(order => tab.value === 'ALL' ? true : order.status === tab.value).length})
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search orders by ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner className="mr-2" />
                  <span>Loading orders...</span>
                </div>
              ) : !filteredOrders.length ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Package className="mb-4 size-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold">No Orders Found</h3>
                  <p className="text-sm text-gray-600">
                    {searchTerm ? 'No orders match your search' : 'You haven\'t placed any orders yet'}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="bg-card hover:bg-accent/5 flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <button type='button' className="flex size-16 cursor-pointer items-center justify-center rounded-lg bg-primary/5"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsDetailsModalOpen(true);
                            }}>
                            <Package className="size-8 text-primary" />
                          </button>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className={cn("font-medium", getOrderStatusStyle(order.status))}>
                                {order.status}
                              </Badge>
                              <span className="text-muted-foreground text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span className="font-medium text-primary">
                                {formatCurrency(Number(order.totalAmount))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          {(order.paymentStatus === 'PENDING' || order.paymentStatus === 'DOWNPAYMENT') ? (
                            <Button 
                              variant="outline"
                              className="border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:text-orange-700"
                              onClick={() => handlePaymentModalOpen(order.id)}
                            >
                              <CircleAlert className="mr-2 size-4" />
                              Complete Payment
                            </Button>
                          ) : (
                            <>
                              {order.status === 'READY' && (
                                <Button
                                  onClick={() => handleMarkAsReceived(order.id)}
                                  variant="outline"
                                  className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                >
                                  Mark as Received
                                </Button>
                              )}
                              
                              {order.status === 'DELIVERED' && (
                                <>
                                  {!order.CustomerSatisfactionSurvey?.[0]?.metadata && (<Button
                                    onClick={() => handleTakeSurvey(order.CustomerSatisfactionSurvey?.[0]?.id ?? '')}
                                    variant="outline"
                                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                  >
                                    Take Survey
                                  </Button>)}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
                                      >
                                        <FaStar className="mr-2" /> Review Items
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white">
                                      {order.orderItems.map((item) => (
                                        <DropdownMenuItem
                                          key={item.id}
                                          onClick={() => item.variant?.product?.slug && handleReviewProduct(item.variant.product.slug)}
                                          className="transition-color flex cursor-pointer items-center hover:bg-primary-200"
                                        >
                                          <Image
                                            src={item.variant?.product?.imageUrl?.[0] || '/img/profile-placeholder-img.png'}
                                            alt={item.variant?.product?.title || 'Product'}
                                            width={32}
                                            height={32}
                                            className="mr-2 size-8 rounded object-cover"
                                          />
                                          <span>{item.variant?.product?.title || 'Product'}</span>
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}

                              {order.status === OrderStatus.PROCESSING && (<Button 
                                variant="outline" 
                                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                              >
                                <Link href={`/track-order?id=${order.id}`}>
                                  Track Order
                                </Link>
                              </Button>)}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentDialog
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        orderId={selectedOrderId}
        onPaymentComplete={handlePaymentComplete}
      />

      <OrderDetailsDialog
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        orderId={selectedOrderId}
      />
    </div>
  );
}