import React, { useEffect, useRef, useState } from 'react';
import { TOP_ROW_BRANDS, BOTTOM_ROW_BRANDS, BrandItem } from '../data/brandsData';
import { BrandLogoSVG } from './BrandLogos';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const BrandMarqueeSection: React.FC = () => {
  const { setSearchQuery, setActiveView, setSelectedCategorySlug, showToast } = useApp();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Lazy-activate and pause offscreen marquee animations cleanly via IntersectionObserver
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasEnteredViewport(true);
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsInView(visible);
        if (visible) {
          setHasEnteredViewport(true);
        }
      },
      { rootMargin: '150px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleBrandClick = (brand: BrandItem) => {
    setSearchQuery(brand.name);
    setSelectedCategorySlug(null);
    setActiveView('category');
    showToast(`Exibindo catálogo oficial ${brand.name}`);
  };

  const topRowList = [...TOP_ROW_BRANDS, ...TOP_ROW_BRANDS];
  const bottomRowList = [...BOTTOM_ROW_BRANDS, ...BOTTOM_ROW_BRANDS];

  return (
    <section
      ref={sectionRef}
      className="my-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-hidden"
    >
      {/* Clean Mercado Livre-Style Official Stores Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Lojas Oficiais & Marcas Homologadas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compre direto dos maiores fabricantes do Brasil com nota fiscal e garantia ABNT
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            +24 Fabricantes Oficiais
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategorySlug(null);
              setActiveView('category');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
          >
            <span>Ver catálogo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lazy-rendered dual marquee tracks with subtle edge masks */}
      {hasEnteredViewport ? (
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Row 1: Left -> Right */}
          <div className="mb-3 overflow-hidden">
            <div
              className="animate-marquee-right pause-hover flex gap-3 py-0.5"
              style={{ animationPlayState: isInView ? undefined : 'paused' }}
            >
              {topRowList.map((brand, idx) => (
                <button
                  key={`top-${brand.id}-${idx}`}
                  onClick={() => handleBrandClick(brand)}
                  title={`Ver produtos ${brand.name}`}
                  className="group shrink-0 w-[188px] sm:w-[210px] px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-500 hover:shadow-sm transition-all duration-150 flex flex-col justify-between text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="h-8 flex items-center justify-between w-full mb-1.5">
                    <BrandLogoSVG type={brand.svgIcon} className="w-auto h-7 max-w-[130px]" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/70 w-full">
                    <span className="text-[11px] font-semibold text-slate-800 block truncate">
                      {brand.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {brand.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Right -> Left */}
          <div className="overflow-hidden">
            <div
              className="animate-marquee-left pause-hover flex gap-3 py-0.5"
              style={{ animationPlayState: isInView ? undefined : 'paused' }}
            >
              {bottomRowList.map((brand, idx) => (
                <button
                  key={`bot-${brand.id}-${idx}`}
                  onClick={() => handleBrandClick(brand)}
                  title={`Ver produtos ${brand.name}`}
                  className="group shrink-0 w-[188px] sm:w-[210px] px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-500 hover:shadow-sm transition-all duration-150 flex flex-col justify-between text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="h-8 flex items-center justify-between w-full mb-1.5">
                    <BrandLogoSVG type={brand.svgIcon} className="w-auto h-7 max-w-[130px]" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/70 w-full">
                    <span className="text-[11px] font-semibold text-slate-800 block truncate">
                      {brand.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {brand.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[196px] rounded-xl bg-slate-50 border border-slate-100" aria-hidden="true" />
      )}
    </section>
  );
};
