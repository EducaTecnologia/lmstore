import React, { useState } from 'react';
import {
  Calculator,
  ChevronRight,
  ShieldCheck,
  Truck,
  HardHat,
  Award,
  CreditCard,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroCarousel } from './HeroCarousel';
import { CategoryBar } from './CategoryBar';
import { ProductCard } from './ProductCard';
import { BrandMarqueeSection } from './BrandMarqueeSection';
import { SmartAIAssistantModal } from './SmartAIAssistantModal';
import { OptimizedImage } from './OptimizedImage';

export const HomeView: React.FC = () => {
  const { products, setSelectedCategorySlug, setActiveView, setSearchQuery, showToast, t } = useApp();
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Curated marketplace shelves
  const newProducts = products.filter((p) => p.isNew);
  const promoProducts = products.filter((p) => p.isPromo);
  const featuredProducts = products.filter((p) => p.rating >= 4.9);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('E-mail cadastrado com sucesso! Você receberá a tabela de preços e promoções exclusivas da LM Store.');
      setNewsletterEmail('');
    }
  };

  const goToCatalog = (slug: string | null = null) => {
    setSearchQuery('');
    setSelectedCategorySlug(slug);
    setActiveView('category');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-8 pt-1">
      {/* 1. HERO CAMPAIGN CAROUSEL */}
      <HeroCarousel />

      {/* 2. DEPARTAMENTOS DA CONSTRUÇÃO CIVIL */}
      <CategoryBar />

      {/* 3. LOJAS OFICIAIS & FABRICANTES HOMOLOGADOS */}
      <BrandMarqueeSection />

      {/* 4. PRATELEIRA: OFERTAS & PROMOÇÕES DA SEMANA */}
      <section id="ofertas-section" className="my-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {t.offersWeekTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.offersWeekSub}
            </p>
          </div>
          <button
            onClick={() => goToCatalog(null)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>{t.viewAllOffers}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {promoProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. UTILIDADE DE OBRA: CALCULADORA & SIMULADOR */}
      <section className="my-5 bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
              {t.aiChefTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.aiChefSub}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAiAssistantOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-[0.98]"
        >
          <span>{t.openAiChef}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* 6. PRATELEIRA: MAIS VENDIDOS E AVALIADOS */}
      <section className="my-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {t.highlightsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.highlightsSub}
            </p>
          </div>
          <button
            onClick={() => goToCatalog(null)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PRATELEIRA: LANÇAMENTOS DA OBRA */}
      <section className="my-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {t.harvestNews}
            </h2>
            <p className="text-xs text-slate-500">
              {t.recentHarvestSub}
            </p>
          </div>
          <button
            onClick={() => goToCatalog(null)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. FAIXA DE GARANTIAS & BENEFÍCIOS */}
      <section className="my-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 text-center md:divide-x md:divide-slate-100">
          <div className="flex flex-col items-center px-2">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mb-2.5">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.expressDelivery}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
              {t.expressDeliverySub}
            </p>
          </div>

          <div className="flex flex-col items-center px-2">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mb-2.5">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.directFromProducer}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
              {t.directFromProducerSub}
            </p>
          </div>

          <div className="flex flex-col items-center px-2">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.fefoQuality}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
              {t.fefoQualitySub}
            </p>
          </div>

          <div className="flex flex-col items-center px-2">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mb-2.5">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.securePayment}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
              {t.securePaymentSub}
            </p>
          </div>
        </div>
      </section>

      {/* 9. GRANDES DEPARTAMENTOS DA CONSTRUÇÃO */}
      <section className="my-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            {t.bigDepartmentsTitle}
          </h2>
          <button
            onClick={() => goToCatalog(null)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
          >
            <span>Explorar tudo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: Estrutura e Alvenaria */}
          <div
            onClick={() => goToCatalog('estrutura-alvenaria')}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer border border-slate-200"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&auto=format&fit=crop&q=75"
              alt="Estrutura e Alvenaria"
              width={640}
              height={480}
              quality={75}
              categoryHint="cat-estrutura"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Obra Bruta</span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">Estrutura & Alvenaria</h3>
              <p className="text-[11px] text-slate-200 line-clamp-1">Cimento Votoran, aço Gerdau, blocos e argamassas</p>
            </div>
          </div>

          {/* Card 2: Ferramentas e Equipamentos */}
          <div
            onClick={() => goToCatalog('ferramentas-equipamentos-epis')}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer border border-slate-200"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=640&auto=format&fit=crop&q=75"
              alt="Ferramentas e Equipamentos"
              width={640}
              height={480}
              quality={75}
              categoryHint="cat-ferramentas"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Potência & Precisão</span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">Ferramentas & EPIs</h3>
              <p className="text-[11px] text-slate-200 line-clamp-1">Bosch, DeWalt, Makita, Vonder e proteção 3M</p>
            </div>
          </div>

          {/* Card 3: Acabamento, Pisos e Porcelanatos */}
          <div
            onClick={() => goToCatalog('acabamento-pisos-revestimentos')}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer border border-slate-200"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&auto=format&fit=crop&q=75"
              alt="Pisos e Porcelanatos"
              width={640}
              height={480}
              quality={75}
              categoryHint="cat-acabamento"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Design & Elegância</span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">Pisos & Porcelanatos</h3>
              <p className="text-[11px] text-slate-200 line-clamp-1">Portobello, Eliane, vinílicos e niveladores Cortag</p>
            </div>
          </div>

          {/* Card 4: Tintas e Químicos */}
          <div
            onClick={() => goToCatalog('tintas-quimicos-pintura')}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer border border-slate-200"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=640&auto=format&fit=crop&q=75"
              alt="Tintas e Pintura"
              width={640}
              height={480}
              quality={75}
              categoryHint="cat-tintas"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Cores & Proteção</span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">Tintas & Químicos</h3>
              <p className="text-[11px] text-slate-200 line-clamp-1">Suvinil, Coral, Vedacit, silicones e PU40 Tekbond</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CLUBE CONSTRUTOR NEWSLETTER */}
      <section className="my-5 bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-xs border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Clube Construtor LM Store
            </span>
          </div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-1">
            {t.newsletterTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-1.5">
            {t.newsletterSub}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder={t.newsletterPlaceholder}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              {t.subscribe}
            </button>
          </form>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-center text-xs flex flex-col items-center shrink-0">
          <QrCode className="w-14 h-14 text-amber-400 mb-2" />
          <span className="font-bold text-white">App LM Store Obra Fácil</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Cotações e pedidos direto do canteiro</span>
        </div>
      </section>

      {/* AI Assistant Modal */}
      <SmartAIAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
};
