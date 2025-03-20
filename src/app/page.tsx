import { Suspense } from "react";
import { Metadata } from "next";
import HeaderLP from "@/components/public/header";
import CallToAction from "@/components/public/landing/call-to-action";
import FeaturedProducts from "@/components/public/landing/featured-products";
import HeroSection from "@/components/public/landing/hero-section";
import CategoriesSection from "@/components/public/landing/categories-section";
import UniversityMerchSection from "@/components/public/landing/university-merch-section";
import SmoothScrollLayout from "@/components/public/smooth-scroll-layout";
import Footer from "@/components/protected/footer";
import { getFeaturedProducts, getCategories } from "@/actions/landing.actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Set revalidation time to 15 minutes
export const revalidate = 900;

export const metadata: Metadata = {
  title: "MerchTrack - University Merchandise Management",
  description: "Shop for high-quality university merchandise and apparel.",
  openGraph: {
    title: "MerchTrack - University Merchandise",
    description: "Shop for high-quality university merchandise and apparel.",
    url: '/',
    siteName: 'MerchTrack',
    images: [
      {
        url: '/img/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MerchTrack',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Home() {
  const featuredProductsPromise = getFeaturedProducts();
  const categoriesPromise = getCategories();

  const [featuredProducts, categories] = await Promise.all([
    featuredProductsPromise,
    categoriesPromise,
  ]);

  return (
    <SmoothScrollLayout>
      <main className="relative w-full font-inter">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <HeaderLP />
          <HeroSection />
          <Suspense fallback={<LoadingSpinner />}>
            <CategoriesSection categories={categories} />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts products={featuredProducts} />
          </Suspense>
          <UniversityMerchSection />
          <CallToAction />
        </div>
      </main>
      <Footer />
    </SmoothScrollLayout>
  );
}
