import React from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategorySlug, setSelectedCategorySlug, setActiveView, t } = useApp();

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
            {t.fieldDepartmentsTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {t.fieldDepartmentsSub}
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Slider / Grid with 7 Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
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
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80';
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
      </div>
    </div>
  );
};
