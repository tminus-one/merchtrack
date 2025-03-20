import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutUsBody from '@/components/public/about-us-body';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'About Us | MerchTrack',
  description: 'Learn about the team behind MerchTrack and our mission to revolutionize merchandise management.',
};

// Enable static rendering for this page
export const dynamic = 'force-static';

// Set revalidation time to 1 day (in seconds)
export const revalidate = 86400;

export default function AboutPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spinner size="lg" /></div>}>
        <AboutUsBody />
      </Suspense>
    </main>
  );
}