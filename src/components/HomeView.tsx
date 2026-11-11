import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
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

export const HomeView: React.FC = () => {
  const { products, setSelectedCategorySlug, setActiveView, showToast, t } = useApp();
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Shelves
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
      
      {/* SEÇÃO 1: HERO BANNER (CARROSSEL COM IMAGENS HD) */}
      <HeroCarousel />

      {/* SEÇÃO 2: CARDS DE DEPARTAMENTOS / CATEGORIAS */}
      <CategoryBar />

      {/* SEÇÃO EXCLUSIVA: MARCAS ORIGINAIS EM CARROSSEL DUPLO CONTRAPOSTO */}
      <BrandMarqueeSection />

      {/* SEÇÃO 3: AI ASSISTANT / CALCULADORA DE MATERIAIS */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              {t.aiChefTitle}
            </h3>
            <p className="text-xs text-slate-300">
              {t.aiChefSub}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAiAssistantOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <span>{t.openAiChef}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SEÇÃO 4: PRATELEIRA "LANÇAMENTOS DA OBRA" */}
      <section className="my-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t.harvestNews}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                {t.recentHarvestBadge}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.recentHarvestSub}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('category');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SEÇÃO 5: PRATELEIRA "DESTAQUES & MAIS VENDIDOS" */}
      <section className="my-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
              {t.highlightsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.highlightsSub}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('category');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SEÇÃO 6: PRATELEIRA "OFERTAS & PROMOÇÕES DA SEMANA" */}
      <section id="ofertas-section" className="my-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t.offersWeekTitle}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full uppercase">
                {t.upToDiscount}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.offersWeekSub}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('category');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAllOffers}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {promoProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SEÇÃO 7: FAIXA DE BENEFÍCIOS PARA CONSTRUÇÃO */}
      <section className="my-10 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.expressDelivery}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[170px]">
              {t.expressDeliverySub}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.directFromProducer}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[170px]">
              {t.directFromProducerSub}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.fefoQuality}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[170px]">
              {t.fefoQualitySub}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{t.securePayment}</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[170px]">
              {t.securePaymentSub}
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: GRANDES DEPARTAMENTOS DA CONSTRUÇÃO */}
      <section className="my-10">
        <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-4 px-1">
          {t.bigDepartmentsTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1: Estrutura e Alvenaria */}
          <div
            onClick={() => {
              setSelectedCategorySlug('estrutura-alvenaria');
              setActiveView('category');
            }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer shadow-md"
          >
            <img
              src="/src/assets/images/cat_estrutura_alvenaria_1794364474729.jpg"
              alt="Estrutura e Alvenaria"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Obra Bruta</span>
              <h3 className="font-display font-bold text-base text-white">Estrutura & Alvenaria</h3>
              <p className="text-[11px] text-slate-200">Cimento Votoran, aço Gerdau, blocos e argamassas</p>
            </div>
          </div>

          {/* Card 2: Ferramentas e Equipamentos */}
          <div
            onClick={() => {
              setSelectedCategorySlug('ferramentas-equipamentos-epis');
              setActiveView('category');
            }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer shadow-md"
          >
            <img
              src="/src/assets/images/cat_ferramentas_profissionais_1794364475410.jpg"
              alt="Ferramentas e Equipamentos"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Potência & Precisão</span>
              <h3 className="font-display font-bold text-base text-white">Ferramentas & EPIs</h3>
              <p className="text-[11px] text-slate-200">Bosch, DeWalt, Makita, Vonder e proteção 3M</p>
            </div>
          </div>

          {/* Card 3: Acabamento, Pisos e Porcelanatos */}
          <div
            onClick={() => {
              setSelectedCategorySlug('acabamento-pisos-revestimentos');
              setActiveView('category');
            }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer shadow-md"
          >
            <img
              src="/src/assets/images/cat_acabamento_porcelanatos_1794364475770.jpg"
              alt="Pisos e Porcelanatos"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Design & Elegância</span>
              <h3 className="font-display font-bold text-base text-white">Pisos & Porcelanatos</h3>
              <p className="text-[11px] text-slate-200">Portobello, Eliane, vinílicos e niveladores Cortag</p>
            </div>
          </div>

          {/* Card 4: Tintas e Químicos */}
          <div
            onClick={() => {
              setSelectedCategorySlug('tintas-quimicos-pintura');
              setActiveView('category');
            }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 text-white cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80"
              alt="Tintas e Pintura"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Cores & Proteção</span>
              <h3 className="font-display font-bold text-base text-white">Tintas & Químicos</h3>
              <p className="text-[11px] text-slate-200">Suvinil, Coral, Vedacit, silicones e PU40 Tekbond</p>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO 9: NEWSLETTER PARA CONSTRUTORES */}
      <section className="my-10 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Clube Construtor LM Store
            </span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
            {t.newsletterTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-2">
            {t.newsletterSub}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder={t.newsletterPlaceholder}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/20"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              {t.subscribe}
            </button>
          </form>
        </div>

        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center text-xs flex flex-col items-center">
          <QrCode className="w-16 h-16 text-amber-400 mb-2" />
          <span className="font-bold text-white">App LM Store Obra Fácil</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Faça cotações e pedidos direto do canteiro</span>
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
