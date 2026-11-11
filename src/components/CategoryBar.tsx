import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategorySlug, setSelectedCategorySlug, setActiveView, setBotOpen, t } = useApp();

  const handleSelectCategory = (category: Category) => {
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
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
            Departamentos da Construção Civil
          </h2>
          <p className="text-xs text-slate-500">
            Navegue pelas 8 principais categorias e simule materiais com Assistente de IA
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Grid with 8 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const displayName = getCategoryName(cat);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className={`group flex flex-col items-center text-center p-2.5 rounded-2xl transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-amber-400 shadow-xs'
              }`}
            >
              {/* Category Thumbnail */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 mb-2 relative shrink-0">
                <img
                  src={cat.image}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Category Name */}
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-amber-700 line-clamp-1">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.itemCount} {t.itemsCount}
              </span>
            </button>
          );
        })}

        {/* 8th Card: Assistente de IA & Simulador */}
        <button
          onClick={() => setBotOpen(true)}
          className="group flex flex-col items-center text-center p-2.5 rounded-2xl transition-all duration-200 border border-amber-400/80 bg-gradient-to-br from-slate-900 via-slate-950 to-stone-900 text-white shadow-md hover:shadow-lg hover:border-amber-300 cursor-pointer relative overflow-hidden"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 shrink-0 border border-amber-400/30 group-hover:scale-105 transition-transform">
            <Wand2 className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-xs font-black text-amber-300 group-hover:text-amber-200 line-clamp-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            Assistente de IA
          </span>
          <span className="text-[9px] text-stone-300 mt-0.5 font-medium">
            Simulador 3D & Cores
          </span>
        </button>
      </div>
    </div>
  );
};
