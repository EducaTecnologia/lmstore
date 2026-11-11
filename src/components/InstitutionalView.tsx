import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Briefcase,
  Truck,
  FileText,
  Lock,
  ChevronRight,
  HardHat,
  BadgeCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstitutionalView: React.FC = () => {
  const { activeInstitutionalSlug, openInstitutional, setActiveView, showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Dúvida sobre Pedido');
  const [contactMessage, setContactMessage] = useState('');

  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [courierVehicle, setCourierVehicle] = useState('Caminhão Munck');
  const [courierCity, setCourierCity] = useState('');

  const currentSlug = activeInstitutionalSlug || 'institucional';

  const pages = [
    { slug: 'institucional', label: 'Sobre a LM Store', icon: Building2 },
    { slug: 'fale-conosco', label: 'Fale Conosco & Televendas', icon: Phone },
    { slug: 'contas-e-seguranca', label: 'Segurança & Faturamento PJ', icon: ShieldCheck },
    { slug: 'carreiras', label: 'Trabalhe Conosco', icon: Briefcase },
    { slug: 'entregadores', label: 'Transportadores & Frota Munck', icon: Truck },
    { slug: 'termos-e-condicoes', label: 'Termos e Condições de Venda', icon: FileText },
    { slug: 'codigo-de-conduta', label: 'Garantia & Devoluções', icon: ShieldCheck },
    { slug: 'privacidade', label: 'Política de Privacidade (LGPD)', icon: Lock },
    { slug: 'dicas-de-seguranca', label: 'Segurança no Canteiro', icon: ShieldCheck },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Sua mensagem foi enviada ao atendimento comercial da LM Store!', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handleCourierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cadastro de transportador recebido com sucesso!', 'success');
    setCourierName('');
    setCourierPhone('');
    setCourierCity('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveView('ecommerce')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-700 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Loja</span>
        </button>

        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          Central Institucional LM Store
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-1">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-xs">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1.5 mb-1">
              Institucional LM Store
            </p>
            {pages.map((p) => {
              const Icon = p.icon;
              const isActive = currentSlug === p.slug;

              return (
                <button
                  key={p.slug}
                  onClick={() => openInstitutional(p.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area (3 cols) */}
        <main className="md:col-span-3 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          
          {/* 1. INSTITUCIONAL */}
          {currentSlug === 'institucional' && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Quem Somos
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">
                Sua Loja Completa de Materiais de Construção: da Fundação ao Acabamento
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                A <strong>LM Store</strong> nasceu com o propósito de transformar a experiência de compra de materiais de construção no Brasil. Fornecemos diretamente aos consumidores, pedreiros, arquitetos e construtoras um portfólio completo e homologado com as maiores marcas nacionais: Votorantim, Tigre, Gerdau, Bosch, Portobello, Suvinil, SIL e Brasilit.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="font-display font-extrabold text-2xl text-amber-950 font-mono-numbers block">
                    35.000+
                  </span>
                  <span className="text-xs text-amber-900 font-bold mt-1 block">
                    Itens em Estoque Pronta Entrega
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="font-display font-extrabold text-2xl text-stone-900 font-mono-numbers block">
                    100%
                  </span>
                  <span className="text-xs text-stone-600 font-bold mt-1 block">
                    Normas ABNT / INMETRO
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900 text-amber-400 border border-stone-800 text-center">
                  <span className="font-display font-extrabold text-2xl font-mono-numbers block">
                    2 Horas
                  </span>
                  <span className="text-xs text-stone-300 font-bold mt-1 block">
                    Retirada Expressa no Balcão
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <h3 className="font-display font-bold text-base text-stone-900">
                  Nossa Logística para Canteiros de Obra
                </h3>
                <p>
                  Com centro de distribuição integrado e frota própria equipada com guindautos munck, descarregamos paletes pesados de cimento, blocos, telhas e ferragens exatamente no ponto necessário do canteiro, evitando quebras e poupando tempo da equipe de obra.
                </p>
              </div>
            </div>
          )}

          {/* 2. FALE CONOSCO */}
          {currentSlug === 'fale-conosco' && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Atendimento & Televendas
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Fale Conosco — Central de Atendimento ao Construtor
              </h1>
              <p className="text-xs text-stone-600">
                Segunda a sexta das 07h00 às 19h00, e aos sábados das 07h30 às 14h00.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">WhatsApp Obras & Orçamentos</span>
                    <span className="text-xs text-stone-500 font-mono-numbers">(11) 98765-4321</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-stone-200 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">E-mail Comercial & Cotações PJ</span>
                    <span className="text-xs text-stone-500">cotacao@lmstore.com.br</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-3 pt-4 border-t border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Seu Nome / Razão Social</label>
                    <input
                      type="text"
                      required
                      placeholder="Construtora Silva & Filhos"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Seu E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="compras@suaempresa.com.br"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Assunto</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="Cotação para Obra">Cotação de Grande Porte (Cimento, Aço, Tijolos)</option>
                    <option value="Dúvida sobre Pedido">Dúvida sobre Pedido ou Rastreio de Munck</option>
                    <option value="Faturamento PJ">Condições de Faturamento PJ / Boleto 30/60 dias</option>
                    <option value="Parceria de Fornecedor">Quero fornecer produtos / Fabricante</option>
                    <option value="Outros">Outros Assuntos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mensagem ou Lista de Materiais</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreva as quantidades e itens necessários para seu canteiro de obras..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. CONTA E SEGURANÇA */}
          {currentSlug === 'contas-e-seguranca' && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Privacidade & Segurança
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Conta, Faturamento PJ e Segurança de Dados
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                Na LM Store, seus dados cadastrais, notas fiscais eletrônicas (NF-e) e dados de pagamento são protegidos por criptografia de nível bancário e governança alinhada à LGPD.
              </p>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <h3 className="font-bold text-stone-900">Vantagens do Cadastro de Faturamento PJ</h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  <li>Limite de crédito pré-aprovado com faturamento via boleto (28/56 dias).</li>
                  <li>Emissão automatizada de NF-e para o CNPJ da construtora ou incorporadora.</li>
                  <li>Gerente de contas dedicado para negociação de lotes fechados e carretas diretas.</li>
                </ul>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-stone-900">Privacidade de Dados (DPO)</h3>
                <p className="text-stone-600">
                  Para exercer seus direitos de titular de dados ou atualizar cadastros fiscais: <strong>privacidade@lmstore.com.br</strong>.
                </p>
              </div>
            </div>
          )}

          {/* 4. CARREIRAS */}
          {currentSlug === 'carreiras' && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Trabalhe Conosco
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Carreiras na LM Store
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                Faça parte de uma das redes de e-commerce e logística de construção que mais crescem no estado.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    Logística & Distribuição · Presencial
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mt-0.5">Operador de Empilhadeira e Carregamento</h4>
                  <p className="text-xs text-stone-500">Centro Logístico Santo André - SP</p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    Comercial Obras · Híbrido
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mt-0.5">Consultor Técnico de Vendas (Engenharia Civil)</h4>
                  <p className="text-xs text-stone-500">São Paulo e Grande ABC</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. ENTREGADORES E FROTA */}
          {currentSlug === 'entregadores' && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Logística & Frota
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Seja um Transportador Parceiro LM Store
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                Operamos com caminhões toco, truck, carretas e especialmente <strong>caminhões munck</strong> para entregas diárias programadas aos canteiros de obra.
              </p>

              <form onSubmit={handleCourierSubmit} className="space-y-3 pt-4 border-t border-stone-100">
                <h3 className="font-bold text-sm text-stone-900">Cadastre seu Veículo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou razão social"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Telefone / WhatsApp com DDD"
                    value={courierPhone}
                    onChange={(e) => setCourierPhone(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={courierVehicle}
                    onChange={(e) => setCourierVehicle(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="Caminhão Munck">Caminhão Munck (com Guindauto)</option>
                    <option value="Caminhão Toco">Caminhão Toco (Carga Seca)</option>
                    <option value="Caminhão Truck">Caminhão Truck (3 Eixos)</option>
                    <option value="Fiorino / Utilitário">Utilitário / Fiorino (Entregas Expressas)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Cidade / Base Operacional"
                    value={courierCity}
                    onChange={(e) => setCourierCity(e.target.value)}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-sm"
                >
                  Cadastrar Veículo / Frota
                </button>
              </form>
            </div>
          )}

          {/* 6. TERMOS DE USO */}
          {currentSlug === 'termos-e-condicoes' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Legal
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Termos e Condições de Fornecimento LM Store
              </h1>
              <p>
                Estes termos regem o fornecimento de materiais de construção pela plataforma LM Store. Todas as mercadorias acompanham Nota Fiscal e garantia oficial de fábrica conforme o Código de Defesa do Consumidor.
              </p>
              <h3 className="font-bold text-stone-900">1. Descarregamento no Canteiro de Obras</h3>
              <p>
                O descarregamento é realizado em local seguro indicado pelo responsável da obra com acesso viável para o caminhão. Cargas descarregadas por caminhão munck requerem isolamento da área de manobra.
              </p>
              <h3 className="font-bold text-stone-900">2. Conferência de Mercadoria</h3>
              <p>
                Recomendamos a conferência quantitativa no ato do recebimento, especialmente para sacaria de cimento, cerâmicas e fiação elétrica lacrada.
              </p>
            </div>
          )}

          {/* 7. GARANTIAS */}
          {currentSlug === 'codigo-de-conduta' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Garantia Oficial
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Garantia, Trocas e Devoluções LM Store
              </h1>
              <p>
                Trabalhamos exclusivamente com fabricantes certificados que garantem conformidade com as normas ABNT NBR. Em caso de lotes com avarias de transporte ou divergências, a reposição é tratada com prioridade máxima.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Troca expressa em até 7 dias para itens sem uso em embalagem original.</li>
                <li>Acionamento direto da assistência técnica para ferramentas elétricas (Bosch, DeWalt, Makita).</li>
                <li>Canal de suporte pós-obra: <strong>posvenda@lmstore.com.br</strong>.</li>
              </ul>
            </div>
          )}

          {/* 8. PRIVACIDADE LGPD */}
          {currentSlug === 'privacidade' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                LGPD
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Política de Privacidade & Proteção de Dados
              </h1>
              <p>
                A LM Store trata os dados de seus clientes em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              <h3 className="font-bold text-stone-900">Finalidade dos Dados</h3>
              <p>
                Utilizamos dados cadastrais e de endereço estritamente para emissão de NF-e, roteirização da frota de entrega e comunicação sobre o status do pedido da sua obra.
              </p>
            </div>
          )}

          {/* 9. DICAS DE SEGURANÇA */}
          {currentSlug === 'dicas-de-seguranca' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-black">
                Prevenção & Canteiro
              </span>
              <h1 className="font-display font-extrabold text-2xl text-stone-900">
                Segurança no Canteiro de Obras & EPIs Obrigatórios
              </h1>
              <p>
                A LM Store promove a segurança do trabalho (NR-18 e NR-6). Ao receber cargas pesadas no canteiro:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Utilize sempre capacete com jugular, luvas de vaqueta e botas com bico de aço.</li>
                <li>Mantenha distância mínima de segurança do raio de giro de guindautos munck.</li>
                <li>Armazene sacos de cimento em local seco, sobre estrados de madeira afastados do piso e paredes.</li>
              </ul>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
