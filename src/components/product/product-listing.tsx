'use client';

import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "sonner";
import ProductRecommendations from "./product-recommendations";
import UserReview from "./user-review";
import ProductReviews from "./product-reviews";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { useCartStore } from "@/stores/cart.store";
import QuantitySelector from "@/components/ui/quantity-selector";
import "./embla.css";
import EmblaCarousel from '@/components/ui/EmblaCarousel';
import { ExtendedProduct, ExtendedProductVariant } from "@/types/extended";
import { useRolePricing } from "@/hooks/use-role-pricing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ProductListingProps {
  product: ExtendedProduct;
  slug: string;
}

const ProductListing: React.FC<ProductListingProps> = ({ product, slug }) => {
  const { user } = useUserStore();
  const { addItem, setCartOpen } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<ExtendedProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const pricingDetails = useRolePricing({
    variant: {
      ...selectedVariant,
      price: selectedVariant?.price?.toString() ?? "0",
      rolePricing: selectedVariant?.rolePricing ?? {},
    },
    customerRole: user?.role ?? null,
    customerCollege: user?.college ?? null,
    productPostedByCollege: product?.postedBy?.college ?? null
  });

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      quantity,
      // @ts-expect-error - We're passing the variant object as the cart item object
      variant: {
        ...selectedVariant,
        product: {
          title: product.title,
          imageUrl: product.imageUrl,
        }
      }
    });

    toast.success('Added to cart!');
    setCartOpen(true);
  };

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => !prev);
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="mx-auto my-10 mt-20 flex max-w-5xl flex-1 flex-col items-stretch gap-16 rounded-lg bg-white p-6 md:flex-row">
        {/* Left Column - Image */}
        <div className="flex w-full md:w-1/2">
          <EmblaCarousel slides={product?.imageUrl ?? []} />
        </div>

        {/* Right Column - Text & Button */}
        <div className="flex flex-1 flex-col gap-4 text-left md:px-6">
          <h1 className="text-4xl font-bold text-gray-900">{product?.title}</h1>
          
          <div className="space-y-2">
            {selectedVariant && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl text-gray-900">{pricingDetails.formattedPrice}</h1>
                </div>
                {pricingDetails.appliedRole !== "OTHERS" && (
                  <p className="text-sm text-green-600">
                    Special pricing for {pricingDetails.appliedRole.toLowerCase().replace('_', ' ')}
                  </p>
                )}
                {!!pricingDetails.price && (
                  <p className="text-sm text-gray-500 line-through">
                    Original price: {pricingDetails.originalPrice}
                  </p>
                )}
              </>
            )}
          </div>

          {product?.description && (
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></p>
          )}
          
          <h3 className="mt-[20px] text-lg font-bold">Select Option</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:flex-wrap">
            {product?.variants.map((variant) => {
              const variantPricing = useRolePricing({
                // @ts-expect-error - We're passing the variant object as the rolePricing object
                variant,
                customerRole: user?.role ?? null,
                customerCollege: user?.college ?? null,
                productPostedByCollege: product?.postedBy?.college ?? null
              });

              // Check if inventory exists and is zero or if inventory field doesn't exist at all
              const isOutOfStock = (!variant.inventory || variant.inventory === 0) && product.inventoryType === 'STOCK';
              const isSelected = selectedVariant?.id === variant.id;
              
              return (
                <div 
                  key={variant.id} 
                  className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${isOutOfStock ? 'opacity-70' : ''}`}
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                    disabled={isOutOfStock}
                    className={`
                      h-auto w-full min-w-[120px] border-2 px-4 py-3 
                      ${isSelected ? 'shadow-md ring-2 ring-primary ring-offset-1' : 'hover:border-primary/60 hover:shadow-sm'} 
                      ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}
                      transition-all duration-300 ease-in-out
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{variant.variantName}</span>
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                        {variantPricing.formattedPrice}
                      </span>
                      
                      {variant.inventory && variant.inventory > 0 && variant.inventory <= 5 && product.inventoryType === 'STOCK' && (
                        <span className="mt-1 text-xs font-medium text-amber-500">
                          Only {variant.inventory} left
                        </span>
                      )}
                    </div>
                  </Button>
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                      <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  
                  {isSelected && (
                    <>
                      <div className="absolute right-0 top-0 size-0 border-r-[24px] 
                        border-t-[24px] border-r-transparent 
                        border-t-primary shadow-lg">
                      </div>
                      <div className="absolute right-1 top-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="mt-6 text-lg font-bold">Quantity</h3>
          <div className="mt-2">
            <div className="flex items-center gap-4">
              <QuantitySelector 
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={selectedVariant && selectedVariant.inventory 
                  ? Math.min(10, selectedVariant.inventory)
                  : (product.inventoryType === 'STOCK' ? 10 : 20)}
              />
              {selectedVariant && selectedVariant.inventory && selectedVariant.inventory > 10 && (
                <span className="text-sm text-gray-500">
                  (Max: 10 per order)
                </span>
              )}
              {selectedVariant && product.inventoryType === 'STOCK' && (
                <span className="text-sm text-gray-500">
                  {selectedVariant.inventory > 10 
                    ? `${selectedVariant.inventory} in stock`
                    : selectedVariant.inventory > 1 
                      ? `Only ${selectedVariant.inventory} in stock` 
                      : `Last one in stock!`}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex">
            <Button 
              className={`
                group relative w-full overflow-hidden rounded-lg bg-primary py-3 text-white 
                transition-all duration-300 hover:bg-primary/90 hover:shadow-md
                ${!selectedVariant ? 'cursor-not-allowed opacity-70' : ''}
              `}
              onClick={handleAddToCart}
              disabled={!selectedVariant || ((!selectedVariant.inventory ||  selectedVariant.inventory === 0) && product.inventoryType === 'STOCK')}
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaCartPlus className="mr-2 size-5" />
                <span className="text-base font-medium">Add to Cart</span>
              </span>
              <span className="from-primary-dark absolute inset-0 -translate-x-full bg-gradient-to-r to-primary opacity-70 transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews and Recommendations */}
      <div className="mx-auto mt-16 w-full max-w-5xl">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommended">You Might Also Like</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews">
            <Card className="border-none shadow-none">
              <CardContent className="pt-6">
                {/* User Review Form or Existing Review */}
                {user ? (
                  <UserReview 
                    userId={user.id} 
                    productId={product.id} 
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                ) : (
                  <div className="mb-8 rounded-lg bg-gray-50 p-4 text-center">
                    <p>Please sign in to leave a review.</p>
                  </div>
                )}
                
                <h3 className="mb-4 text-xl font-semibold">Customer Reviews</h3>
                <ProductReviews slug={slug} key={refreshReviews ? 'refresh' : 'initial'} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommended">
            <ProductRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProductListing;