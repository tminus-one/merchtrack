import type { FC } from 'react';
import PageAnimation from '@/components/public/page-animation';
import PageTitle from '@/components/private/page-title';
import NewProductContainer from '@/app/admin/inventory/new/(components)/new-product-container';

export const metadata = {
  title: 'Create Product | Admin Dashboard',
  description: 'View and manage products'
};  

const Page: FC = () => {
  return (
    <PageAnimation>
      <div className="p-6">
        <PageTitle title='New Product' />
        <div className="space-y-4">
          <NewProductContainer />
        </div>
      </div>
    </PageAnimation>
  );
};

export default Page;