import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './OptimizedImage';

export const HeroCarousel: React.FC = () => {
  const { banners, setActiveView, setSelectedCategorySlug, setSearchQuery } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const minSwipeDistance = 45;

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

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = (touchStartY.current || 0) - (touchEndY.current || 0);

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleBannerAction = () => {
    setSearchQuery('');
    if (activeBanner.ctaUrl === '#cat-ferramentas') {
      setSelectedCategorySlug('ferramentas-equipamentos-epis');
      setActiveView('category');
      return;
    }
    if (activeBanner.ctaUrl === '#cat-acabamento') {
      setSelectedCategorySlug('acabamento-pisos-revestimentos');
      setActiveView('category');
      return;
    }
    setSelectedCategorySlug(null);
    setActiveView('ecommerce');
    const el = document.getElementById('ofertas-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-[#0a0f1d] shadow-md my-3 sm:my-4 select-none touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[260px] sm:min-h-[310px] md:min-h-[350px] flex items-center overflow-hidden">
        {/* Dedicated Full-Bleed Background Image Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <OptimizedImage
            src={activeBanner.image}
            alt={activeBanner.title}
            width={1280}
            height={440}
            quality={85}
            priority={true}
            categoryHint="banner"
            fallbackSrc="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80"
            className="w-full h-full bg-[#0a0f1d]"
            imgClassName="w-full h-full object-cover object-center transition-transform duration-700"
          />
        </div>

        {/* Left-to-Right Dark Slate Scrim Matching Reference Banner */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#060a14]/95 via-[#0b1222]/75 to-[#0b1222]/25" />

        {/* Left-Aligned Content Stack */}
        <div className="relative z-10 w-full px-6 py-7 sm:px-10 sm:py-9 md:px-12 md:py-10">
          <div className="max-w-[540px]">
            {activeBanner.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-tight mb-3.5 sm:mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>{activeBanner.badge}</span>
              </div>
            )}

            <h1 className="font-display font-extrabold text-[21px] sm:text-[28px] md:text-[34px] text-white tracking-tight leading-[1.16] mb-2.5 sm:mb-3">
              {activeBanner.title}
            </h1>

            <p className="text-[12.5px] sm:text-[14.5px] md:text-[15px] text-slate-200/90 font-normal leading-[1.45] max-w-[465px] mb-5 sm:mb-6">
              {activeBanner.subtitle}
            </p>

            <button
              onClick={handleBannerAction}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-semibold text-[13px] sm:text-[15px] shadow-lg shadow-slate-950/35 transition-all active:scale-95 cursor-pointer"
            >
              <span>{activeBanner.ctaLabel}</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Bottom-Right Pill Indicators */}
        <div className="absolute bottom-4 right-5 sm:bottom-6 sm:right-7 z-20 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 sm:w-8 bg-amber-500'
                  : 'w-2 sm:w-2.5 bg-white/45 hover:bg-white/75'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

