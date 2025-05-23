"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative w-full overflow-hidden py-24"
    >
      <motion.div
        className="absolute inset-0 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 mb-8 rounded bg-primary/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </motion.div>

      <div className="relative z-10 w-full">
        <motion.div
          className="flex flex-col items-center gap-8 text-center"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Limited Time Offer
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-2xl text-base">
            Join thousands of students and alumni who trust us for their university merchandise needs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="group text-neutral-2" asChild>
                <Link href="/products">
                  Shop Now
                  <ShoppingBag className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;

