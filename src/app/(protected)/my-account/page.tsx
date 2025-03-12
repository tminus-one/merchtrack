import React from 'react';
import MyAccountBody from '@/components/public/profile/my-account-body';
import PageAnimation from '@/components/public/page-animation';

export const metadata = {
  title: 'My Account | MerchTrack',
  description: 'Manage your account settings, orders, payments, and more',
};

const Page: React.FC = () => {
  return (
    <PageAnimation className='max-w-full'>
      <MyAccountBody />
      
    </PageAnimation>
  );
};

export default Page;