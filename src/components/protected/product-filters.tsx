import { useState } from "react";
import { Category } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFiltersProps {
  categories: Category[];
  onFilterChange: (filters: ProductFilters) => void;
  initialFilters?: ProductFilters;
}

interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  inventoryType: string[];
  availability: string[];
}

export default function ProductFilters({ 
  categories, 
  onFilterChange,
  initialFilters = {
    categories: [],
    priceRange: [0, 5000],
    inventoryType: [],
    availability: []
  }
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateSelectedFilters(newFilters);
  };

  const updateSelectedFilters = (currentFilters: ProductFilters) => {
    const newSelectedFilters: string[] = [];

    // Add category filters
    if (currentFilters.categories.length > 0) {
      const categoryNames = currentFilters.categories.map(id => 
        categories.find(c => c.id === id)?.name || ''
      );
      newSelectedFilters.push(`Categories: ${categoryNames.join(', ')}`);
    }

    // Add price range filter
    if (currentFilters.priceRange[0] !== 0 || currentFilters.priceRange[1] !== 5000) {
      newSelectedFilters.push(
        `Price: ₱${currentFilters.priceRange[0]} - ₱${currentFilters.priceRange[1]}`
      );
    }

    // Add inventory type filters
    if (currentFilters.inventoryType.length > 0) {
      newSelectedFilters.push(`Type: ${currentFilters.inventoryType.join(', ')}`);
    }

    // Add availability filters
    if (currentFilters.availability.length > 0) {
      newSelectedFilters.push(`Stock: ${currentFilters.availability.join(', ')}`);
    }

    setSelectedFilters(newSelectedFilters);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Categories:')) {
      handleFilterChange('categories', []);
    } else if (filter.startsWith('Price:')) {
      handleFilterChange('priceRange', [0, 5000]);
    } else if (filter.startsWith('Type:')) {
      handleFilterChange('inventoryType', []);
    } else if (filter.startsWith('Stock:')) {
      handleFilterChange('availability', []);
    }
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      categories: [],
      priceRange: [0, 5000],
      inventoryType: [],
      availability: []
    };
    // @ts-expect-error - type assertion is not needed
    setFilters(defaultFilters);
    // @ts-expect-error - type assertion is not needed
    onFilterChange(defaultFilters);
    setSelectedFilters([]);
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedFilters.map((filter) => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="flex items-center gap-1 pr-2">
                    {filter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter)}
                    >
                      <X className="size-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <Card className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {/* Categories */}
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...filters.categories, category.id]
                            : filters.categories.filter(id => id !== category.id);
                          handleFilterChange('categories', newCategories);
                        }}
                      />
                      <Label htmlFor={category.id}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-2">
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  className="py-4"
                />
                <div className="flex items-center justify-between space-x-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value)) {
                        handleFilterChange('priceRange', [
                          value,
                          filters.priceRange[1]
                        ]);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value)) {
                        handleFilterChange('priceRange', [
                          filters.priceRange[0],
                          value
                        ]);
                      }
                    }}
                    className="w-24"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Inventory Type */}
          <AccordionItem value="type">
            <AccordionTrigger>Product Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {['STOCK', 'PREORDER'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.inventoryType.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...filters.inventoryType, type]
                          : filters.inventoryType.filter(t => t !== type);
                        handleFilterChange('inventoryType', newTypes);
                      }}
                    />
                    <Label htmlFor={type}>{type === 'STOCK' ? 'In Stock' : 'Pre-order'}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Availability */}
          <AccordionItem value="availability">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: 'IN_STOCK', label: 'In Stock (>5)' },
                  { id: 'LOW_STOCK', label: 'Low Stock (≤5)' },
                  { id: 'OUT_OF_STOCK', label: 'Out of Stock' }
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={filters.availability.includes(id)}
                      onCheckedChange={(checked) => {
                        const newAvailability = checked
                          ? [...filters.availability, id]
                          : filters.availability.filter(a => a !== id);
                        handleFilterChange('availability', newAvailability);
                      }}
                    />
                    <Label htmlFor={id}>{label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}