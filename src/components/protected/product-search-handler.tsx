'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@prisma/client';
import { Search } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import ProductFilters from './product-filters';
import { ProductFilters as ProductFiltersType } from '@/types/products';
import { useUserStore } from '@/stores/user.store';
import { useDebouncedValue } from '@/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProductSearchHandlerProps = {
  categories: Category[];
  initialFilters?: ProductFiltersType;
  disableUrlUpdate?: boolean;
}

export default function ProductSearchHandler({ 
  categories,
  disableUrlUpdate = false
}: Readonly<ProductSearchHandlerProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSearch = searchParams?.get('search') ?? '';
  const currentSort = searchParams?.get('sort') ?? 'featured';
  const { user } = useUserStore();
  
  // State for search and sort values
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [sortValue, setSortValue] = useState(currentSort);
  
  // Create debounced versions of the values
  const debouncedSearch = useDebouncedValue(searchValue, 500);
  const debouncedSort = useDebouncedValue(sortValue, 300);
  
  // Effect to update URL when debounced values change
  useEffect(() => {
    // Don't update URL if we're on dashboard or if URL updating is disabled
    if (disableUrlUpdate || pathname === '/dashboard') {
      return;
    }
    
    const params = new URLSearchParams(searchParams?.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    if (debouncedSort && debouncedSort !== 'featured') {
      params.set('sort', debouncedSort);
    } else {
      params.delete('sort');
    }
    
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    // Prevent unnecessary navigation if values haven't changed
    const currentUrl = `/products?${params.toString()}`;
    const currentPath = window.location.pathname + window.location.search;
    if (currentUrl !== currentPath) {
      router.push(currentUrl);
    }
    
  }, [debouncedSearch, debouncedSort, router, searchParams, pathname, disableUrlUpdate]);

  const handleFilterChange = (filters: ProductFiltersType) => {
    // Don't update URL if we're on dashboard or if URL updating is disabled
    if (disableUrlUpdate || pathname === '/dashboard') {
      return;
    }
    
    const params = new URLSearchParams();
    
    if (searchValue) {
      params.set('search', searchValue);
    }
    
    if (sortValue !== 'featured') {
      params.set('sort', sortValue);
    }
    
    // Add category filters
    if (filters.categories?.length) {
      params.set('categories', filters.categories.join(','));
    }
    
    // Add price range filters
    if (filters.priceRange?.[0] > 0) {
      params.set('minPrice', filters.priceRange[0].toString());
    }
    if (filters.priceRange?.[1] < 5000) {
      params.set('maxPrice', filters.priceRange[1].toString());
    }
    
    // Add inventory type filters
    if (filters.inventoryType?.length) {
      params.set('inventoryType', filters.inventoryType.join(','));
    }
    
    // Add availability filters
    if (filters.availability?.length) {
      params.set('availability', filters.availability.join(','));
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Navigate with the new filters
    router.push(`/products?${params.toString()}`);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchValue.trim() && pathname === '/dashboard') {
      // If on dashboard, navigate directly to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pr-10"
          />
          {pathname === '/dashboard' ? (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
              onClick={handleSearch}
            >
              <Search className="text-muted-foreground size-4" />
              <span className="sr-only">Search</span>
            </Button>
          ) : (
            <Search className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          )}
        </div>

        <Select 
          value={sortValue} 
          onValueChange={setSortValue}
        >
          <SelectTrigger className="w-[180px] shrink-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="bestseller">Best Sellers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {user ? (
        <ProductFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          initialFilters={{
            categories: searchParams?.get('categories')?.split(',').filter(Boolean) ?? [],
            inventoryType: searchParams?.get('inventoryType')?.split(',').filter(Boolean) ?? [],
            availability: searchParams?.get('availability')?.split(',').filter(Boolean) ?? [],
            priceRange: [
              Number(searchParams?.get('minPrice')) || 0,
              Number(searchParams?.get('maxPrice')) || 5000
            ]
          }}
        />
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-muted-foreground mb-2 text-sm">Sign in to access advanced filters and special pricing!</p>
          <SignInButton mode="modal">
            <Button variant="default" size="sm">Sign in</Button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}