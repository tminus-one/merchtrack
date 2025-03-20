'use client';

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/protected/product-card";
import ProductGridSkeleton from "@/components/skeletons/product-grid-skeleton";
import ProductEmptyState from "@/components/product/product-empty-state";
import ProductPagination from "@/components/product/product-pagination";
import { QueryParams } from "@/types/common";
import { useProductsQuery } from "@/hooks/products.hooks";

const ITEMS_PER_PAGE = 12;

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Build query with all filters
  const query: QueryParams = {
    page: currentPage,
    where: { isDeleted: false },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    orderBy: { updatedAt: 'desc' as const },
    limit: ITEMS_PER_PAGE,
  };

  // Apply search filter
  const search = searchParams.get('search');
  if (search) {
    query.where = {
      ...query.where,
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    };
  }

  // Apply category filter
  const categories = searchParams.get('categories');
  if (categories) {
    const categoryIds = categories.split(',');
    if (categoryIds.length > 0) {
      query.where = {
        ...query.where,
        categoryId: { in: categoryIds }
      };
    }
  }

  // Apply inventory type filter
  const inventoryType = searchParams.get('inventoryType');
  if (inventoryType) {
    const types = inventoryType.split(',');
    if (types.length > 0) {
      query.where = {
        ...query.where,
        inventoryType: { in: types }
      };
    }
  }

  // Apply price range filter
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    const priceConditions = [];
    
    if (minPrice) {
      priceConditions.push({ price: { gte: parseFloat(minPrice) } });
    }
    
    if (maxPrice) {
      priceConditions.push({ price: { lte: parseFloat(maxPrice) } });
    }

    query.where = {
      ...query.where,
      variants: {
        some: {
          AND: priceConditions
        }
      }
    };
  }

  // Apply sorting
  const sort = searchParams.get('sort');
  if (sort) {
    switch (sort) {
    case 'newest':
      query.orderBy = { createdAt: 'desc' };
      break;
    case 'rating':
      query.orderBy = { rating: 'desc' };
      break;
    case 'bestseller':
      query.where = {
        ...query.where,
        isBestPrice: true
      };
      query.orderBy = { rating: 'desc' };
      break;
    }
  }

  const { data: productsResult, isLoading } = useProductsQuery(query);

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  const products = productsResult?.data ?? [];
  const totalItems = productsResult?.metadata?.total ?? 0;
  const totalPages = Math.ceil((totalItems || 0) / ITEMS_PER_PAGE);

  // Special handling for price sorting (client-side)
  const sortedProducts = sort === 'price_asc' || sort === 'price_desc'
    ? [...(products || [])].sort((a, b) => {
      const aPrice = a.variants.length > 0 
        ? Math.min(...a.variants.map(v => Number(v.price))) 
        : Number.MAX_VALUE;
      const bPrice = b.variants.length > 0 
        ? Math.min(...b.variants.map(v => Number(v.price))) 
        : Number.MAX_VALUE;
      
      return sort === 'price_asc' ? aPrice - bPrice : bPrice - aPrice;
    })
    : products;

  if (!sortedProducts?.length) {
    return <ProductEmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            index={index}
          />
        ))}
      </div>

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={ITEMS_PER_PAGE}
        totalItems={totalItems || 0}
      />
    </>
  );
}
