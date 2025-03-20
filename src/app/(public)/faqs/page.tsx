import { Metadata } from 'next';
import { Suspense } from 'react';
import FAQBody from '@/components/public/faq-body';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | MerchTrack',
  description: 'Find answers to common questions about our merchandise, ordering process, and policies.',
};

// Enable static rendering for this page
export const dynamic = 'force-static';

// Set revalidation time to 1 day (in seconds)
export const revalidate = 86400;

export default function FAQPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spinner size="lg" /></div>}>
        <FAQBody />
      </Suspense>
    </main>
  );
}