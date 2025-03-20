'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@prisma/client';
import { Search } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import ProductFilters from './product-filters';
import { ProductFilters as ProductFiltersType } from '@/types/products';
import { useUserStore } from '@/stores/user.store';
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
}

export default function ProductSearchHandler({ 
  categories,
}: Readonly<ProductSearchHandlerProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams?.get('search') ?? '';
  const currentSort = searchParams?.get('sort') ?? 'featured';
  const { user } = useUserStore();
  
  const handleFilterChange = (filters: ProductFiltersType) => {
    const params = new URLSearchParams();
    
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    
    if (currentSort !== 'featured') {
      params.set('sort', currentSort);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    const sort = formData.get('sort') as string;
    
    const params = new URLSearchParams(searchParams?.toString());
    
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    
    if (sort && sort !== 'featured') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Input
            name="search"
            type="search"
            placeholder="Search products..."
            defaultValue={currentSearch}
            className="pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
          >
            <Search className="size-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <Select name="sort" defaultValue={currentSort}>
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
      </form>

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