"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useProductsQuery } from "@/hooks/products.hooks";
import { ExtendedProduct } from "@/types/extended";
import { PaginationFooter } from "@/app/admin/survey/components/pagination-footer";
import ProductRecommendationSkeleton from "@/components/product/product-recommendation-skeleton";

import ProductCard from "@/components/protected/product-card";

export default function ProductRecommendations() {
  const [page, setPage] = React.useState(1);
  const ITEMS_PER_PAGE = 6;
  
  const { data: recommendedProducts, isLoading } = useProductsQuery({
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE, 
    limit: 6,
    orderBy: {
      createdAt: "desc",
    },
    page,
  });

  function handlePageChange(page: number) {
    setPage(page);
  }



  const totalItems = recommendedProducts?.metadata.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (isLoading) {
    return (<ProductRecommendationSkeleton />);
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <h3 className="mb-4 text-xl font-semibold">Recommended Products</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {recommendedProducts?.data?.map((product: ExtendedProduct) => (
            <ProductCard
              key={product.id}
              {...product}
              index={0}
            />
          ))}
        </div>
        <PaginationFooter 
          currentPage={page} 
          totalPages={totalPages}
          totalItems={totalItems} 
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}