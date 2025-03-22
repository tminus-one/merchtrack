'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@prisma/client';
import { motion } from 'framer-motion';

type CategoryShowcaseProps = {
  categories: (Category & {
    products: {
      imageUrl: string[];
      title: string;
      description: string;
    }[];
  })[];
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationVariants?: any;
}

const DEFAULT_IMAGES = [
  '/img/carousel-image.jpg',
  '/img/carousel-image.jpg',
];

export default function CategoryShowcase({ 
  categories = [], 
  title = 'Popular Categories',
  animationVariants = null
}: Readonly<CategoryShowcaseProps>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Fallback categories if none are provided
  const displayCategories = categories.length > 0 
    ? categories 
    : [];

  // Scroll the category container left/right
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Determine if we should use motion divs
  const CategoryItem = animationVariants ? motion.div : 'div';

  return (
    <section className="py-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="hidden rounded-full border border-gray-300 p-2 transition-colors hover:bg-primary hover:text-white md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden rounded-full border border-gray-300 p-2 transition-colors hover:bg-primary hover:text-white md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        
        {/* Scrollable categories */}
        <div 
          ref={scrollContainerRef} 
          className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4"
        >
          {displayCategories.map((category) => (
            <CategoryItem
              key={category.id}
              {...(animationVariants ? { variants: animationVariants } : {})}
              className="w-[180px] shrink-0 snap-start"
            >
              <Link
                href={`/products?category=${category.id}`}
                className="block"
              >
                <div className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  {/* Category Image */}
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <Image
                      src={category.products[0]?.imageUrl[0] || DEFAULT_IMAGES[0]}
                      alt={category.name}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <div className="p-3 text-center">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{category.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            </CategoryItem>
          ))}
        </div>
      </div>
    </section>
  );
}