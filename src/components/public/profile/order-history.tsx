'use client';

import { toast } from 'sonner';
import { FaStar } from "react-icons/fa";
import { Package, ClipboardList, Search, CircleAlert } from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { motion } from "framer-motion";
import MyProfileSideBar from './my-profile-sidebar';
import { OrderDetailsDialog } from './order-details-dialog';
import { PaymentDialog } from './payment-dialog';
import MobileNav from "./mobile-nav";
import { useOrdersQuery } from '@/hooks/orders.hooks';
import { useUserStore } from '@/stores/user.store';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
    <>
      <MobileNav />
      <div className="container mx-auto p-4 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Sidebar - Hidden on mobile, shown as a sheet */}
          <div>
            <MyProfileSideBar />
          </div>
          
          <div className="flex-1">
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <ClipboardList className="size-5 text-primary sm:size-6" />
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Order History</CardTitle>
                    <CardDescription>View and track all your orders</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-3 sm:p-6">
                <div className="mb-4 space-y-4 sm:mb-6">
                  {/* Horizontally scrollable tabs */}
                  <ScrollArea className="w-full">
                    <div className="flex min-w-full">
                      <Tabs defaultValue="ALL" className="w-full">
                        
                        <TabsList className="flex w-full justify-start gap-1 p-1">
                          {ORDER_STATUS_TABS.map((tab) => (
                            <TabsTrigger 
                              key={tab.value} 
                              value={tab.value}
                              onClick={() => setSelectedStatus(tab.value as typeof selectedStatus)}
                              className={cn(
                                "relative flex min-w-[100px] items-center justify-center gap-2 whitespace-nowrap px-3 py-2 text-sm",
                                selectedStatus === tab.value && "text-primary"
                              )}
                            >
                              {tab.label}
                              <Badge 
                                variant="secondary" 
                                className={cn("ml-1 hover:bg-primary-400 bg-primary/10 text-xs", selectedStatus === tab.value ? "text-neutral-7 bg-primary-200" : "text-neutral-7")}
                              >
                                {orders.filter(order => 
                                  tab.value === 'ALL' ? true : order.status === tab.value
                                ).length}
                              </Badge>
                              {selectedStatus === tab.value && (
                                <motion.div
                                  layoutId="activeTab"
                                  className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                                />
                              )}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>
                    <ScrollBar orientation="horizontal" className="invisible" />
                  </ScrollArea>

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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex h-64 flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 rounded-full bg-primary/10 p-6">
                      <Package className="size-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No Orders Found</h3>
                    <p className="text-sm text-gray-600">
                      {searchTerm ? 'No orders match your search' : 'You haven\'t placed any orders yet'}
                    </p>
                    <Button asChild className="mt-6">
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-400px)] sm:h-[calc(100vh-350px)]">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {filteredOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                          }}
                        >
                          <div className="bg-card group rounded-lg border p-3 transition-all hover:shadow-md sm:p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              {/* Order Info */}
                              <div className="flex items-start gap-3 sm:items-center">
                                <button
                                  type="button"
                                  className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10 sm:size-14"
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setIsDetailsModalOpen(true);
                                  }}
                                >
                                  <Package className="size-6 text-primary sm:size-7" />
                                </button>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium">
                                    Order #{order.id.substring(0, 8)}
                                  </p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <Badge 
                                      variant="secondary" 
                                      className={cn("text-xs font-medium", getOrderStatusStyle(order.status))}
                                    >
                                      {order.status}
                                    </Badge>
                                    <span className="text-muted-foreground text-xs">
                                      {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium text-primary">
                                      {formatCurrency(Number(order.totalAmount))}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {(order.paymentStatus === 'PENDING' || order.paymentStatus === 'DOWNPAYMENT') ? (
                                  <Button 
                                    variant="outline"
                                    className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 sm:w-auto"
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
                                        className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 sm:w-auto"
                                      >
                                        Mark as Received
                                      </Button>
                                    )}
                                    
                                    {order.status === 'DELIVERED' && (
                                      <>
                                        {!order.CustomerSatisfactionSurvey?.[0]?.metadata && (
                                          <Button
                                            onClick={() => handleTakeSurvey(order.CustomerSatisfactionSurvey?.[0]?.id ?? '')}
                                            variant="outline"
                                            className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 sm:w-auto"
                                          >
                                            Take Survey
                                          </Button>
                                        )}
                                        
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="w-full border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 sm:w-auto"
                                            >
                                              <FaStar className="mr-2" /> Review Items
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent 
                                            align="end" 
                                            className="max-h-[300px] w-[280px] overflow-y-auto bg-white"
                                          >
                                            {order.orderItems.map((item) => (
                                              <DropdownMenuItem
                                                key={item.id}
                                                onClick={() => item.variant?.product?.slug && handleReviewProduct(item.variant.product.slug)}
                                                className="flex cursor-pointer items-center gap-2 p-2"
                                              >
                                                <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                                                  <Image
                                                    src={item.variant?.product?.imageUrl?.[0] || '/img/profile-placeholder-img.png'}
                                                    alt={item.variant?.product?.title || 'Product'}
                                                    fill
                                                    className="object-cover"
                                                  />
                                                </div>
                                                <span className="line-clamp-2 text-sm">
                                                  {item.variant?.product?.title || 'Product'}
                                                </span>
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </>
                                    )}

                                    {order.status === OrderStatus.PROCESSING && (
                                      <Button 
                                        variant="outline" 
                                        className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 sm:w-auto"
                                        asChild
                                      >
                                        <Link href={`/track-order?id=${order.id}`}>
                                          Track Order
                                        </Link>
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Existing modals */}
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
    </>
  );
}