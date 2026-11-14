import React from 'react';
import { Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { OptimizedImage } from './OptimizedImage';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategorySlug, setSelectedCategorySlug, setActiveView, setSearchQuery, setBotOpen, t } = useApp();

  const handleSelectCategory = (category: Category) => {
    setSearchQuery('');
    setSelectedCategorySlug(category.slug);
    setActiveView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryName = (cat: Category) => {
    switch (cat.slug) {
      case 'estrutura-alvenaria':
        return 'Estrutura & Alvenaria';
      case 'hidraulica-encanamento':
        return 'Hidráulica & Canos';
      case 'eletrica-iluminacao':
        return 'Elétrica & Fios';
      case 'acabamento-pisos-revestimentos':
        return 'Pisos & Porcelanato';
      case 'tintas-quimicos-pintura':
        return 'Tintas & Pintura';
      case 'coberturas-telhados-esquadrias':
        return 'Coberturas & Telhas';
      case 'ferramentas-equipamentos-epis':
        return 'Ferramentas & EPIs';
      default:
        return cat.name;
    }
  };

  return (
    <section className="my-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Departamentos da Construção Civil
          </h2>
          <p className="text-xs text-slate-500">
            Escolha a etapa da sua obra ou calcule materiais com nosso assistente técnico
          </p>
        </div>
      </div>

      {/* Clean Mercado Livre-Style 8-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const displayName = getCategoryName(cat);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className={`group flex flex-col items-center text-center p-2.5 rounded-xl transition-all duration-150 border cursor-pointer ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400'
              }`}
            >
              <OptimizedImage
                src={cat.image}
                alt={displayName}
                width={160}
                height={160}
                quality={75}
                priority={true}
                categoryHint={cat.id}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg mb-2 shrink-0 border border-slate-100"
                imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />

              <span className="text-[11px] sm:text-xs font-semibold text-slate-900 group-hover:text-amber-700 line-clamp-1">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono-numbers">
                {cat.itemCount} {t.itemsCount}
              </span>
            </button>
          );
        })}

        {/* 8th Card: Assistente de IA (Clean Architectural Tool Tile - Zero AI Slop) */}
        <button
          onClick={() => setBotOpen(true)}
          className="group flex flex-col items-center text-center p-2.5 rounded-xl transition-all duration-150 border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center mb-2 shrink-0 group-hover:scale-105 transition-transform">
            <Calculator className="w-7 h-7 stroke-[2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-amber-400 line-clamp-1">
            Assistente de IA
          </span>
          <span className="text-[10px] text-slate-300 mt-0.5 font-medium">
            Simulador & Cores
          </span>
        </button>
      </div>
    </section>
  );
};
