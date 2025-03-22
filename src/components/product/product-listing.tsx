'use client';

import { useEffect, useState, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { FaCartPlus } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
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
import useToast from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      delay: custom * 0.1,
      type: "spring",
      stiffness: 100
    }
  })
};

const priceVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: 0.2
    }
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { scale: 0.95 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

type ProductListingProps = {
  product: ExtendedProduct;
  slug: string;
}

const ProductListing: React.FC<ProductListingProps> = ({ product, slug }) => {
  const { user } = useUserStore();
  const { addItem, setCartOpen } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<ExtendedProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const toaster = useToast;
  
  // Animation refs
  const productInfoRef = useRef(null);
  const isProductInfoInView = useInView(productInfoRef, { once: true, amount: 0.2 });
  const variantsRef = useRef(null);
  const isVariantsInView = useInView(variantsRef, { once: true, amount: 0.2 });

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
    if (!user) {
      return toast.error("You need to sign in add to cart.", {
        description: "Please sign in to add products to your cart.",
        action: 
        <Button asChild>
          <SignInButton mode="modal" forceRedirectUrl={`/products/${product.slug}`} />
        </Button>,
      });
    }

    if (!selectedVariant) {
      return toaster({
        type: 'error',
        title: "Variant required",
        message: "Please select a variant before adding to cart",
      });
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

    toaster({
      title: 'Success',
      message: 'Added to cart!',
      type: 'success',
    });
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
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mx-auto mt-8 flex max-w-7xl flex-1 flex-col items-stretch gap-16 rounded-lg p-6 md:flex-row"
      >
        {/* Left Column - Image with fade in animation */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full md:w-1/2"
        >
          <EmblaCarousel 
            slides={product?.imageUrl ?? []} 
            autoplayInterval={6000} 
            autoplayEnabled={true}
          />
        </motion.div>

        {/* Right Column - Text & Button */}
        <motion.div 
          ref={productInfoRef}
          initial="hidden"
          animate={isProductInfoInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-1 flex-col gap-4 text-left md:px-6"
        >
          <motion.h1 
            variants={productVariants} 
            custom={0}
            className="text-4xl font-bold text-gray-900"
          >
            {product?.title}
          </motion.h1>
          
          <motion.div 
            variants={priceVariants}
            className="space-y-2"
          >
            {selectedVariant && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVariant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-primary">{pricingDetails.formattedPrice}</h1>
                  </div>
                  {pricingDetails.appliedRole !== "OTHERS" && (
                    <p className="text-sm text-green-600">
                      Special pricing for {pricingDetails.appliedRole.toLowerCase().replace('_', ' ')}
                    </p>
                  )}
                  {(!!pricingDetails.price && pricingDetails.formattedPrice !== pricingDetails.originalPrice )&& (
                    <p className="text-sm text-gray-500 line-through">
                      Original price: {pricingDetails.originalPrice}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {product?.description && (
            <motion.div 
              variants={productVariants}
              custom={1}
            >
              <p className="text-sm" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></p>
              <div className="mt-4 flex flex-wrap gap-1">
                {product?.tags?.map((tag, index) => (
                  <span key={index} className="mr-2 inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          
          <motion.h3 
            variants={productVariants}
            custom={2}
            className="mt-[20px] font-semibold"
          >
            Select Option
          </motion.h3>

          <motion.div 
            ref={variantsRef}
            initial="hidden"
            animate={isVariantsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:flex-wrap"
          >
            {product?.variants.map((variant, index) => {
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
                <motion.div 
                  key={variant.id} 
                  variants={productVariants}
                  custom={index}
                  className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${isOutOfStock ? 'opacity-70' : ''}`}
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                    disabled={isOutOfStock}
                    className={cn(
                      "h-auto w-full min-w-[120px] border-2 rounded-lg px-4 py-3 transition-all duration-300 ease-in-out",
                      isSelected 
                        ? "shadow-md ring-2 ring-primary border-primary-300 ring-offset-1 bg-primary-100 hover:bg-primary-100" 
                        : "hover:border-primary/60 hover:shadow-sm",
                      isOutOfStock 
                        ? "cursor-not-allowed" 
                        : "cursor-pointer"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium text-neutral-7">{variant.variantName}</span>
                      <span className={`text-sm font-bold text-primary`}>
                        {variantPricing.formattedPrice}
                      </span>
                      
                      {(variant.inventory && variant.inventory > 0 && variant.inventory <= 5 && product.inventoryType === 'STOCK') ? (
                        <span className="mt-1 text-xs font-medium text-amber-500">
                          Only {variant.inventory} left
                        </span>
                      ) : null}
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="z-10"
                    >
                      <div className="absolute right-0 top-0 size-0 border-r-[24px] border-t-[24px]
                        border-r-transparent border-t-primary 
                        bg-primary-400 shadow-lg">
                      </div>
                      <div className="absolute right-1 top-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.h3 
            variants={productVariants}
            custom={4}
            className="font-semibold"
          >
            Quantity
          </motion.h3>
          
          <motion.div 
            variants={productVariants}
            custom={5}
          >
            <div className="flex items-center gap-4">
              <QuantitySelector 
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={selectedVariant && selectedVariant.inventory 
                  ? Math.min(10, selectedVariant.inventory)
                  : (product.inventoryType === 'STOCK' ? 10 : 20)}
              />
              {selectedVariant && product.inventoryType === 'STOCK' && (
                <span className="text-sm font-medium text-gray-800">
                  {selectedVariant.inventory > 10 
                    ? `In stock`
                    : selectedVariant.inventory > 1 
                      ? `Only ${selectedVariant.inventory} in stock` 
                      : `Last one in stock!`}
                </span>
              )}
            </div>
            {(selectedVariant && selectedVariant.inventory && selectedVariant.inventory > 10 ) ? (
              <span className="text-xs text-gray-500">
                  (Max: 10 per order)
              </span>
            ) : null}
          </motion.div>
          
          <motion.div 
            variants={productVariants}
            custom={6}
            className="mt-6 flex"
          >
            <motion.div
              className="w-full"
              variants={buttonVariants}
              initial="initial"
              whileTap="tap"
            >
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
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Reviews and Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mx-auto mt-16 w-full max-w-7xl"
      >
        <Tabs id="product-slug-tabs" defaultValue="reviews" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommended">You Might Also Like</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews">
            <Card className="border-none shadow-none">
              <CardContent className="mx-auto max-w-4xl pt-6">
                {/* User Review Form or Existing Review */}
                {user ? (
                  <UserReview 
                    userId={user.id} 
                    productId={product.id} 
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 rounded-lg bg-gray-50 p-6 text-center"
                  >
                    <p className="mb-4 text-gray-600">Sign in to leave a review and unlock special pricing!</p>
                    <SignInButton mode="modal">
                      <Button variant="default">Sign in</Button>
                    </SignInButton>
                  </motion.div>
                )}
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 text-xl font-semibold text-primary"
                >
                  Reviews
                </motion.h3>
                <ProductReviews slug={slug} key={refreshReviews ? 'refresh' : 'initial'} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommended">
            <ProductRecommendations />
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default ProductListing;