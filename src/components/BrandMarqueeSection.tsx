import React, { useState } from 'react';
import { TOP_ROW_BRANDS, BOTTOM_ROW_BRANDS, BrandItem } from '../data/brandsData';
import { BrandLogoSVG } from './BrandLogos';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const BrandMarqueeSection: React.FC = () => {
  const { setSearchQuery, setActiveView, setSelectedCategorySlug, showToast } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  const handleBrandClick = (brand: BrandItem) => {
    setSelectedBrand(brand);
    setSearchQuery(brand.name);
    setSelectedCategorySlug(null);
    setActiveView('category');
    showToast(`Filtrando produtos da marca oficial ${brand.name}`);
  };

  // Duplicate arrays to achieve infinite seamless loop
  const topRowList = [...TOP_ROW_BRANDS, ...TOP_ROW_BRANDS];
  const bottomRowList = [...BOTTOM_ROW_BRANDS, ...BOTTOM_ROW_BRANDS];

  return (
    <section className="my-10 relative overflow-hidden py-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl border border-slate-800">
      
      {/* Background ambient accents */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Garantia de Fábrica & Qualidade Certificada
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Marcas Oficiais Líderes na Construção Civil
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Trabalhamos diretamente com os maiores fabricantes do Brasil. Segurança estrutural, certificação ABNT e procedência garantida do alicerce ao acabamento.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>+24 Fabricantes Homologados</span>
        </div>
      </div>

      {/* Edge gradient masks for smooth fade-in and fade-out */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

        {/* LINHA 1: Move da ESQUERDA para a DIREITA */}
        <div className="mb-4 overflow-hidden">
          <div className="animate-marquee-right pause-hover flex gap-3.5 sm:gap-4 py-1">
            {topRowList.map((brand, idx) => (
              <button
                key={`top-${brand.id}-${idx}`}
                onClick={() => handleBrandClick(brand)}
                title={`Ver catálogo de ${brand.name} (${brand.category})`}
                className="group shrink-0 h-20 sm:h-22 min-w-[200px] sm:min-w-[220px] px-4 py-2.5 rounded-2xl bg-white text-slate-900 shadow-md border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-left cursor-pointer active:scale-95"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="h-8 flex items-center">
                    <BrandLogoSVG type={brand.svgIcon} className="w-auto h-7 max-w-[130px]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 opacity-90 group-hover:opacity-100">
                    Oficial
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                      {brand.subText}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      {brand.category}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* LINHA 2: Move da DIREITA para a ESQUERDA */}
        <div className="overflow-hidden">
          <div className="animate-marquee-left pause-hover flex gap-3.5 sm:gap-4 py-1">
            {bottomRowList.map((brand, idx) => (
              <button
                key={`bot-${brand.id}-${idx}`}
                onClick={() => handleBrandClick(brand)}
                title={`Ver catálogo de ${brand.name} (${brand.category})`}
                className="group shrink-0 h-20 sm:h-22 min-w-[200px] sm:min-w-[220px] px-4 py-2.5 rounded-2xl bg-white text-slate-900 shadow-md border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-left cursor-pointer active:scale-95"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="h-8 flex items-center">
                    <BrandLogoSVG type={brand.svgIcon} className="w-auto h-7 max-w-[130px]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 opacity-90 group-hover:opacity-100">
                    Parceiro
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                      {brand.subText}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      {brand.category}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Helper Text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>* Passe o cursor ou toque para pausar o carrossel. Clique para ver todos os produtos da marca.</span>
        <span className="hidden sm:inline font-mono">100% Produtos Originais com Nota Fiscal</span>
      </div>

    </section>
  );
};
