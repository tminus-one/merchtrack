'use server';

import { cache } from 'react';
import { Category } from '@prisma/client';
import prisma from '@/lib/db';

export type CategoryWithProductInfo = Category & {
  products: {
    id: string;
    title: string;
    imageUrl: string[];
  }[];
};

/**
 * Gets all categories with related product information
 * Cached for 15 minutes through the page that uses it
 */
export const getCategoriesWithProducts = cache(async (): Promise<CategoryWithProductInfo[]> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        products: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
          take: 4,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories as CategoryWithProductInfo[];
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    return [];
  }
});