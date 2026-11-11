import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Check,
  X,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
    setSelectedCategorySlug,
    isLoggedIn,
    setPostLoginRedirect,
    showToast,
    t
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const freeShippingThreshold = 250;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res.message);
    if (res.success) {
      setCouponCode('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      showToast('Faça login ou crie sua conta para continuar sua compra e ter acesso aos dados e histórico.', 'info');
      setPostLoginRedirect('checkout');
      setActiveView('login');
      return;
    }
    setActiveView('checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 sm:gap-4 pb-4 border-b border-stone-200">
        <button
          onClick={() => setActiveView('ecommerce')}
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-stone-600 hover:text-amber-600 font-medium cursor-pointer transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Continuar Comprando</span>
          <span className="sm:hidden">Voltar</span>
        </button>

        <h1 className="font-display font-extrabold text-base sm:text-2xl text-stone-900 text-center flex-1 whitespace-nowrap px-1">
          Meu Carrinho de Compras
        </h1>

        <div className="shrink-0 text-right min-w-[50px] sm:w-28">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs sm:text-sm text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              Esvaziar
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="py-16 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-lg text-stone-900">
            Seu carrinho está vazio
          </h2>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Adicione cimentos, aços, tintas, pisos e ferramentas para iniciar sua compra.
          </p>
          <button
            onClick={() => {
              setSelectedCategorySlug('estrutura-e-alvenaria');
              setActiveView('category');
            }}
            className="mt-6 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            Explorar Materiais de Construção
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Banner */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-900 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  {remainingForFreeShipping > 0
                    ? `Falta apenas R$ ${remainingForFreeShipping.toFixed(2).replace('.', ',')} para FRETE GRÁTIS na grande SP!`
                    : '🎉 Parabéns! Você ganhou Frete Grátis na sua entrega!'}
                </span>
                <span className="font-mono-numbers font-semibold text-amber-900">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items Cards */}
            <div className="space-y-3">
              {cart.map((item) => {
                const currentPrice = item.product.salePrice ?? item.product.price;
                const itemTotal = currentPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] text-amber-700 font-bold uppercase tracking-wider block">
                          {item.product.brand || item.product.producer}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.product.weightValue} · R$ {currentPrice.toFixed(2).replace('.', ',')} /{item.product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Stepper + Item Total + Trash */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-xl px-2 py-1 bg-stone-50/70">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs sm:text-sm font-semibold text-stone-800 font-mono-numbers">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Price and Remove */}
                      <div className="flex flex-col items-end min-w-[80px]">
                        <span className="font-bold text-sm sm:text-base text-stone-900 font-mono-numbers">
                          R$ {itemTotal.toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-300 hover:text-red-600 transition-colors mt-1 p-0.5 cursor-pointer"
                          title="Remover produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-6 sticky top-24">
              <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 pb-4 border-b border-stone-100">
                Resumo do Pedido
              </h3>

              {/* Coupon Field */}
              <div className="mt-4 pb-4 border-b border-stone-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>

                {couponFeedback && (
                  <p className="mt-2 text-xs text-stone-500">{couponFeedback}</p>
                )}

                {appliedCoupon && (
                  <div className="mt-2.5 flex items-center justify-between text-xs text-amber-900 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                      Cupom ativo: {appliedCoupon}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal de produtos</span>
                  <span className="font-mono-numbers text-stone-800">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex items-center justify-between text-amber-600 font-medium">
                    <span>Desconto de cupom</span>
                    <span className="font-mono-numbers">- R$ {cartDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-stone-600">
                  <span>Frete estimado</span>
                  <span className="font-mono-numbers text-stone-800">
                    {cartDeliveryFee === 0 ? (
                      <strong className="text-emerald-700 font-bold uppercase text-[11px]">Grátis</strong>
                    ) : (
                      `R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-stone-900 block">Total a pagar</span>
                    <span className="text-[10px] text-stone-400">Em até 10x sem juros no cartão</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-stone-950 font-mono-numbers">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="mt-6 w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Ambiente Seguro SSL 256-bit</span>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};
