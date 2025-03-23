"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Thumb } from './EmblaCarouselThumbsButton';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { cn } from '@/lib/utils';

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
  autoplayInterval?: number
  autoplayEnabled?: boolean
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { 
    slides, 
    options,
    autoplayInterval = 5000,
    autoplayEnabled = true 
  } = props;
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaModalRef, emblaModalApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  });

  // Control states
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplayEnabled);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) {
      emblaMainApi.scrollPrev();
      handleUserInteraction();
    }
  }, [emblaMainApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaMainApi) {
      emblaMainApi.scrollNext();
      handleUserInteraction();
    }
  }, [emblaMainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      handleUserInteraction();
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    
    // Update button states
    setPrevBtnDisabled(!emblaMainApi.canScrollPrev());
    setNextBtnDisabled(!emblaMainApi.canScrollNext());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  // Handle autoplay functionality
  const startAutoplay = useCallback(() => {
    if (!isPlaying || !emblaMainApi) return;
    
    // Clear any existing timer
    stopAutoplay();
    
    // Start a new timer
    autoplayTimerRef.current = setInterval(() => {
      if (emblaMainApi && isPlaying) {
        // If we're at the last slide, loop back to the first
        if (!emblaMainApi.canScrollNext()) {
          emblaMainApi.scrollTo(0);
        } else {
          emblaMainApi.scrollNext();
        }
      }
    }, autoplayInterval);
  }, [emblaMainApi, isPlaying, autoplayInterval]);
  
  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);
  
  // Toggle autoplay state
  const toggleAutoplay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Handle user interaction (pause autoplay temporarily)
  const handleUserInteraction = useCallback(() => {
    // Stop current autoplay
    stopAutoplay();
    
    // Only pause for user interaction if autoplay is enabled
    if (!isPlaying) return;
    
    // Clear existing timeout
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    // Resume autoplay after 5 seconds of inactivity
    userInteractionTimeoutRef.current = setTimeout(() => {
      startAutoplay();
    }, 5000);
  }, [isPlaying, stopAutoplay, startAutoplay]);

  // Setup and cleanup autoplay
  useEffect(() => {
    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    
    return () => {
      stopAutoplay();
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, [isPlaying, startAutoplay, stopAutoplay]);

  // Setup event listeners and initialization
  useEffect(() => {
    if (!emblaMainApi) return;
    
    onSelect();
    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
    
    // Setup pointer down listener to pause autoplay during user interaction
    const handlePointerDown = () => {
      handleUserInteraction();
    };
    
    emblaMainApi.on('pointerDown', handlePointerDown);
    
    return () => {
      emblaMainApi.off('select', onSelect);
      emblaMainApi.off('pointerDown', handlePointerDown);
    };
  }, [emblaMainApi, onSelect, handleUserInteraction]);

  const openModal = useCallback((index: number) => {
    setModalOpen(true);
    setSelectedIndex(index);
    // Sync modal carousel with main carousel
    if (emblaModalApi) {
      emblaModalApi.scrollTo(index);
    }
  }, [emblaModalApi]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setIsZoomed(false);
  }, []);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  if (!slides.length) return null;

  return (
    <>
      <div className="w-full">
        {/* Main Carousel */}
        <div className="relative overflow-hidden rounded-md bg-primary-100/50 shadow-sm">
          {/* Carousel Viewport */}
          <div className="overflow-hidden" ref={emblaMainRef}>
            <div className="flex touch-pan-y">
              {slides.map((url, index) => (
                <button 
                  type='button'
                  className="relative min-w-0 flex-[0_0_100%] cursor-pointer transition-opacity hover:opacity-80" 
                  key={index}
                  onClick={() => openModal(index)}
                >
                  <div className="relative aspect-square h-auto w-full rounded-md border border-primary-300 sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
                    <Image 
                      src={url} 
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                      className="object-contain transition-opacity duration-300 ease-in-out"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={scrollPrev} 
                disabled={prevBtnDisabled}
                className="group absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-0"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-5 text-gray-800 group-hover:text-white" />
              </button>
              <button 
                onClick={scrollNext} 
                disabled={nextBtnDisabled}
                className="group absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-0"
                aria-label="Next slide"
              >
                <ChevronRight className="size-5 text-gray-800 group-hover:text-white" />
              </button>
              
              {/* Autoplay toggle button */}
              <button
                onClick={toggleAutoplay}
                className="group absolute bottom-4 right-4 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary"
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              >
                {isPlaying ? (
                  <Pause className="size-4 text-gray-800 group-hover:text-white" />
                ) : (
                  <Play className="size-4 text-gray-800 group-hover:text-white" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {slides.length > 1 && (
          <div className="mt-3 sm:mt-4">
            <div className="overflow-hidden" ref={emblaThumbsRef}>
              <div className="flex gap-2 pl-0 sm:gap-3">
                {slides.map((url, index) => (
                  <Thumb
                    key={index}
                    onClick={() => onThumbClick(index)}
                    selected={index === selectedIndex}
                    index={url}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTitle className="sr-only">
          Product Image {selectedIndex + 1} of {slides.length}
        </DialogTitle>
        <DialogContent className="max-w-[95vw] border-none bg-neutral-7/80 p-0 text-white">
          <div className="relative flex h-[90vh] w-full items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-50 rounded-full bg-neutral-6 p-2 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              <X className="size-6" />
            </button>

            {/* Zoom toggle button */}
            <button
              onClick={toggleZoom}
              className="absolute right-4 top-16 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              {isZoomed ? (
                <ZoomOut className="size-6" />
              ) : (
                <ZoomIn className="size-6" />
              )}
            </button>

            {/* Modal Carousel */}
            <div className="size-full overflow-hidden" ref={emblaModalRef}>
              <div className="flex h-full touch-pan-y">
                {slides.map((url, index) => (
                  <div 
                    className="relative min-w-0 flex-[0_0_100%]" 
                    key={index}
                  >
                    <div className={cn(
                      "relative h-full w-full transition-all duration-300",
                      isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    )}>
                      <Image 
                        src={url} 
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="100vw"
                        quality={100}
                        className={cn(
                          "transition-transform duration-300 ease-out",
                          isZoomed ? "scale-150 object-cover" : "object-contain"
                        )}
                        onClick={toggleZoom}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Navigation Buttons */}
            <button 
              onClick={() => emblaModalApi?.scrollPrev()}
              className="group absolute left-4 z-50 rounded-full bg-neutral-6 p-3 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button 
              onClick={() => emblaModalApi?.scrollNext()}
              className="group absolute right-4 z-50 rounded-full bg-neutral-6 p-3 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmblaCarousel;
