import { Product, Category, Review, ProductVariant, User } from "@prisma/client";

export interface ExtendedProductVariant extends ProductVariant {
  rolePricing: Record<string, number>;
}

export type ExtendedProduct = Product & {
  category: Category;
  reviews: ExtendedReview[];
  variants: ExtendedProductVariant[];
  postedBy: User;
}

export type GetObjectByTParams<T extends string> = {
  userId: string;
  limitFields?: string[];
  include?: Record<string, boolean | string | string[] | object>;
} & {
  [K in T]: string;
};

export type ExtendedReview = Review & {
  user: User;
}