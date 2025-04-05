'use client';
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Star, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignInButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import type { ExtendedProduct } from "@/types/extended";

;

interface ProductCardProps extends ExtendedProduct {
  index?: number;
}

export default function ProductCard({ index = 0, ...product }: Readonly<ProductCardProps>) {
  const { user } = useUserStore();
  const lowestPrice = product.variants.length > 0
    ? Math.min(...product.variants.map(v => Number(v.price)))
    : 0;
  const inStock = product.variants.some(v => v.inventory > 0);
  const isPreorder = product.inventoryType === 'PREORDER';
  const router = useRouter();

  const handleProductAction = () => {
    if (!user) {
      return toast.error("You need to sign in add to cart.", {
        description: "Please sign in to add products to your cart.",
        action: 
        <Button asChild>
          <SignInButton mode="modal" forceRedirectUrl={`/products/${product.slug}`} />
        </Button>,
      });
    }
    router.push(`/products/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1 }
      }}
      whileHover={{ y: -5 }}
      className="group relative h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="relative block">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.imageUrl[0] || '/img/product-placeholder.png'}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Tags and Status */}
          <div className="absolute inset-x-2 top-2 flex flex-wrap justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="hidden bg-primary/80 backdrop-blur-sm md:flex"
                >
                  <Tag className="mr-1 size-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            {!inStock && !isPreorder && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {isPreorder && (
              <Badge variant="secondary" className="hidden bg-blue-100 text-blue-800 md:flex">
                Pre-order
              </Badge>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex h-full flex-col space-y-3 p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 font-semibold">
              <Link href={`/products/${product.slug}`} className="hover:text-primary">
                {product.title}
              </Link>
            </h3>
            <div 
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: product.description ? DOMPurify.sanitize(product.description) : `Grab your ${product.title} today.` }} 
              className="line-clamp-1 text-sm text-gray-500" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">
                ₱{lowestPrice.toLocaleString()}
              </div>
              {product.discountLabel && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {product.discountLabel}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <Button
              className={cn(
                "w-full gap-2 transition-colors",
                !inStock && !isPreorder && "cursor-not-allowed opacity-50"
              )}
              onClick={handleProductAction}
              disabled={!inStock && !isPreorder}
            >
              <ShoppingCart className="size-4" />
              {isPreorder ? "Pre-order Now" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}