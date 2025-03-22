"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ExtendedReview } from "@/types/extended";
import { prettyFormatDate } from "@/utils/format";
import { getProductReviewsBySlug } from "@/actions/products.actions";
import ProductReviewsSkeleton from "@/components/product/product-reviews-skeleton";
import { useUserStore } from "@/stores/user.store";
import UserAvatar from "@/components/shared/user-avatar";

interface ProductReviewsProps {
  slug: string;
}

export default function ProductReviews({ slug }: Readonly<ProductReviewsProps>) {
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUserStore();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await getProductReviewsBySlug({
          slug: slug,
          userId: userId as string,
        });

        if (response.success && response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [slug]);

  if (loading) {
    return <ProductReviewsSkeleton />;
  }

  return (
    <>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <div id="reviews" className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <UserAvatar 
                    userId={review.user.clerkId}
                    firstName={review.user.firstName!}
                    lastName={review.user.lastName!}
                    email={review.user.email!}
                    className="mr-2"
                    size="sm"
                  />
                  <p className="mr-3 text-sm font-semibold">{review.user.firstName} {review.user.lastName}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 md:mt-0">{prettyFormatDate(review.createdAt)}</p>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}