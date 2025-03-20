// Create a new server action for fetching features products
'use server';

import { cache } from 'react';
import prisma from '@/lib/db';


export type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  image: string[];
  badge?: string;
  slug: string;
};

export type CategoryWithProducts = {
  id: string;
  name: string;
  description?: string | null;
  image: string;
  href: string;
};

export const getFeaturedProducts = cache(async (): Promise<FeaturedProduct[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        reviewsCount: 'desc',
      },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        variants: {
          select: {
            price: true,
          },
          take: 1,
        },
        tags: true,
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.title,
      price: Number(product.variants[0]?.price || 0),
      image: product.imageUrl,
      badge: product.tags?.[0] || 'Featured',
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
});

export const getCategories = cache(async (): Promise<CategoryWithProducts[]> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        products: {
          where: {
            isDeleted: false,
          },
          select: {
            imageUrl: true,
          },
          take: 1,
        },
      },
      take: 3,
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.products[0]?.imageUrl[0] || '/img/placeholder.jpg',
      href: `/categories/${category.id}`,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
});