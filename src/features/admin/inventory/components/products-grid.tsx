'use client';

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useDebounce } from 'use-debounce';
import { ProductCard , FilterSidebar } from ".";

import { useProductsQuery } from "@/hooks/products.hooks";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginatedResponse } from "@/types/common";
import type { ExtendedProduct } from "@/types/extended";
import type { StockStatus } from "@/types/products";

const ITEMS_PER_PAGE = 12;
const SKELETON_COUNT = 6;

function ProductSkeletonItem() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map(() => (
        <ProductSkeletonItem key={`skeleton-item-${crypto.randomUUID()}`} />
      ))}
    </div>
  );
}

function NoProductsFound() {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center">
      <h3 className="text-lg font-semibold">No products found</h3>
      <p className="text-muted-foreground mt-2">
        Try adjusting your search or filter to find what you&apos;re looking for.
      </p>
    </div>
  );
}

interface ProductFilterState {
  inventoryType: ("PREORDER" | "STOCK")[];
  categories: string[];
  priceRange: [number, number];
  tags: string[];
  stockStatus: StockStatus[];
}

export default function ProductsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryType, setInventoryType] = useState("all");
  const [filters, setFilters] = useState<ProductFilterState>({
    inventoryType: [],
    categories: [],
    priceRange: [0, 5000],
    tags: [],
    stockStatus: []
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [parent] = useAutoAnimate();

  const queryParams = useMemo(() => ({
    limit: 12,
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    page: currentPage,
    where: {
      isDeleted: false,
      ...(debouncedSearch ? {
        OR: [
          { title: { contains: debouncedSearch, mode: 'insensitive' } },
          { description: { contains: debouncedSearch, mode: 'insensitive' } },
          { tags: { has: debouncedSearch } }
        ]
      } : {}),
      ...(inventoryType !== "all" ? { inventoryType } : {}),
      ...(filters.categories.length > 0 ? { categoryId: { in: filters.categories } } : {}),
      ...(filters.tags.length > 0 ? { tags: { hasSome: filters.tags } } : {}),
      ...(filters.stockStatus.length > 0 ? {
        variants: {
          some: {
            OR: filters.stockStatus.map(status => {
              switch (status) {
              case "IN_STOCK":
                return { inventory: { gt: 5 } };
              case "LOW_STOCK":
                return { inventory: { gt: 0, lte: 5 } };
              case "OUT_OF_STOCK":
                return { inventory: { equals: 0 } };
              default:
                return {};
              }
            })
          }
        }
      } : {})
    },
    orderBy: {
      createdAt: 'desc' as const
    }
  }), [currentPage, debouncedSearch, inventoryType, filters]);

  const { data, isLoading } = useProductsQuery(queryParams);
  const products = (data as PaginatedResponse<ExtendedProduct[]>)?.data ?? [];
  const metadata = (data as PaginatedResponse<ExtendedProduct[]>)?.metadata ?? {
    total: 0,
    page: 1,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleInventoryTypeChange = (value: string) => {
    setInventoryType(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
            <Input
              placeholder="Search products by name, description, or tags..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={inventoryType}
              onValueChange={handleInventoryTypeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="PREORDER">Pre-order</SelectItem>
                <SelectItem value="STOCK">In Stock</SelectItem>
              </SelectContent>
            </Select>
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="mr-2 size-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <FilterSidebar 
                  products={products}
                  filters={filters}
                  setFilters={setFilters}
                  className="mt-4"
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <FilterSidebar 
          products={products}
          filters={filters}
          setFilters={setFilters}
          className="hidden rounded-lg bg-white p-6 shadow-sm md:block"
        />
        
        <div className="min-h-[500px] rounded-lg bg-white p-6 shadow-sm">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <NoProductsFound />
          ) : (
            <>
              <div ref={parent} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {metadata.total > 0 && (
                <div className="mt-8 flex items-center justify-between px-2">
                  <div className="text-muted-foreground text-sm">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, metadata.total)} of {metadata.total} entries
                  </div>
                  <Pagination
                    page={currentPage}
                    total={metadata.lastPage}
                    onChange={handlePageChange}
                    hasNextPage={currentPage < metadata.lastPage}
                    hasPrevPage={currentPage > 1}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
