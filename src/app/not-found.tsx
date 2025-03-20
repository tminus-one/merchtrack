'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Home, CompassIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import HeaderLP from '@/components/public/header';
import Footer from '@/components/public/footer';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (window.history.length <= 2) {
        router.push('/');
      } else {
        router.back();
      }
    }, 100);
  };

  if (!mounted) return null;

  return (
    <>
      <HeaderLP />
      <div className="from-primary-50 relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b to-white px-4 py-20">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{ 
                width: Math.random() * 6 + 2, 
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(44,89,219,0.15),transparent)]" />

        <motion.div 
          className="relative z-10 mt-10 w-full max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main content */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative mb-8 flex justify-center">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20 blur-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative flex size-28 items-center justify-center rounded-full bg-primary/10">
                <CompassIcon className="size-16 text-primary" />
              </div>
            </div>

            <div className="relative mb-4">
              <motion.div
                className="absolute -inset-1 bg-primary/20 opacity-50 blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <h1 className="relative mx-auto text-[10rem] font-light leading-none tracking-tighter text-primary sm:text-[12rem]">
                404
              </h1>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-primary sm:text-3xl">
              Page Not Found
            </h2>
            <p className="mx-auto max-w-lg text-neutral-6">
              The page you&apos;re looking for might have been moved, deleted, or maybe never existed. 
              Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(44,89,219,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              disabled={isNavigating}
              className="hover:bg-primary-50/50 group inline-flex items-center gap-2 rounded-lg border-2 border-primary/20 bg-white px-6 py-2.5 text-sm font-medium text-primary shadow-sm transition-all hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className={cn("size-4 transition-transform", { "animate-pulse": isNavigating })} />
              {isNavigating ? "Navigating..." : "Go Back"}
            </motion.button>

            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-600"
            >
              <motion.span
                className="absolute inset-0 rounded-lg"
                whileHover={{
                  boxShadow: "0 4px 12px rgba(44,89,219,0.3)",
                }}
              />
              <Home className="relative z-10 size-4" />
              <span className="relative z-10">Return Home</span>
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 flex items-center justify-center space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "h-1.5 rounded-full bg-primary/30",
                  i === 1 ? "w-8" : "w-3"
                )}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: i === 1 ? [1, 1.1, 1] : [1, 1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

