import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  X,
  Bell,
  HardHat,
  PhoneCall,
  Truck,
  CheckCheck,
  Info,
  ChevronRight,
  Plus,
  Clock,
  ArrowUpRight,
  Calculator,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LMStoreLogo } from './LMStoreLogo';
import { FreightLogisticsModal } from './FreightLogisticsModal';
import { OptimizedImage } from './OptimizedImage';
import { TOP_ROW_BRANDS, BOTTOM_ROW_BRANDS } from '../data/brandsData';

const RECENT_SEARCHES_KEY = 'lmstore_recent_searches';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = () => {
  const {
    products,
    categories,
    cartCount,
    cartTotal,
    currentAddress,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setSelectedCategorySlug,
    openProductDetail,
    addToCart,
    setBotOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
    openInstitutional,
    activeView,
    selectedCategorySlug,
    wishlistIds
  } = useApp();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [showFreightModal, setShowFreightModal] = useState(false);
  const [searchScopeSlug, setSearchScopeSlug] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const searchShortcuts = [
    'Cimento Votoran',
    'Porcelanato 90x90',
    'Tubo Tigre 25mm',
    'Cabo Flexível SIL',
    'Tinta Suvinil',
    'Vergalhão Gerdau',
    'Furadeira Bosch',
    'Argamassa AC-III'
  ];

  const allBrands = useMemo(() => [...TOP_ROW_BRANDS, ...BOTTOM_ROW_BRANDS], []);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage restrictions
      }
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  };

  // Close search dropdown on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearchSuggestions(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Instant search matching products
  const instantMatches = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!q) return [];

    const scopeCategory = searchScopeSlug !== 'all'
      ? categories.find((c) => c.slug === searchScopeSlug)
      : null;

    return products.filter((p) => {
      if (scopeCategory && p.categoryId !== scopeCategory.id) return false;
      const haystack = normalizeText(
        `${p.name} ${p.brand || ''} ${p.producer} ${p.categoryName} ${p.subcategory} ${p.sku} ${p.description}`
      );
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [searchQuery, searchScopeSlug, products, categories]);

  const matchingBrands = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!q) return [];
    return allBrands
      .filter((b) => normalizeText(`${b.name} ${b.category}`).includes(q))
      .slice(0, 4);
  }, [searchQuery, allBrands]);

  const matchingCategories = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!q) return [];
    return categories
      .filter((c) => normalizeText(`${c.name} ${c.subcategories.join(' ')}`).includes(q))
      .slice(0, 3);
  }, [searchQuery, categories]);

  const executeSearch = (overrideQuery?: string, overrideSlug?: string | null) => {
    const finalQuery = (overrideQuery ?? searchQuery).trim();
    const targetSlug = overrideSlug !== undefined ? overrideSlug : (searchScopeSlug === 'all' ? null : searchScopeSlug);

    if (overrideQuery !== undefined) {
      setSearchQuery(overrideQuery);
    }
    if (finalQuery) {
      saveRecentSearch(finalQuery);
    }

    setSelectedCategorySlug(targetSlug);
    setActiveView('category');
    setShowSearchSuggestions(false);
  };

  const renderSearchDropdown = () => {
    if (!showSearchSuggestions) return null;
    const hasQuery = searchQuery.trim().length > 0;

    return (
      <>
        <div
          className="fixed inset-0 z-30 bg-slate-950/15"
          onClick={() => setShowSearchSuggestions(false)}
        />
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden text-xs">
          {hasQuery ? (
            <div>
              {/* Matching Products List */}
              {instantMatches.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>
                      Produtos encontrados ({instantMatches.length})
                    </span>
                    <button
                      onClick={() => executeSearch()}
                      className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Ver todos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {instantMatches.slice(0, 5).map((product) => {
                    const price = product.salePrice ?? product.price;
                    const discountPct =
                      product.salePrice && product.salePrice < product.price
                        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                        : 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          saveRecentSearch(product.name);
                          setShowSearchSuggestions(false);
                          openProductDetail(product);
                        }}
                        className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-amber-50/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <OptimizedImage
                            src={product.image}
                            alt={product.name}
                            width={96}
                            height={96}
                            quality={70}
                            priority={true}
                            categoryHint={product.categoryId}
                            className="w-11 h-11 rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-xs truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                              <span className="font-bold text-slate-700">
                                {product.brand || product.producer}
                              </span>
                              <span>·</span>
                              <span className="truncate">{product.categoryName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-right">
                            <span className="font-bold text-slate-950 font-mono-numbers text-xs block">
                              R$ {price.toFixed(2).replace('.', ',')}
                            </span>
                            {discountPct > 0 && (
                              <span className="text-[10px] font-bold text-red-600">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            title="Adicionar ao carrinho"
                            aria-label={`Adicionar ${product.name} ao carrinho`}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 text-center text-slate-500">
                  <p className="font-semibold text-slate-800 text-xs">
                    Nenhum produto direto encontrado para "{searchQuery}"
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tente buscar por marca, departamento ou peça uma cotação ao Assistente Técnico.
                  </p>
                </div>
              )}

              {/* Matching Brands & Categories */}
              {(matchingBrands.length > 0 || matchingCategories.length > 0) && (
                <div className="px-3.5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                    Atalhos:
                  </span>
                  {matchingBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => executeSearch(brand.name, null)}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-amber-500 text-slate-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Marca: {brand.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-600" />
                    </button>
                  ))}
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategorySlug(cat.slug);
                        setActiveView('category');
                        setShowSearchSuggestions(false);
                      }}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-amber-500 text-slate-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Depto: {cat.name}</span>
                      <ChevronRight className="w-3 h-3 text-amber-600" />
                    </button>
                  ))}
                </div>
              )}

              {/* Footer Action */}
              <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between gap-2">
                <button
                  onClick={() => executeSearch()}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar "{searchQuery}" em todo o catálogo</span>
                </button>
                <button
                  onClick={() => {
                    setShowSearchSuggestions(false);
                    setBotOpen(true);
                  }}
                  className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer shrink-0"
                >
                  Orçar com IA
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 space-y-3">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Buscas Recentes</span>
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                    >
                      Limpar histórico
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => executeSearch(term)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 text-slate-700 rounded-md transition-colors text-[11px] font-medium cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mais buscados na obra
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {searchShortcuts.map((term) => (
                    <button
                      key={term}
                      onClick={() => executeSearch(term)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950 border border-slate-200 text-slate-700 rounded-md transition-colors text-[11px] font-medium cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Calculator Shortcut */}
              <button
                onClick={() => {
                  setShowSearchSuggestions(false);
                  setBotOpen(true);
                }}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">
                      Não sabe a quantidade exata para sua obra?
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Calcule cimento, piso ou tinta com o Assistente Técnico
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-t-[3px] border-t-amber-500 border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-2.5">
          {/* ROW 1: LOGO + DESKTOP WIDE SEARCH + CART/BELL */}
          <div className="flex items-center justify-between gap-3 sm:gap-5">
            {/* ZONE 1: LOGO */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug(null);
                  setActiveView('ecommerce');
                }}
                className="group text-left cursor-pointer transition-transform active:scale-95"
                title="LM Store - Início"
              >
                <LMStoreLogo variant="full" size="md" />
              </button>
            </div>

            {/* ZONE 2 (DESKTOP): MERCADO LIVRE-INSPIRED WIDE SEARCH BAR */}
            <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-2xl relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeSearch();
                }}
                className="flex items-stretch bg-white border border-slate-300 hover:border-slate-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-lg shadow-xs overflow-hidden transition-all"
              >
                {/* Department Scope Selector */}
                <select
                  value={searchScopeSlug}
                  onChange={(e) => setSearchScopeSlug(e.target.value)}
                  aria-label="Filtrar busca por departamento"
                  className="bg-slate-50 border-r border-slate-200 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer max-w-[138px] truncate"
                >
                  <option value="all">Todos</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name.split(',')[0].split(' e ')[0]}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Buscar cimento, porcelanato, fios, ferramentas, marcas..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchSuggestions(true);
                    }}
                    onFocus={() => setShowSearchSuggestions(true)}
                    className="w-full px-3.5 py-2 text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      aria-label="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 border-l border-amber-500 transition-colors cursor-pointer shrink-0"
                  aria-label="Buscar produtos"
                >
                  <Search className="w-4 h-4 stroke-[2.25]" />
                  <span className="hidden lg:inline">Buscar</span>
                </button>
              </form>

              {renderSearchDropdown()}
            </div>

            {/* ZONE 3: ADDRESS SHORTCUT (DESKTOP) + CART + BELL */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Delivery Address Link (Desktop) */}
              <button
                onClick={() => setShowAddressModal(true)}
                className="hidden xl:flex items-center gap-1.5 text-left px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Alterar endereço de entrega para a obra"
              >
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] text-slate-500 block">Enviar para</span>
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[140px] block">
                    {currentAddress.street}, {currentAddress.number}
                  </span>
                </div>
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setActiveView('cart')}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Ver Carrinho de Materiais"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-slate-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono-numbers shadow">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-mono-numbers font-bold">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </button>

              {/* Wishlist ("Lista de Desejos") Button */}
              <button
                onClick={() => setActiveView('wishlist')}
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'wishlist'
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-100'
                }`}
                title="Minha Lista de Desejos"
                aria-label="Minha Lista de Desejos"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlistIds.length > 0 ? 'text-red-500 fill-red-500/15' : 'text-slate-800'
                  }`}
                />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-4 px-1 bg-slate-950 text-amber-400 font-mono-numbers font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow">
                    {wishlistIds.length}
                  </span>
                )}
              </button>

              {/* Notification Bell Button & Popover Container */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                  className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Notificações e Alertas de Entrega"
                  aria-label="Notificações"
                >
                  <Bell className="w-5 h-5 text-slate-800" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-4 px-1 bg-amber-500 text-slate-950 font-mono-numbers font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Rich Notification Dropdown Panel */}
                {showNotificationPanel && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotificationPanel(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-2xl z-40 overflow-hidden text-xs animate-in fade-in zoom-in-95">
                      <div className="bg-slate-950 text-white p-3.5 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-amber-400" />
                          <span className="font-extrabold text-xs">Notificações LM Store</span>
                          {unreadNotificationsCount > 0 && (
                            <span className="bg-amber-500 text-slate-950 font-mono-numbers font-black text-[10px] px-1.5 py-0.5 rounded">
                              {unreadNotificationsCount} novas
                            </span>
                          )}
                        </div>

                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={() => {
                              markAllNotificationsAsRead();
                              showToast('Todas as notificações foram marcadas como lidas.');
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Ler todas</span>
                          </button>
                        )}
                      </div>

                      <div className="flex border-b border-stone-100 bg-stone-50 px-3 py-1.5 gap-2 text-[11px]">
                        <button
                          onClick={() => setNotificationFilter('all')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                            notificationFilter === 'all'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Todas ({notifications.length})
                        </button>
                        <button
                          onClick={() => setNotificationFilter('unread')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                            notificationFilter === 'unread'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Não Lidas ({unreadNotificationsCount})
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                        {(notificationFilter === 'unread'
                          ? notifications.filter((n) => !n.read)
                          : notifications
                        ).length === 0 ? (
                          <div className="p-6 text-center text-stone-400">
                            <Info className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="font-semibold text-stone-600">Nenhuma notificação nesta aba.</p>
                          </div>
                        ) : (
                          (notificationFilter === 'unread'
                            ? notifications.filter((n) => !n.read)
                            : notifications
                          ).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if (notif.link === '#rastreio') {
                                  setActiveView('order_tracking');
                                  setShowNotificationPanel(false);
                                } else if (notif.link && notif.link.startsWith('#produto:')) {
                                  const pid = notif.link.replace('#produto:', '');
                                  const prodMatch = products.find((p) => p.id === pid);
                                  if (prodMatch) {
                                    openProductDetail(prodMatch);
                                    setShowNotificationPanel(false);
                                  }
                                }
                              }}
                              className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer hover:bg-amber-50/50 ${
                                !notif.read ? 'bg-amber-50/30' : 'bg-white'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {notif.type === 'order' && (
                                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                                    <Truck className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'promo' && (
                                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'stock' && (
                                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-amber-800 flex items-center justify-center font-bold">
                                    <HardHat className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'system' && (
                                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                                    <Info className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-bold text-stone-900 text-xs truncate">
                                    {notif.title}
                                  </p>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug line-clamp-2">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                        <button
                          onClick={() => {
                            setShowNotificationPanel(false);
                            setShowFreightModal(true);
                          }}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Simular Frete & Frota Munck</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ROW 2 (MOBILE DEDICATED FULL-WIDTH SEARCH BAR - NEVER SQUEEZED) */}
          <div className="md:hidden mt-2 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch();
              }}
              className="flex items-stretch bg-slate-50 border border-slate-300 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-lg overflow-hidden shadow-xs"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar cimento, pisos, tintas, marcas..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="w-full px-2.5 py-2 text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center border-l border-amber-500 shrink-0 cursor-pointer"
                aria-label="Pesquisar"
              >
                Buscar
              </button>
            </form>

            {/* Compact Mobile Location Strip */}
            <button
              onClick={() => setShowAddressModal(true)}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 w-full truncate cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">
                Entregar em <strong className="text-slate-800">{currentAddress.street}, {currentAddress.number}</strong>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {renderSearchDropdown()}
          </div>

          {/* SUBHEADER: MERCADO LIVRE-INSPIRED DEPARTMENT NAVIGATION BAR (DESKTOP) */}
          <nav className="mt-2 pt-2 border-t border-slate-100 hidden md:flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-4 lg:gap-5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug(null);
                  setActiveView('ecommerce');
                }}
                className={`whitespace-nowrap font-semibold transition-colors hover:text-amber-700 cursor-pointer ${
                  activeView === 'ecommerce' && !searchQuery ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Início
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug(null);
                  setActiveView('category');
                }}
                className={`whitespace-nowrap font-semibold transition-colors hover:text-amber-700 cursor-pointer ${
                  activeView === 'category' && !selectedCategorySlug && !searchQuery ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Catálogo Completo
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('estrutura-alvenaria');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'estrutura-alvenaria' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Estrutura & Alvenaria
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('hidraulica-encanamento');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'hidraulica-encanamento' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Hidráulica
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('eletrica-iluminacao');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'eletrica-iluminacao' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Elétrica
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('acabamento-pisos-revestimentos');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'acabamento-pisos-revestimentos' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Pisos & Porcelanatos
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('tintas-quimicos-pintura');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'tintas-quimicos-pintura' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Tintas
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('ferramentas-equipamentos-epis');
                  setActiveView('category');
                }}
                className={`whitespace-nowrap hover:text-amber-700 transition-colors cursor-pointer ${
                  selectedCategorySlug === 'ferramentas-equipamentos-epis' ? 'text-amber-700 font-bold' : ''
                }`}
              >
                Ferramentas & EPIs
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-600 shrink-0 ml-3">
              <button
                onClick={() => setShowFreightModal(true)}
                className="hover:text-amber-800 flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 bg-slate-100 hover:bg-amber-50 px-2.5 py-1 rounded-md border border-slate-200 transition-colors whitespace-nowrap"
                title="Simular Frete, Frota Munck e Regras de Entrega"
              >
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Frete & Munck</span>
              </button>

              <button
                onClick={() => openInstitutional('fale-conosco')}
                className="hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium whitespace-nowrap"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Televendas</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Endereço da Obra</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2.5">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{currentAddress.label}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 font-medium">
                    {currentAddress.street}, {currentAddress.number} {currentAddress.complement && `(${currentAddress.complement})`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentAddress.neighborhood} · {currentAddress.city}/{currentAddress.state} · CEP {currentAddress.cep}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddressModal(false)}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Confirmar Endereço
            </button>
          </div>
        </div>
      )}

      {/* Interactive Freight & Logistics Modal */}
      <FreightLogisticsModal
        isOpen={showFreightModal}
        onClose={() => setShowFreightModal(false)}
      />
    </>
  );
};
