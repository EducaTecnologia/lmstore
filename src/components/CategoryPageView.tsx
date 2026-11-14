import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const CategoryPageView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setBotOpen
  } = useApp();

  const [sortOption, setSortOption] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount'>('relevance');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = useMemo(
    () => (selectedCategorySlug ? categories.find((c) => c.slug === selectedCategorySlug) || null : null),
    [categories, selectedCategorySlug]
  );

  // Reset sub-filters when switching departments or clearing search
  useEffect(() => {
    setSelectedSubcategory(null);
    setSelectedBrand(null);
  }, [selectedCategorySlug]);

  const hasSearch = searchQuery.trim().length > 0;

  // Base list filtered by Category and/or Global Search Query
  const baseProducts = useMemo(() => {
    let list = currentCategory
      ? products.filter((p) => p.categoryId === currentCategory.id)
      : [...products];

    if (hasSearch) {
      const q = normalizeText(searchQuery.trim());
      const words = q.split(/\s+/);
      list = list.filter((p) => {
        const haystack = normalizeText(
          `${p.name} ${p.brand || ''} ${p.producer} ${p.categoryName} ${p.subcategory} ${p.sku} ${p.description}`
        );
        return words.every((word) => haystack.includes(word));
      });
    }

    return list;
  }, [products, currentCategory, hasSearch, searchQuery]);

  // Subcategories available in the current scope
  const subcategories = useMemo(() => {
    const list = baseProducts.map((p) => p.subcategory).filter(Boolean);
    return Array.from(new Set(list));
  }, [baseProducts]);

  // Brands available in the current scope
  const availableBrands = useMemo(() => {
    const list = baseProducts
      .map((p) => p.brand)
      .filter((b): b is string => Boolean(b));
    return Array.from(new Set(list));
  }, [baseProducts]);

  // Final Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...baseProducts];

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
      list.sort((a, b) => {
        const discA = a.salePrice ? (a.price - a.salePrice) / a.price : 0;
        const discB = b.salePrice ? (b.price - b.salePrice) / b.price : 0;
        return discB - discA;
      });
    }

    return list;
  }, [baseProducts, selectedSubcategory, selectedBrand, onlyPromo, onlyInStock, sortOption]);

  const clearAllFilters = () => {
    setSelectedSubcategory(null);
    setSelectedBrand(null);
    setOnlyPromo(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mb-3">
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategorySlug(null);
            setActiveView('ecommerce');
          }}
          className="hover:text-amber-700 transition-colors cursor-pointer font-medium"
        >
          Início
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {currentCategory ? (
          <span className="font-semibold text-slate-900">{currentCategory.name}</span>
        ) : (
          <span className="font-semibold text-slate-900">
            {hasSearch ? `Busca: "${searchQuery}"` : 'Catálogo Completo'}
          </span>
        )}
      </nav>

      {/* Crisp Marketplace Category / Search Header Banner */}
      <div className="rounded-xl bg-slate-900 text-white p-5 sm:p-6 mb-5 shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
            {hasSearch
              ? 'Resultado da Busca LM Store'
              : currentCategory
              ? 'Departamento Oficial LM Store'
              : 'Catálogo Geral de Materiais'}
          </span>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
            {hasSearch
              ? `Resultados para "${searchQuery}"`
              : currentCategory
              ? currentCategory.name
              : 'Todos os Materiais de Construção'}
          </h1>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {hasSearch && currentCategory
              ? `Filtrando resultados dentro de ${currentCategory.name}.`
              : currentCategory
              ? currentCategory.description
              : 'Compare preços, marcas homologadas ABNT e prazos de entrega direta para sua obra.'}
          </p>
          <div className="mt-2.5 text-xs text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="font-mono-numbers">{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'material encontrado' : 'materiais disponíveis'}
            </span>
          </div>
        </div>

        {hasSearch && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar busca</span>
          </button>
        )}
      </div>

      {/* Layout: Sidebar Filter (Desktop) + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-1 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                Filtros
              </h3>
              {(selectedSubcategory || selectedBrand || onlyPromo || hasSearch) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {/* Departments Navigation */}
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-800 mb-2">Departamentos</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategorySlug(null)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategorySlug === null
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Todos os Departamentos</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors truncate cursor-pointer ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-2">Subcategorias</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSubcategory === null
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Todas</span>
                    <span className="text-[10px] text-slate-400 font-mono-numbers">
                      {baseProducts.length}
                    </span>
                  </button>
                  {subcategories.map((sub) => {
                    const count = baseProducts.filter((p) => p.subcategory === sub).length;
                    return (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          selectedSubcategory === sub
                            ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{sub}</span>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Marcas</span>
                </p>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      selectedBrand === null
                        ? 'bg-slate-900 text-amber-400 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
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
                          ? 'bg-slate-900 text-amber-400 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{brand}</span>
                      <span className="text-[10px] text-slate-400 font-mono-numbers">
                        {baseProducts.filter((p) => p.brand === brand).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 accent-amber-600"
                />
                <span>Apenas em Oferta</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 accent-amber-600"
                />
                <span>Pronta Entrega</span>
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="col-span-1 lg:col-span-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Filtrar</span>
              {(selectedSubcategory || selectedBrand || onlyPromo || currentCategory) && (
                <span className="w-2 h-2 rounded-full bg-amber-600" />
              )}
            </button>

            <span className="hidden sm:inline text-xs text-slate-600">
              <strong className="text-slate-900 font-mono-numbers">{filteredProducts.length}</strong> resultados
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 hidden sm:inline">Ordenar por:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="discount">Maior Desconto</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedSubcategory || selectedBrand || onlyPromo || hasSearch) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {hasSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-medium">
                  Busca: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="cursor-pointer ml-0.5">
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory(null)} className="cursor-pointer ml-0.5">
                    <X className="w-3 h-3 hover:text-amber-700" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-amber-400 text-xs font-medium">
                  Marca: {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)} className="cursor-pointer ml-0.5">
                    <X className="w-3 h-3 hover:text-amber-300" />
                  </button>
                </span>
              )}
              {onlyPromo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  Em Oferta
                  <button onClick={() => setOnlyPromo(false)} className="cursor-pointer ml-0.5">
                    <X className="w-3 h-3 hover:text-amber-700" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center my-4">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-slate-900">
                Nenhum material encontrado
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {hasSearch
                  ? `Não encontramos correspondências para "${searchQuery}" com os filtros atuais. Você pode limpar a busca ou solicitar orçamento ao nosso Assistente Técnico.`
                  : 'Tente desmarcar subcategorias ou marcas específicas para visualizar todos os itens.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Ver Todos os Produtos
                </button>
                <button
                  onClick={() => setBotOpen(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Consultar Assistente de IA
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM SHEET FOR FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-base text-slate-900">Filtros da Obra</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">Departamento</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategorySlug(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                      selectedCategorySlug === null
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategorySlug(cat.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cat.name.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {subcategories.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-2">Subcategorias</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        selectedSubcategory === null
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Todas
                    </button>
                    {subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                          selectedSubcategory === sub
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableBrands.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-2">Marcas</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedBrand(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        selectedBrand === null
                          ? 'bg-slate-900 text-amber-400 font-bold border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Todas
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b === selectedBrand ? null : b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                          selectedBrand === b
                            ? 'bg-slate-900 text-amber-400 font-bold border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-3 text-xs text-slate-800">
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

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Limpar
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
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
