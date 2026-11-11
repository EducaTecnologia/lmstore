import React from 'react';
import { Plus, Minus, Star, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, openProductDetail, t } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  // Format unit label nicely
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
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Discount Tag Header */}
      {hasDiscount && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs font-mono-numbers">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Brand Watermark / Tag */}
      {product.brand && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            {product.brand}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div
        onClick={() => openProductDetail(product)}
        className="w-full aspect-[4/3] bg-slate-100 overflow-hidden relative cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Metadata: Subcategory · Unit */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mb-1 flex-wrap">
            <span className="text-amber-700 font-bold truncate max-w-[130px]">{product.brand || product.producer}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.subcategory}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-medium text-slate-600">{product.weightValue}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => openProductDetail(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 line-clamp-2 cursor-pointer transition-colors leading-snug min-h-[32px] sm:min-h-[36px]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Origin & Rating */}
          <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-[140px]">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.originLocation}</span>
            </span>
            <span className="flex items-center gap-0.5 text-slate-700 font-mono-numbers font-semibold shrink-0">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {product.rating}
            </span>
          </div>
        </div>

        {/* Pricing & Cart Action Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price Container */}
          <div className="flex flex-col justify-center min-w-0">
            {hasDiscount && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through font-mono-numbers block -mb-0.5">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
            <div className="flex items-baseline gap-0.5 sm:gap-1 whitespace-nowrap">
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">R$</span>
              <span className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-950 font-mono-numbers tracking-tight">
                {currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                /{getUnitDisplay(product.unit)}
              </span>
            </div>
          </div>

          {/* Cart Actions */}
          {inCartQty > 0 ? (
            /* Active Stepper */
            <div className="flex items-center bg-amber-50 border border-amber-400 rounded-full p-0.5 shadow-xs shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, inCartQty - 1);
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="w-5 sm:w-6 text-center text-xs font-bold text-amber-950 font-mono-numbers">
                {inCartQty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, inCartQty + 1);
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Add to Cart Buttons */
            <>
              {/* Mobile & Tablet Button: Circular "+" icon button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs active:scale-90 transition-all shrink-0 cursor-pointer"
                title={t.addToBag}
                aria-label={t.addToBag}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Desktop Button: Full "+ Adicionar" button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="hidden lg:flex px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs hover:shadow transition-all items-center gap-1 active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.addToBag}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
