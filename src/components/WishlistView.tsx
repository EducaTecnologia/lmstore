import React from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  Truck,
  PackageOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './OptimizedImage';

export const WishlistView: React.FC = () => {
  const {
    products,
    wishlistIds,
    removeFromWishlist,
    clearWishlist,
    moveAllWishlistToCart,
    addToCart,
    openProductDetail,
    setActiveView,
    setSelectedCategorySlug,
  } = useApp();

  const wishlistProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const totalEstimated = wishlistProducts.reduce(
    (sum, p) => sum + (p.salePrice ?? p.price),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6 space-y-5">
      {/* Top Breadcrumb & Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveView('ecommerce')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Loja</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-950 leading-tight">
                Minha Lista de Desejos
              </h1>
              <p className="text-xs text-slate-500">
                {wishlistProducts.length === 0
                  ? 'Nenhum material salvo no momento'
                  : `${wishlistProducts.length} ${wishlistProducts.length === 1 ? 'produto salvo' : 'produtos salvos'} · Total estimado R$ ${totalEstimated.toFixed(2).replace('.', ',')}`}
              </p>
            </div>
          </div>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={clearWishlist}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Lista</span>
            </button>
            <button
              onClick={() => {
                moveAllWishlistToCart();
                setActiveView('cart');
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Adicionar Tudo ao Carrinho</span>
            </button>
          </div>
        )}
      </div>

      {/* Saved Items Grid or Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-display font-bold text-lg text-slate-900">
            Sua Lista de Desejos está vazia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Clique no ícone de coração nos produtos da loja para salvar materiais de construção, comparar preços e finalizar a compra quando sua obra precisar.
          </p>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('category');
            }}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span>Explorar Catálogo de Materiais</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {wishlistProducts.map((product) => {
            const currentPrice = product.salePrice ?? product.price;
            const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;
            const discountPct = hasDiscount
              ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
              : 0;
            const installmentValue = (currentPrice / 10).toFixed(2).replace('.', ',');

            return (
              <article
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-500/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                <div
                  onClick={() => openProductDetail(product)}
                  className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 cursor-pointer overflow-hidden"
                >
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    width={420}
                    height={315}
                    quality={75}
                    categoryHint={product.categoryId}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    title="Remover da Lista de Desejos"
                    aria-label={`Remover ${product.name} da Lista de Desejos`}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1.5 text-[10px] text-slate-500 mb-1">
                      <span className="font-bold uppercase tracking-wide text-slate-700 truncate">
                        {product.brand || product.producer}
                      </span>
                      <span className="text-slate-400 shrink-0 font-medium">{product.weightValue}</span>
                    </div>

                    <h3
                      onClick={() => openProductDetail(product)}
                      className="text-xs sm:text-[13px] font-semibold text-slate-900 hover:text-amber-700 line-clamp-2 cursor-pointer leading-snug min-h-[36px]"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="font-semibold text-slate-800 font-mono-numbers">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2.5">
                    <div>
                      {hasDiscount && (
                        <span className="text-[11px] text-slate-400 line-through font-mono-numbers block leading-none mb-0.5">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-lg font-extrabold text-slate-950 font-mono-numbers leading-none">
                          R$ {currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-slate-500">/{product.unit}</span>
                        {hasDiscount && (
                          <span className="text-[11px] font-bold text-red-600">{discountPct}% OFF</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        em <span className="font-semibold text-slate-800">10x R$ {installmentValue}</span> sem juros
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700">
                        <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Pronta entrega na obra</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Mover ao Carrinho</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Excluir item salvo"
                        aria-label="Remover dos salvos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
