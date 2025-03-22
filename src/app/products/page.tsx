import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { SlidersHorizontal } from "lucide-react";
import { Category } from "@prisma/client";
import { SignInButton } from "@clerk/nextjs";
import ProductGrid from "./components/product-grid";
import { getCategories } from "@/actions/category.actions";
import ProductSearchHandler from "@/components/protected/product-search-handler";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Merch & Products | MerchTrack",
  description: "Browse our collection of university merchandise and products.",
};

export default async function ProductsPage() {
  const { userId } = await auth();
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        
        {!userId && (
          <SignInButton mode="modal">
            <Button variant="default">
              Sign in to unlock features
            </Button>
          </SignInButton>
        )}
        
        {/* Mobile filter button */}
        {userId && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="mr-2 size-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Product Filters</SheetTitle>
                <SheetDescription>
                  Filter and sort products to find what you&apos;re looking for.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <ProductSearchHandler categories={categories as Category[]} />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductSearchHandler categories={categories as Category[]} />
        </Suspense>
      </div>

      {/* Products grid */}
      <div className="mt-6">
        <ProductGrid />
      </div>
    </div>
  );
}