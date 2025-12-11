import { useNode } from '@craftjs/core';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CtaButton } from './CtaButton';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  id?: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}

export const HeroCarousel = ({
  slides = [
    { 
        image: 'https://placehold.co/1920x1080?text=Slide+1', 
        title: 'Welcome to Future', 
        subtitle: 'Experience the innovation', 
        ctaText: 'Shop Now' 
    },
    { 
        image: 'https://placehold.co/1920x1080?text=Slide+2', 
        title: 'New Collections', 
        subtitle: 'Discover our latest arrivals', 
        ctaText: 'View More' 
    },
    { 
        image: 'https://placehold.co/1920x1080?text=Slide+3', 
        title: 'Special Offer', 
        subtitle: 'Limited time deals', 
        ctaText: 'Grab It' 
    }
  ],
  autoplay = true,
  interval = 5000,
}: HeroCarouselProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  return (
    <div 
        ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
        className="relative w-full h-[85vh] overflow-hidden bg-gray-900 group"
    >
      <AnimatePresence mode='wait'>
        <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
        >
            {/* Background Image */}
            <img 
                src={slides[current].image} 
                alt={slides[current].title} 
                className="w-full h-full object-cover opacity-60"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div className="max-w-4xl space-y-6">
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white text-5xl md:text-7xl font-bold tracking-tight"
                    >
                        {slides[current].title}
                    </motion.h2>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-200 text-xl md:text-2xl font-light"
                    >
                        {slides[current].subtitle}
                    </motion.p>
                     <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="pt-6"
                    >
                        {slides[current].ctaText && (
                            <CtaButton text={slides[current].ctaText} variant="default" size="lg" />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
            <button 
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    current === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                )}
            />
        ))}
      </div>
    </div>
  );
};

export const HeroCarouselSettings = () => {
    return (
        <div className="p-4">
            <p className="text-sm text-gray-500">Carousel settings are managed via AI generation or manual JSON editing for advanced control.</p>
        </div>
    )
}

HeroCarousel.craft = {
  displayName: 'Hero Carousel',
  props: {
    slides: [],
    autoplay: true,
    interval: 5000
  },
  related: {
    settings: HeroCarouselSettings,
  },
};
