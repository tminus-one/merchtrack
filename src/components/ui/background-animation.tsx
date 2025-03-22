'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Sparkles, Heart, Star, Bookmark, Tag, Gift, Award } from 'lucide-react';

const BackgroundAnimation = () => {
  // Create refs for parent elements to enable relative positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Memoize the updateHeight function to prevent recreating it on each render
  const updateHeight = useCallback(() => {
    const height = Math.max(
      document.body.scrollHeight,
      //   document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    setDocumentHeight(height);
  }, []);

  // Update document height on window resize - optimized with empty dependency array
  useEffect(() => {
    // Initial height calculation
    updateHeight();

    // Update on resize
    window.addEventListener('resize', updateHeight);
    
    // Set up mutation observer to detect DOM changes that affect height
    const observer = new MutationObserver(() => {
      setTimeout(updateHeight, 100); // Small debounce
    });
    
    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Recalculate height after content loads to ensure all elements are considered
    const timer = setTimeout(updateHeight, 1000);

    // Clean up all listeners on unmount
    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - runs once on mount

  // Animation elements with their properties - Enhanced for more visibility
  const animatedElements = [
    {
      icon: ShoppingBag,
      color: 'text-primary/35',
      size: 'size-12',
      delay: 0,
      duration: 18,
      animate: { 
        x: [-50, -90, -50, 0, 50, 90, 50, 0, -50],
        y: [40, 10, -20, -50, -20, 10, 40],
        rotate: [-8, 0, 8, 0, -8]
      }
    },
    {
      icon: Package,
      color: 'text-primary/30',
      size: 'size-14',
      delay: 2,
      duration: 22,
      animate: { 
        x: [80, 30, -30, -80, -30, 30, 80],
        y: [20, 50, 70, 50, 20, -20, 20],
        rotate: [15, 0, -15, 0, 15]
      }
    },
    {
      icon: Sparkles,
      color: 'text-primary/25',
      size: 'size-10',
      delay: 1,
      duration: 15,
      animate: { 
        x: [-70, 0, 70, 0, -70],
        y: [0, -40, 0, 40, 0],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 15, 0, -15, 0]
      }
    },
    {
      icon: Heart,
      color: 'text-pink-400/30',
      size: 'size-8',
      delay: 2.5,
      duration: 17,
      animate: { 
        x: [30, 70, 30, -20, -60, -20, 30],
        y: [-40, -15, 15, 45, 15, -15, -40],
        scale: [0.7, 1.3, 0.7],
        rotate: [10, -10, 10]
      }
    },
    {
      icon: Star,
      color: 'text-amber-400/30',
      size: 'size-9',
      delay: 1.5,
      duration: 20,
      animate: { 
        x: [-30, -70, -30, 20, 70, 20, -30],
        y: [-15, 15, 45, 60, 45, 15, -15],
        scale: [0.9, 1.4, 0.9],
        rotate: [-15, 0, 15, 0, -15]
      }
    },
    // Adding new elements for more visibility
    {
      icon: Gift,
      color: 'text-primary/30',
      size: 'size-11',
      delay: 0.5,
      duration: 19,
      animate: { 
        x: [50, 100, 50, 0, -50, -100, -50, 0, 50],
        y: [-60, -20, 20, 60, 20, -20, -60],
        scale: [0.8, 1.1, 0.8],
        rotate: [0, 10, 0, -10, 0]
      }
    },
    {
      icon: Tag,
      color: 'text-blue-400/25',
      size: 'size-10',
      delay: 3,
      duration: 23,
      animate: { 
        x: [-40, -80, -40, 0, 40, 80, 40, 0, -40],
        y: [0, 30, 60, 90, 60, 30, 0],
        scale: [1, 1.2, 1],
        rotate: [-20, 0, 20, 0, -20]
      }
    },
    {
      icon: Award,
      color: 'text-amber-500/25',
      size: 'size-13',
      delay: 2,
      duration: 25,
      animate: { 
        x: [0, 40, 80, 40, 0, -40, -80, -40, 0],
        y: [80, 40, 0, -40, -80, -40, 0, 40, 80],
        scale: [0.9, 1.1, 0.9],
        rotate: [0, 10, 20, 10, 0, -10, -20, -10, 0]
      }
    },
    {
      icon: Bookmark,
      color: 'text-green-400/25',
      size: 'size-10',
      delay: 1,
      duration: 21,
      animate: { 
        x: [20, 60, 100, 60, 20, -20, -60, -100, -60, -20, 20],
        y: [-70, -35, 0, 35, 70, 35, 0, -35, -70],
        scale: [0.8, 1, 1.2, 1, 0.8],
        rotate: [-5, 0, 5, 0, -5]
      }
    },
  ];

  // Adjusted container style to position relative to page content
  const containerStyle = {
    height: documentHeight > 0 ? `${documentHeight}px` : '100%',
    width: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    zIndex: 0,
  };

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none overflow-hidden"
      style={containerStyle}
      aria-hidden="true"
    >
      {animatedElements.map((element, index) => {
        const Icon = element.icon;
        // Calculate position as percentage of total page height
        const topPosition = 10 + Math.random() * 80;
        
        return (
          <motion.div
            suppressHydrationWarning
            key={index}
            className="absolute"
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0 
            }}
            animate={{ 
              ...element.animate,
              opacity: [0, 0.9, 0]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: element.duration,
              ease: "easeInOut",
              delay: element.delay,
              opacity: {
                duration: element.duration / 2.5,
                times: [0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: element.duration * 0.5
              }
            }}
            style={{
              top: `${topPosition}%`,
              left: `${10 + Math.random() * 80}%`,
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            }}
          >
            <Icon className={`${element.size} ${element.color}`} />
          </motion.div>
        );
      })}
      
      {/* Enhanced decorative gradient blobs - now positioned relative to the page */}
      <div className="animate-blob absolute -left-40 top-[5%] size-[600px] rounded-full bg-primary/10 mix-blend-multiply blur-3xl"></div>
      <div className="animate-blob animation-delay-2000 absolute -right-40 top-[60%] size-[500px] rounded-full bg-primary/10 mix-blend-multiply blur-3xl"></div>
      <div className="animate-blob animation-delay-4000 absolute left-40 top-[30%] size-[300px] rounded-full bg-blue-300/10 mix-blend-multiply blur-3xl"></div>
      <div className="animate-blob animation-delay-3000 absolute -right-20 top-[80%] size-[400px] rounded-full bg-pink-300/10 mix-blend-multiply blur-3xl"></div>
    </div>
  );
};

// Add the animations to your global CSS
const addAnimationStyles = () => {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      .animate-blob {
        animation: blob 15s infinite ease-in-out;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-3000 {
        animation-delay: 3s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// Execute the animation style addition
if (typeof window !== 'undefined') {
  addAnimationStyles();
}

export default BackgroundAnimation;