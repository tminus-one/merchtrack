import { Metadata } from 'next';
import { Suspense } from 'react';
import TermsOfServiceBody from '@/components/public/terms-of-service-body';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Terms of Service | MerchTrack',
  description: 'Read our terms of service to understand your rights and obligations when using MerchTrack.',
};

// Enable static rendering for this page
export const dynamic = 'force-static';

// Set revalidation time to 1 day (in seconds)
export const revalidate = 86400;

export default function TermsOfServicePage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spinner size="lg" /></div>}>
        <TermsOfServiceBody />
      </Suspense>
    </main>
  );
}