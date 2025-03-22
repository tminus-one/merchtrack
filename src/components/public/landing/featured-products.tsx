"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeaturedProduct } from "@/actions/landing.actions";

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="w-full overflow-hidden py-24">
      <motion.div
        style={{ y }}
        className="w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary">
            Featured Products
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Check out our most popular university merchandise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden shadow-sm">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image[0] || "/img/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.badge && (
                      <div className="absolute left-2 top-2">
                        <Badge variant="secondary" className="font-medium">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="truncate font-bold text-primary transition-colors hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <p
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} 
                    className="mt-2 line-clamp-2 text-sm text-neutral-7" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/products/${product.slug}`} className="w-full">
                    <Button variant="outline" className="w-full border-primary text-primary">
                      <ShoppingCart className="mr-2 size-4" />
                      Add to Cart
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Button size="lg" variant="outline" className="group">
            View All Products
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;

