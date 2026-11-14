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
  ThumbsUp,
  Calculator,
  Ruler,
  ShoppingCart,
  Share2,
  Copy,
  Check,
  Heart,
  BellRing,
  Mail,
  Bell,
  PackageX
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './OptimizedImage';

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
    setPostLoginRedirect,
    isInWishlist,
    toggleWishlist,
    currentUser,
    subscribeStockAlert,
    isSubscribedToStockAlert
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [cepInput, setCepInput] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews' | 'calc'>('details');

  // Calculator states
  const [calcWidth, setCalcWidth] = useState<number>(4);
  const [calcLength, setCalcLength] = useState<number>(5);
  const [calcHeight, setCalcHeight] = useState<number>(2.8);
  const [calcMargin, setCalcMargin] = useState<number>(10);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [alertEmail, setAlertEmail] = useState(currentUser.email || '');
  const [alertChannel, setAlertChannel] = useState<'both' | 'push' | 'email'>('both');

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock <= 0;
  const isAlertActive = isSubscribedToStockAlert(selectedProduct.id);

  const currentPrice = selectedProduct.salePrice ?? selectedProduct.price;
  const hasDiscount = selectedProduct.salePrice !== undefined && selectedProduct.salePrice < selectedProduct.price;
  const activeLot = selectedProduct.lots[0];
  const reviews = getProductReviews(selectedProduct.id);

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?produto=${encodeURIComponent(selectedProduct.slug)}`
      : `/?produto=${encodeURIComponent(selectedProduct.slug)}`;

  const formattedPrice = currentPrice.toFixed(2).replace('.', ',');
  const shareText = `Confira na LM Store: ${selectedProduct.name} (${selectedProduct.brand || selectedProduct.producer}) por apenas R$ ${formattedPrice}/${selectedProduct.unit}!`;
  const shareTextWithUrl = `${shareText}\n${productUrl}`;

  const copyToClipboard = async (textToCopy: string, toastMsg: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedLink(true);
      showToast(toastMsg, 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Link pronto para compartilhamento: ' + productUrl, 'info');
    }
  };

  const handleInstagramShare = () => {
    copyToClipboard(
      shareTextWithUrl,
      'Link e legenda copiados! Cole no Story, Bio ou Direct do Instagram.'
    );
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${selectedProduct.name} | LM Store`,
          text: shareText,
          url: productUrl,
        });
      } catch {
        // User cancelled share sheet
      }
    } else {
      copyToClipboard(productUrl, 'Link do produto copiado!');
    }
  };

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
                <OptimizedImage
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={720}
                  height={720}
                  quality={82}
                  priority={true}
                  categoryHint={selectedProduct.categoryId}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center"
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
                <button
                  onClick={() => setActiveTab('calc')}
                  className={`font-bold pb-1 transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === 'calc'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  <span>Calculadora de Obra</span>
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

                  {/* Title + Wishlist Button */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900 leading-snug">
                      {selectedProduct.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(selectedProduct)}
                      aria-label={isInWishlist(selectedProduct.id) ? 'Remover da Lista de Desejos' : 'Salvar na Lista de Desejos'}
                      title={isInWishlist(selectedProduct.id) ? 'Remover da Lista de Desejos' : 'Salvar na Lista de Desejos'}
                      className={`shrink-0 p-2 rounded-xl border transition-all cursor-pointer active:scale-90 ${
                        isInWishlist(selectedProduct.id)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-400 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>

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

                  {/* Social Sharing Bar (WhatsApp, Facebook, Instagram, Copy Link) */}
                  <div className="mt-3.5 p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Compartilhar produto:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextWithUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5b] text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                        title="Compartilhar no WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                          <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969s-4.453-10-9.969-10zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125s.781-2.219 1.063-2.516c.281-.297.609-.375.813-.375s.406 0 .578.016c.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.016.547-.094.203-.156.328-.313.5-.156.172-.328.391-.469.531-.156.156-.328.328-.141.656.188.328.844 1.391 1.813 2.25 1.25 1.109 2.297 1.453 2.625 1.609.328.156.516.125.703-.094.188-.219.813-.953 1.031-1.281.219-.328.438-.266.734-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
                        </svg>
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#1465d2] text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                        title="Compartilhar no Facebook"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                        <span className="hidden sm:inline">Facebook</span>
                      </a>

                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleInstagramShare}
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-white text-[11px] font-bold flex items-center gap-1 transition-opacity shadow-2xs"
                        title="Copiar link e abrir Instagram"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span className="hidden sm:inline">Instagram</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="px-2 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copiar link do produto"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Inventory & Pallet Info */}
                  <div className={`mt-4 p-3 rounded-xl border text-xs ${
                    isOutOfStock
                      ? 'bg-red-50/70 border-red-200 text-red-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}>
                    <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                      <span className="flex items-center gap-1.5">
                        {isOutOfStock ? (
                          <PackageX className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                          <Layers className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {isOutOfStock ? 'Status no Centro de Distribuição:' : 'Disponibilidade Imediata:'}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-red-700 font-mono-numbers font-extrabold">
                          Esgotado no CD (0 {selectedProduct.unit})
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-mono-numbers font-bold">
                          {selectedProduct.stock} {selectedProduct.unit} em estoque
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      {isOutOfStock ? (
                        <span className="flex items-center gap-1 text-red-700 font-medium">
                          <BellRing className="w-3 h-3 text-red-600" />
                          Cadastre seu aviso abaixo para receber Push e e-mail na reposição.
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Pronta entrega no CD / Envio para canteiro
                        </span>
                      )}
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

              {activeTab === 'calc' && (
                <div className="space-y-3.5 text-xs text-stone-700 animate-in fade-in">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-amber-600" />
                      Calculadora de Área e Quantidade
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Informe as medidas do ambiente para calcular automaticamente a quantidade exata de <strong>{selectedProduct.name}</strong> necessária com margem de segurança.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Largura (m)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.1"
                        value={calcWidth}
                        onChange={(e) => setCalcWidth(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono-numbers focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Comprimento (m)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.1"
                        value={calcLength}
                        onChange={(e) => setCalcLength(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono-numbers focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Altura Parede (m)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={calcHeight}
                        onChange={(e) => setCalcHeight(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono-numbers focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Margem de Recorte/Perda</label>
                      <select
                        value={calcMargin}
                        onChange={(e) => setCalcMargin(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-600"
                      >
                        <option value={5}>5% (Padrão)</option>
                        <option value={10}>10% (Recomendado)</option>
                        <option value={15}>15% (Diagonais/Recortes)</option>
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const rawArea = calcWidth * calcLength;
                    const totalAreaWithMargin = rawArea * (1 + calcMargin / 100);
                    let recommendedQty = 1;
                    let calcExplanation = '';

                    if (selectedProduct.unit === 'sc') {
                      recommendedQty = Math.max(1, Math.ceil(totalAreaWithMargin / 3.5));
                      calcExplanation = `${recommendedQty} saco(s) de ${selectedProduct.weightValue} para cobrir ${totalAreaWithMargin.toFixed(1)}m²`;
                    } else if (selectedProduct.unit === 'm2' || selectedProduct.categoryName.includes('Pisos') || selectedProduct.categoryName.includes('Acabamento')) {
                      recommendedQty = Math.max(1, Math.ceil(totalAreaWithMargin));
                      calcExplanation = `${recommendedQty} m² de revestimento para área de ${rawArea.toFixed(1)}m² + ${calcMargin}% perdas`;
                    } else if (selectedProduct.unit === 'un' && selectedProduct.categoryName.includes('Tintas')) {
                      recommendedQty = Math.max(1, Math.ceil((calcWidth * calcHeight * 4) / 110));
                      calcExplanation = `${recommendedQty} unidade(s) para área de pintura estimada`;
                    } else {
                      recommendedQty = Math.max(1, Math.ceil(totalAreaWithMargin / 2));
                      calcExplanation = `${recommendedQty} ${selectedProduct.unit} calculado(s) com folga técnica`;
                    }

                    const calcTotalCost = recommendedQty * currentPrice;

                    return (
                      <div className="p-3 bg-stone-900 text-white rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-300">Área Calculada:</span>
                          <span className="font-bold text-amber-400 font-mono-numbers">{rawArea.toFixed(1)} m² ({totalAreaWithMargin.toFixed(1)} m² com {calcMargin}%)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-300">Quantidade Indicada:</span>
                          <span className="font-black text-white font-mono-numbers text-sm">{recommendedQty} {selectedProduct.unit}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
                          <span className="text-stone-400 text-[11px]">{calcExplanation}</span>
                          <span className="font-black text-amber-400 text-sm font-mono-numbers">R$ {calcTotalCost.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setQuantity(recommendedQty);
                            addToCart(selectedProduct, recommendedQty);
                            showToast(`Adicionado ${recommendedQty} ${selectedProduct.unit} calculados ao carrinho!`, 'success');
                            closeProductDetail();
                          }}
                          className="w-full mt-2 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Aplicar {recommendedQty} {selectedProduct.unit} e Adicionar ao Carrinho</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Actions Bar OR Back-in-Stock Subscription */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col gap-2.5">
              {isOutOfStock ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    subscribeStockAlert(selectedProduct, alertEmail, alertChannel);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 text-white space-y-2.5 border border-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-extrabold text-white">
                        Avise-me quando chegar
                      </span>
                    </div>
                    {isAlertActive && (
                      <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Alerta Ativado
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    Disparamos um alerta Push e/ou e-mail automático assim que este material der entrada no almoxarifado.
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAlertChannel('both')}
                      className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        alertChannel === 'both'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <BellRing className="w-3 h-3" />
                      <span>Push + E-mail</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlertChannel('push')}
                      className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        alertChannel === 'push'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                      <span>Só Push</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlertChannel('email')}
                      className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        alertChannel === 'email'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      <span>Só E-mail</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Digite seu e-mail para aviso..."
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{isAlertActive ? 'Atualizar Aviso' : 'Avise-me'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
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
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
