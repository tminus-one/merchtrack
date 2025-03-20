import { Metadata } from 'next';
import { Suspense } from 'react';
import PrivacyPolicyBody from '@/components/public/privacy-policy-body';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Privacy Policy | MerchTrack',
  description: 'Learn how we collect, use, and protect your personal information at MerchTrack.',
};

// Enable static rendering for this page
export const dynamic = 'force-static';

// Set revalidation time to 1 day (in seconds)
export const revalidate = 86400;

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spinner size="lg" /></div>}>
        <PrivacyPolicyBody />
      </Suspense>
    </main>
  );
}