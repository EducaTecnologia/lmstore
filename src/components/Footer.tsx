import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  Lock,
  Truck,
  HardHat,
  FileCheck2,
  PhoneCall,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LMStoreLogo } from './LMStoreLogo';

export const Footer: React.FC = () => {
  const { openInstitutional, setActiveView, t, setSelectedCategorySlug } = useApp();

  const [col1Open, setCol1Open] = useState(false);
  const [col2Open, setCol2Open] = useState(false);
  const [col3Open, setCol3Open] = useState(false);

  return (
    <footer className="hidden lg:block bg-stone-950 text-stone-300 pt-12 pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Fast Value Proposition Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-8 mb-8 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Entrega com Caminhão Munck</p>
              <p className="text-stone-400 text-[11px]">Descarregamento no canteiro de obras</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Cotação para Construtoras</p>
              <p className="text-stone-400 text-[11px]">Condições especiais e faturamento PJ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Certificação ABNT / INMETRO</p>
              <p className="text-stone-400 text-[11px]">Produtos 100% originais das marcas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Retirada Rápida em Loja</p>
              <p className="text-stone-400 text-[11px]">Separação expressa em até 2 horas</p>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Column 1: Institucional */}
          <div>
            <div
              onClick={() => setCol1Open(!col1Open)}
              className="flex items-center justify-between font-display font-bold text-white text-sm uppercase tracking-wider mb-3 cursor-pointer md:cursor-default"
            >
              <span>{t.institutional}</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${col1Open ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2.5 ${col1Open ? 'block' : 'hidden md:block'}`}>
              <li>
                <button
                  onClick={() => openInstitutional('institucional')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('fale-conosco')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.contactSac}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('contas-e-seguranca')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.accountSecurity}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('carreiras')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Trabalhe Conosco & Vagas
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('entregadores')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Seja um Transportador Parceiro
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Ética */}
          <div>
            <div
              onClick={() => setCol2Open(!col2Open)}
              className="flex items-center justify-between font-display font-bold text-white text-sm uppercase tracking-wider mb-3 cursor-pointer md:cursor-default"
            >
              <span>Garantia & Legal</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${col2Open ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2.5 ${col2Open ? 'block' : 'hidden md:block'}`}>
              <li>
                <button
                  onClick={() => openInstitutional('termos-e-condicoes')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.privacyTerms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('codigo-de-conduta')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Política de Trocas e Devoluções
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('privacidade')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Política de Privacidade & LGPD
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('dicas-de-seguranca')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Segurança no Pagamento & Canteiro
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Para Sua Obra */}
          <div>
            <div
              onClick={() => setCol3Open(!col3Open)}
              className="flex items-center justify-between font-display font-bold text-white text-sm uppercase tracking-wider mb-3 cursor-pointer md:cursor-default"
            >
              <span>Para Sua Obra</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${col3Open ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2.5 ${col3Open ? 'block' : 'hidden md:block'}`}>
              <li>
                <button
                  onClick={() => setActiveView('order_tracking')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.orders} & Rastreamento de Entrega
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('login')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {t.account} / Faturamento PJ
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInstitutional('fale-conosco')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                  <span>Televendas: 0800 567 8673</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setActiveView('ecommerce');
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Catálogo Completo da Obra ao Acabamento
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Redes Sociais & Marca */}
          <div>
            <div className="mb-3">
              <LMStoreLogo variant="full" inverted={true} size="md" />
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-4">
              Sua loja online completa de materiais de construção: da fundação e alvenaria às instalações hidráulicas, elétricas, pisos, tintas e ferramentas de alta precisão.
            </p>

            {/* Social handles */}
            <p className="text-white font-semibold mb-2">Canais Oficiais</p>
            <div className="space-y-1.5 text-stone-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">WhatsApp Obras:</span>
                <span className="hover:text-white transition-colors cursor-pointer">(11) 98765-4321</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">Instagram:</span>
                <span className="hover:text-white transition-colors cursor-pointer">@lmstore.materiais</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">YouTube:</span>
                <span className="hover:text-white transition-colors cursor-pointer">/LMStoreConstrucao</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">E-mail:</span>
                <span className="hover:text-white transition-colors cursor-pointer">contato@lmstore.com.br</span>
              </div>
            </div>
          </div>

        </div>

        {/* Base: Payment methods, Security Seals and Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-stone-400 text-[11px] font-semibold">Formas de Pagamento:</span>
            <div className="flex items-center gap-1.5 text-stone-300">
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-bold text-amber-400">PIX (5% OFF)</span>
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-bold">BOLETO BANCÁRIO</span>
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-bold">CARTÃO BNDES</span>
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-bold">FATURAMENTO PJ</span>
              <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-bold">VISA / MASTER / ELO</span>
            </div>
          </div>

          {/* Security Seals */}
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Certificado SSL 256-Bit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Ambiente 100% Seguro</span>
            </div>
          </div>
        </div>

        {/* Corporate Legal Footer */}
        <div className="mt-6 pt-6 border-t border-stone-800/80 text-center text-stone-500 text-[11px] space-y-1">
          <p>
            LM Store Comércio Varejista e Atacadista de Materiais de Construção Ltda. — CNPJ: 42.189.540/0001-92
          </p>
          <p>
            Centro Logístico & Loja Matriz: Av. dos Estados, 4500 - Galpões 08 e 09 - Parque Jaçatuba, Santo André - SP - CEP 09210-580
          </p>
          <p className="text-stone-400 pt-1">
            © 2026 LM Store - Sua Loja Online de Materiais de Construção. {t.allRightsReserved}
          </p>
        </div>

      </div>
    </footer>
  );
};
