import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Building2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const CategoryPageView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    setActiveView
  } = useApp();

  const [sortOption, setSortOption] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount'>('relevance');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = categories.find((c) => c.slug === selectedCategorySlug) || categories[0];

  // Subcategories available in this category
  const subcategories = useMemo(() => {
    const list = products
      .filter((p) => p.categoryId === currentCategory.id)
      .map((p) => p.subcategory)
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [products, currentCategory.id]);

  // Brands available in this category
  const availableBrands = useMemo(() => {
    const list = products
      .filter((p) => p.categoryId === currentCategory.id)
      .map((p) => p.brand)
      .filter((b): b is string => Boolean(b));
    return Array.from(new Set(list));
  }, [products, currentCategory.id]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.categoryId === currentCategory.id);

    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }
    if (selectedBrand) {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    if (onlyPromo) {
      list = list.filter((p) => p.isPromo);
    }
    if (onlyInStock) {
      list = list.filter((p) => p.stock > 0);
    }

    if (sortOption === 'price_asc') {
      list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortOption === 'price_desc') {
      list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortOption === 'discount') {
      list.sort((a, b) => (b.isPromo ? 1 : 0) - (a.isPromo ? 1 : 0));
    }

    return list;
  }, [products, currentCategory.id, selectedSubcategory, selectedBrand, onlyPromo, onlyInStock, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
        <button
          onClick={() => {
            setSelectedCategorySlug(null);
            setActiveView('ecommerce');
          }}
          className="hover:text-amber-600 transition-colors cursor-pointer"
        >
          Início
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-400">LM Store Materiais</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-stone-900">{currentCategory.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-6 sm:p-8 mb-6 shadow-md border border-stone-800">
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] uppercase tracking-widest text-amber-400 font-black">
            Departamento Oficial LM Store
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            {currentCategory.description}
          </p>
          <div className="mt-3 text-xs text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span><strong>{filteredProducts.length}</strong> produtos técnicos prontos para entrega na obra.</span>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar Filter (Desktop) + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                Filtros Técnicos
              </h3>
              {(selectedSubcategory || selectedBrand || onlyPromo) && (
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setSelectedBrand(null);
                    setOnlyPromo(false);
                  }}
                  className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Subcategories */}
            <div className="mt-4">
              <p className="text-xs font-bold text-stone-800 mb-2">Subcategorias</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    selectedSubcategory === null
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/70'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>Todas as Subcategorias</span>
                  <span className="text-[10px] text-stone-400 font-mono-numbers">
                    {products.filter((p) => p.categoryId === currentCategory.id).length}
                  </span>
                </button>
                {subcategories.map((sub) => {
                  const count = products.filter(
                    (p) => p.categoryId === currentCategory.id && p.subcategory === sub
                  ).length;
                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        selectedSubcategory === sub
                          ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/70'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{sub}</span>
                      <span className="text-[10px] text-stone-400 font-mono-numbers">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Marcas Homologadas</span>
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      selectedBrand === null
                        ? 'bg-stone-900 text-amber-400 font-semibold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>Todas as Marcas</span>
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand === selectedBrand ? null : brand)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        selectedBrand === brand
                          ? 'bg-stone-900 text-amber-400 font-semibold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{brand}</span>
                      <span className="text-[10px] text-stone-400 font-mono-numbers">
                        {products.filter((p) => p.categoryId === currentCategory.id && p.brand === brand).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 accent-amber-600"
                />
                <span>Apenas Ofertas & Preço de Canteiro</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 accent-amber-600"
                />
                <span>Pronta Entrega no Estoque</span>
              </label>
            </div>

            {/* Other categories shortcut */}
            <div className="mt-6 pt-4 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-800 mb-2">Outros Departamentos</p>
              <div className="space-y-1">
                {categories
                  .filter((c) => c.id !== currentCategory.id)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setSelectedSubcategory(null);
                        setSelectedBrand(null);
                      }}
                      className="w-full text-left text-xs px-2 py-1 text-stone-500 hover:text-amber-700 hover:bg-stone-50 rounded transition-colors truncate cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="col-span-1 lg:col-span-3">
          
          {/* Controls Bar: Mobile filter button + sorting selector */}
          <div className="flex items-center justify-between gap-2 mb-4 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-semibold text-stone-800 hover:bg-stone-200 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Filtrar</span>
              {(selectedSubcategory || selectedBrand || onlyPromo) && (
                <span className="w-2 h-2 rounded-full bg-amber-600" />
              )}
            </button>

            {/* Product count display */}
            <span className="hidden sm:inline text-xs text-stone-500">
              Mostrando <strong className="text-stone-900 font-mono-numbers">{filteredProducts.length}</strong> materiais de construção
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Ordenar:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-stone-100 border border-stone-200 text-xs rounded-xl px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-600 font-medium cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="discount">Maior Desconto</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedSubcategory || selectedBrand || onlyPromo) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-stone-400">Filtros ativos:</span>
              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory(null)} className="cursor-pointer">
                    <X className="w-3 h-3 hover:text-amber-700" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900 text-amber-400 text-xs font-medium">
                  Marca: {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)} className="cursor-pointer">
                    <X className="w-3 h-3 hover:text-amber-300" />
                  </button>
                </span>
              )}
              {onlyPromo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  Ofertas da Semana
                  <button onClick={() => setOnlyPromo(false)} className="cursor-pointer">
                    <X className="w-3 h-3 hover:text-amber-700" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid: 2 cols on mobile, 3 cols tablet, 3 on desktop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-6">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-stone-800">
                Nenhum produto encontrado com estes filtros
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Tente desmarcar subcategorias ou marcas específicas para visualizar todos os itens da categoria.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSelectedBrand(null);
                  setOnlyPromo(false);
                }}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM SHEET FOR FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">Filtros da Obra</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-stone-800 mb-2">Subcategorias</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                      selectedSubcategory === null
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Todas
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                        selectedSubcategory === sub
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {availableBrands.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-800 mb-2">Marcas</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedBrand(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                        selectedBrand === null
                          ? 'bg-stone-900 text-amber-400 font-bold border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      Todas
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b === selectedBrand ? null : b)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                          selectedBrand === b
                            ? 'bg-stone-900 text-amber-400 font-bold border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <label className="flex items-center gap-3 text-xs text-stone-800">
                  <input
                    type="checkbox"
                    checked={onlyPromo}
                    onChange={(e) => setOnlyPromo(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                  />
                  <span>Apenas Ofertas & Promoções</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Ver {filteredProducts.length} Materiais
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
