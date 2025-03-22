'use client';

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Package, ShoppingBag, Sparkles } from "lucide-react";

const Loading3D = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white/80 backdrop-blur-sm"
      >
        <div className="relative flex max-w-md flex-col items-center justify-center rounded-xl bg-white p-8 shadow-2xl">
          {/* Decoration elements */}
          <motion.div 
            className="absolute -left-3 -top-3 size-24 rounded-full bg-primary/10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-4 -right-4 size-20 rounded-full bg-primary/15"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />

          {/* Logo */}
          <div className="relative mb-5 size-20">
            <Image
              src="/img/logo.png"
              alt="MerchTrack Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 5rem, 5rem"
              priority
            />
          </div>

          {/* Loading animation */}
          <div className="mb-5 flex items-center justify-center space-x-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ y: 0 }}
                animate={{ y: [-8, 0, -8] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
                className="size-3 rounded-full bg-primary"
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.h2
            animate={{ opacity: 1 }}
            className="mb-2 text-xl font-bold text-primary"
          >
            Loading your merchandise...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground mb-6 text-center text-sm"
          >
            We&apos;re preparing something special for you!
          </motion.p>

          {/* Animated icons */}
          <div className="relative flex w-full justify-center">
            <motion.div 
              className="absolute"
              animate={{ 
                x: [-50, 0, 50, 0, -50],
                y: [0, -20, 0, 20, 0],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShoppingBag className="size-8 text-primary/70" />
            </motion.div>

            <motion.div 
              className="absolute"
              animate={{ 
                x: [60, 20, -20, -60, -20, 20, 60],
                y: [10, 30, 40, 30, 10, -10, 10],
                rotate: [10, 0, -10, 0, 10]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Package className="size-6 text-primary/60" />
            </motion.div>

            <motion.div 
              className="absolute"
              animate={{ 
                x: [-30, -60, -30, 0, 30, 60, 30, 0, -30],
                y: [30, 10, -10, -30, -10, 10, 30],
                scale: [0.8, 1, 0.8],
                rotate: [-5, 0, 5, 0, -5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7
              }}
            >
              <Sparkles className="size-5 text-primary/50" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading3D;