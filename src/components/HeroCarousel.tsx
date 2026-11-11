import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Clock, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroCarousel: React.FC = () => {
  const { banners, setActiveView, setSelectedCategorySlug, t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch & Swipe gesture handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const minSwipeDistance = 45; // Minimum px distance to trigger slide change

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  const activeBanner = banners[currentSlide] || banners[0];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Touch Start
  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  // Touch Move
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  // Touch End
  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = (touchStartY.current || 0) - (touchEndY.current || 0);

    // Only swipe if horizontal motion exceeds vertical motion (prevent intercepting vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swiped Left -> Next Slide
        handleNext();
      } else {
        // Swiped Right -> Previous Slide
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 text-white shadow-xl my-3 sm:my-5 select-none touch-pan-y border border-slate-800"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Dark Gradient Scrim - Fixed Height per device mode */}
      <div className="relative h-[220px] sm:h-[300px] md:h-[380px] flex items-center overflow-hidden">
        <img
          key={activeBanner.id || currentSlide}
          src={activeBanner.image}
          alt={activeBanner.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Absolute reliable fallback to high quality organic farmers market
            e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80';
          }}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 brightness-[0.75] animate-in fade-in"
        />
        
        {/* Measured Scrim Gradient for WCAG Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-10 py-4 sm:py-8 w-full">
          <div className="max-w-xl">
            
            {/* Badge */}
            {activeBanner.badge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{activeBanner.badge}</span>
              </div>
            )}

            <h1 className="font-display font-bold text-base sm:text-xl md:text-2xl text-white tracking-tight leading-snug text-balance line-clamp-2 sm:line-clamp-none">
              {activeBanner.title}
            </h1>

            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-xs text-slate-200 leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-3">
              {activeBanner.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-3 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setActiveView('ecommerce');
                  const el = document.getElementById('ofertas-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{activeBanner.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategorySlug('estrutura-alvenaria');
                  setActiveView('category');
                }}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-xs font-medium transition-colors border border-white/20 cursor-pointer"
              >
                {t.exploreProduce}
              </button>
            </div>

            {/* Fast Trust Indicators */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 hidden md:grid grid-cols-3 gap-3 text-slate-300 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">{t.express35min}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Normas Técnicas ABNT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Frota Munck Especializada</span>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-sm transition-colors z-20 hidden sm:flex cursor-pointer"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-sm transition-colors z-20 hidden sm:flex cursor-pointer"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicators (Touch Clickable) */}
        <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex items-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
