import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  ListChecks,
  HardHat,
  FileText,
  BadgeCheck,
  Building2,
  Clock,
  Lock,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetail,
    addToCart,
    setActiveView,
    getProductReviews,
    addReview,
    shoppingLists,
    addItemToShoppingList,
    showToast,
    isLoggedIn,
    setPostLoginRedirect
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [cepInput, setCepInput] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!selectedProduct) return null;

  const currentPrice = selectedProduct.salePrice ?? selectedProduct.price;
  const hasDiscount = selectedProduct.salePrice !== undefined && selectedProduct.salePrice < selectedProduct.price;
  const activeLot = selectedProduct.lots[0];
  const reviews = getProductReviews(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    closeProductDetail();
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    closeProductDetail();
    if (!isLoggedIn) {
      showToast('Faça login ou crie sua conta para finalizar a compra.', 'info');
      setPostLoginRedirect('checkout');
      setActiveView('login');
      return;
    }
    setActiveView('checkout');
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.length >= 8) {
      setShippingCalculated(true);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Faça login ou crie sua conta para publicar sua avaliação.', 'info');
      closeProductDetail();
      setPostLoginRedirect('category');
      setActiveView('login');
      return;
    }
    if (!newComment.trim()) {
      showToast('Escreva um comentário sobre o material para publicar.', 'warning');
      return;
    }
    addReview({
      productId: selectedProduct.id,
      rating: newRating,
      comment: newComment.trim(),
    });
    setNewComment('');
  };

  const handleAddToList = (listId: string) => {
    addItemToShoppingList(listId, selectedProduct.id, quantity);
    showToast(`Adicionado à lista de materiais!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition-colors border border-stone-200 cursor-pointer shadow-xs"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Media Gallery */}
          <div className="bg-stone-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80">
            <div>
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-stone-200 relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover object-center"
                />
                {selectedProduct.brand && (
                  <div className="absolute top-3 left-3 bg-stone-900 text-amber-400 text-[11px] font-black px-2.5 py-1 rounded-md shadow-md tracking-wider flex items-center gap-1.5 uppercase">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedProduct.brand}</span>
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                    {Math.round(((selectedProduct.price - currentPrice) / selectedProduct.price) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Construction & Technical Quality Badge */}
              <div className="w-full mt-4 p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-stone-800">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Certificação Técnica LM Store</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Fabricante homologado: <strong className="text-stone-900">{selectedProduct.brand || selectedProduct.producer}</strong> · Atende às normas ABNT NBR aplicáveis à construção civil.
                </p>
              </div>
            </div>

            {/* Quick Add to Shopping List Dropdown */}
            {shoppingLists.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-200">
                <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                  Salvar na Lista da Obra:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {shoppingLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleAddToList(list.id)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg text-[11px] font-medium text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ListChecks className="w-3 h-3 text-amber-600" />
                      <span>{list.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Purchase Module & Tabs */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Tabs: Details vs Specs vs Reviews */}
              <div className="flex items-center gap-4 border-b border-stone-200 pb-2 mb-3 text-xs">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`font-bold pb-1 transition-colors cursor-pointer ${
                    activeTab === 'details'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`font-bold pb-1 transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === 'specs'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ficha Técnica</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`font-bold pb-1 transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Avaliações ({reviews.length})</span>
                </button>
              </div>

              {activeTab === 'details' && (
                <>
                  {/* Category, Subcategory & Rating */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span className="font-semibold text-amber-700 uppercase tracking-wider text-[11px]">
                      {selectedProduct.categoryName} {selectedProduct.subcategory ? `· ${selectedProduct.subcategory}` : ''}
                    </span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center gap-1 text-stone-700 font-mono-numbers hover:text-amber-700"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong>{selectedProduct.rating}</strong> ({selectedProduct.reviewsCount})
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900 leading-snug">
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                    <span>Marca: <strong className="text-stone-800">{selectedProduct.brand || 'Original'}</strong></span>
                    <span>·</span>
                    <span>Embalagem / Medida: <strong className="text-stone-800">{selectedProduct.weightValue}</strong></span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-mono-numbers">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-stone-400 line-through font-mono-numbers">
                        R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-xs text-stone-500 font-medium">/{selectedProduct.unit}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Inventory & Pallet Info */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                    <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Disponibilidade Imediata:
                      </span>
                      <span className="text-emerald-700 font-mono-numbers font-bold">
                        {selectedProduct.stock} {selectedProduct.unit} em estoque
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Pronta entrega no CD / Envio para canteiro
                      </span>
                    </div>
                  </div>

                  {/* Shipping Estimator */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <form onSubmit={handleCalculateShipping} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Digite o CEP da obra (ex: 01451-000)"
                        value={cepInput}
                        onChange={(e) => setCepInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Calcular
                      </button>
                    </form>
                    {shippingCalculated && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[11px] text-stone-800 flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-200">
                          <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Entrega Canteiro de Obras (com descarregamento): <strong>1 a 2 dias úteis</strong> por R$ 39,00.</span>
                        </p>
                        <p className="text-[11px] text-stone-800 flex items-center gap-1.5 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Retirada Expressa no Balcão da Loja: <strong>Grátis em até 2 horas</strong> após confirmação.</span>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-3 pt-1">
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs">
                    <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-amber-600" />
                      Especificações Técnicas Oficiais
                    </h4>
                    <dl className="divide-y divide-stone-200 text-stone-700">
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Marca / Fabricante:</dt>
                        <dd className="font-semibold text-stone-900">{selectedProduct.brand || 'Original'}</dd>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Subcategoria:</dt>
                        <dd className="font-semibold text-stone-900">{selectedProduct.subcategory}</dd>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Unidade de Venda:</dt>
                        <dd className="font-semibold text-stone-900">{selectedProduct.unit} ({selectedProduct.weightValue})</dd>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Norma Técnica:</dt>
                        <dd className="font-semibold text-stone-900">ABNT / NBR Homologada</dd>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Aplicação Indicada:</dt>
                        <dd className="font-semibold text-stone-900">Residencial, Comercial e Obras Pesadas</dd>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <dt className="text-stone-500">Garantia:</dt>
                        <dd className="font-semibold text-stone-900">Direta com o Fabricante + Garantia LM Store</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                /* REVIEWS TAB */
                <div className="space-y-4">
                  {/* Reviews Summary */}
                  <div className="flex items-center gap-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <div className="text-center shrink-0">
                      <span className="font-extrabold text-3xl font-mono-numbers text-stone-900 block">
                        {selectedProduct.rating}
                      </span>
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= Math.round(selectedProduct.rating)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-0.5 block">
                        {reviews.length} avaliações
                      </span>
                    </div>

                    <div className="flex-1 text-xs text-stone-600 border-l border-stone-200 pl-4">
                      <p className="font-semibold text-stone-900">Aprovado por Mestres de Obra</p>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                        Produto testado e recomendado por engenheiros civis, empreiteiros e profissionais da construção.
                      </p>
                    </div>
                  </div>

                  {/* Leave a review form */}
                  <form onSubmit={handleSubmitReview} className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-2 text-xs">
                    <span className="font-bold text-stone-900 block">Deixe sua Avaliação da Obra:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-600 text-[11px]">Sua nota:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-0.5 cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Comente sobre rendimento, acabamento ou facilidade de aplicação..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 p-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Avaliar
                      </button>
                    </div>
                  </form>

                  {/* Reviews list */}
                  <div className="max-h-52 overflow-y-auto space-y-2.5 divide-y divide-stone-100 pr-1">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="pt-2 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">{rev.userName}</span>
                          <span className="text-[10px] text-stone-400 font-mono-numbers">{rev.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                              }`}
                            />
                          ))}
                          {rev.verifiedPurchase && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold ml-1">
                              Obra Verificada
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-xl p-1 bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold font-mono-numbers text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  Adicionar ao Carrinho
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Comprar Agora</span>
                <span className="font-mono-numbers font-medium text-stone-900">
                  (R$ {(currentPrice * quantity).toFixed(2).replace('.', ',')})
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
