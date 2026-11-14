import React, { useState } from 'react';
import { Plus, Minus, Star, Truck, Heart, BellRing, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './OptimizedImage';
import { StockAlertModal } from './StockAlertModal';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    openProductDetail,
    isInWishlist,
    toggleWishlist,
    isSubscribedToStockAlert,
    t
  } = useApp();

  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isAlertActive = isSubscribedToStockAlert(product.id);

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const installmentValue = (currentPrice / 10).toFixed(2).replace('.', ',');

  const getUnitDisplay = (unit: string) => {
    switch (unit) {
      case 'sc': return 'saco';
      case 'm2': return 'm²';
      case 'br': return 'barra';
      case 'cx': return 'caixa';
      case 'rolo': return 'rolo';
      case 'un': return 'un';
      default: return unit;
    }
  };

  return (
    <>
      <article className="group bg-white rounded-xl border border-slate-200 hover:border-amber-500/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
        {/* Uncluttered Product Media Container with Auto-Resized Lazy Loading */}
        <div
          onClick={() => openProductDetail(product)}
          className="w-full aspect-[4/3] bg-slate-50 overflow-hidden relative cursor-pointer border-b border-slate-100"
        >
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={420}
            height={315}
            quality={75}
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 280px"
            categoryHint={product.categoryId}
            className="w-full h-full"
            imgClassName={`w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />

          {isOutOfStock ? (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide shadow-xs">
              Esgotado
            </span>
          ) : (
            product.isNew && (
              <span className="absolute top-2 left-2 bg-slate-900/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                Lançamento
              </span>
            )
          )}

          {/* Wishlist Heart Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={isWishlisted ? `Remover ${product.name} da Lista de Desejos` : `Salvar ${product.name} na Lista de Desejos`}
            title={isWishlisted ? 'Remover da Lista de Desejos' : 'Salvar na Lista de Desejos'}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border cursor-pointer active:scale-90 ${
              isWishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white/90 hover:bg-white border-slate-200/80 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
          </button>
        </div>

        {/* Structured Marketplace Body */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Clean Brand + Spec Line */}
            <div className="flex items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mb-1">
              <span className="font-bold uppercase tracking-wide text-slate-700 truncate">
                {product.brand || product.producer}
              </span>
              <span className="text-slate-400 shrink-0 font-medium">
                {product.weightValue}
              </span>
            </div>

            {/* Product Name */}
            <h3
              onClick={() => openProductDetail(product)}
              className="text-xs sm:text-[13px] font-medium sm:font-semibold text-slate-900 group-hover:text-amber-700 line-clamp-2 cursor-pointer transition-colors leading-snug min-h-[34px] sm:min-h-[38px]"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Rating Row */}
            <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-semibold text-slate-800 font-mono-numbers">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Mercado Livre-Style Price Stack & Fulfillment */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2">
            <div>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through font-mono-numbers block leading-none mb-0.5">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              )}

              <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
                <span className="text-base sm:text-lg font-extrabold text-slate-950 font-mono-numbers tracking-tight leading-none">
                  R$ {currentPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  /{getUnitDisplay(product.unit)}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] font-bold text-red-600 whitespace-nowrap">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5 leading-tight">
                em <span className="font-semibold text-slate-800">10x R$ {installmentValue}</span> sem juros
              </p>

              {isOutOfStock ? (
                <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-red-600">
                  <BellRing className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate">Indisponível no CD · Previsão em breve</span>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-700">
                  <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate">Entrega rápida ou retire em 2h</span>
                </div>
              )}
            </div>

            {/* Crisp Rectangular Cart CTA / Stepper OR Back-in-Stock Alert */}
            {isOutOfStock ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertModalOpen(true);
                }}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer ${
                  isAlertActive
                    ? 'bg-amber-50 border border-amber-400 text-amber-900 hover:bg-amber-100'
                    : 'bg-slate-950 hover:bg-slate-800 text-amber-400'
                }`}
              >
                {isAlertActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Alerta Ativado</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Avise-me quando chegar</span>
                  </>
                )}
              </button>
            ) : inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-400 rounded-lg p-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartQuantity(product.id, inCartQty - 1);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-slate-900 hover:bg-amber-200 transition-colors cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="text-xs font-extrabold text-slate-950 font-mono-numbers">
                  {inCartQty} no carrinho
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartQuantity(product.id, inCartQty + 1);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-slate-900 hover:bg-amber-200 transition-colors cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.addToBag}</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <StockAlertModal
        product={alertModalOpen ? product : null}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
};
