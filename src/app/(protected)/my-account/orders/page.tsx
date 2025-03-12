import React from 'react';
import { OrderHistory } from '@/components/public/profile/order-history';
import PageAnimation from '@/components/public/page-animation';

export const metadata = {
  title: 'Order History | MerchTrack',
  description: 'View and manage your order history',
};

export default function OrderHistoryPage() {
  return (
    <PageAnimation className='max-w-full'>
      <OrderHistory />
    </PageAnimation>
  );
}