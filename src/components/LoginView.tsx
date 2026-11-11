import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronLeft,
  Crown,
  Truck,
  HardHat,
  ShieldCheck,
  Building2,
  Wrench,
  X,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { LMStoreLogo } from './LMStoreLogo';

export const LoginView: React.FC = () => {
  const { login, setActiveView, showToast, switchRole, postLoginRedirect } = useApp();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Form fields (Defaulting to Paulo Silva for instant testing and presentation)
  const [emailOrPhone, setEmailOrPhone] = useState('paulo.silva@lmstore.com.br');
  const [password, setPassword] = useState('senhaSegura123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      if (!termsAccepted) {
        showToast('É necessário aceitar os Termos de Uso e Política de Privacidade.', 'warning');
        return;
      }
      showToast('Cadastro realizado com sucesso! Bem-vindo à LM Store.');
      login(emailOrPhone || 'paulo.silva@lmstore.com.br', 'customer');
    } else {
      login(emailOrPhone || 'paulo.silva@lmstore.com.br', 'customer');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      showToast(`Link de recuperação enviado para: ${forgotEmail}`, 'success');
      setForgotPasswordOpen(false);
    }
  };

  const demoRoles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'customer', title: 'Cliente / Construtor', desc: 'E-commerce, compras de materiais e rastreio de munck' },
    { role: 'admin', title: 'Administrador Geral', desc: 'Gestão executiva, vendas, CMS e relatórios da loja' },
    { role: 'operator', title: 'Operador de Pedidos', desc: 'Faturamento, separação e conferência de cargas' },
    { role: 'stock', title: 'Gestão de Estoque', desc: 'Controle de paletes, sacaria e almoxarifado' },
    { role: 'finance', title: 'Financeiro', desc: 'Boleto faturado PJ, fluxo de caixa e conciliação' },
    { role: 'delivery', title: 'Logística de Entregas', desc: 'Gestão de caminhões munck, toco e frotas' },
    { role: 'courier', title: 'Motorista de Munck', desc: 'Painel com rotas até o canteiro e comprovante' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6 lg:p-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden lg:grid lg:grid-cols-2 flex flex-col">
        
        {/* LEFT: BRAND PANEL (SHOWN ONLY ON DESKTOP) */}
        <div className="hidden lg:flex relative bg-stone-950 text-white p-8 sm:p-10 flex-col justify-between overflow-hidden min-h-[580px]">
          {/* Background Photography with Scrim */}
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=1000&auto=format&fit=crop&q=80"
            alt="Canteiro de obras e materiais LM Store"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000&auto=format&fit=crop&q=80';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent" />

          {/* Top Wordmark */}
          <div className="relative z-10">
            <button
              onClick={() => setActiveView('ecommerce')}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 transition-colors mb-6 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar para a Loja</span>
            </button>

            <LMStoreLogo variant="full" inverted={true} size="md" />

            <p className="text-[11px] uppercase tracking-widest text-amber-400 font-black mt-2">
              Sua Loja de Materiais de Construção
            </p>
          </div>

          {/* Center Headline & Bullets */}
          <div className="relative z-10 my-6">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
              Tudo para a sua obra, da fundação ao acabamento.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Cimentos Votoran, conexões Tigre, aço Gerdau, porcelanatos Portobello e tintas Suvinil com frete munck até o canteiro.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-stone-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Entrega com caminhão munck e descarregamento no canteiro</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Condições especiais e faturamento em boleto para construtoras</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Produtos 100% originais em conformidade com normas ABNT</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>Mais de 24 marcas homologadas</span>
            <span className="text-amber-400 font-bold">LM Store Oficial</span>
          </div>
        </div>

        {/* RIGHT: ACCESS CARD (LOGIN / REGISTRATION) */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between w-full">
          <div>
            {/* Mobile/Tablet Compact Brand Header */}
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <button
                onClick={() => setActiveView('ecommerce')}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-amber-700 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Loja</span>
              </button>
              <LMStoreLogo variant="compact" size="sm" />
            </div>

            {/* Title */}
            <div className="mb-5">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900">
                {isRegisterMode ? 'Criar Conta de Construtor' : 'Entrar na LM Store'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {isRegisterMode
                  ? 'Cadastre-se para cotar materiais e faturar compras para sua obra'
                  : 'Acesse suas compras, orçamentos e acompanhe a frota de entregas'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome Completo / Construtora
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Paulo Roberto Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  E-mail ou Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  placeholder="paulo.silva@lmstore.com.br ou (11) 98123-4567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">Senha</label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              {!isRegisterMode && (
                <div className="flex items-center justify-between text-xs text-stone-600 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Manter conectado</span>
                  </label>
                </div>
              )}

              {/* Register Mode extras */}
              {isRegisterMode && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp para Acompanhamento
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-stone-600 pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600 mt-0.5"
                    />
                    <span>
                      Li e concordo com os{' '}
                      <span className="font-bold text-amber-700 hover:underline">Termos de Uso</span>{' '}
                      e a{' '}
                      <span className="font-bold text-amber-700 hover:underline">Política de Privacidade</span>.
                    </span>
                  </label>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2"
              >
                {isRegisterMode ? 'Criar Minha Conta na LM Store' : 'Entrar na Plataforma'}
              </button>
            </form>

            {/* Fast 1-Click Paulo Silva VIP Login Account Card */}
            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xs">
                  P
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950 flex items-center gap-1">
                    Paulo Silva (Cliente VIP) <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                  </p>
                  <p className="text-[10px] text-amber-800">Conta com carteira e faturamento PJ pré-carregados</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => login('paulo.silva@lmstore.com.br', 'customer')}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 text-[11px] font-bold rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Entrar
              </button>
            </div>

            {/* Toggle Login <-> Register */}
            <div className="mt-4 text-center">
              {isRegisterMode ? (
                <p className="text-xs text-stone-600">
                  Já possui conta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Fazer Login
                  </button>
                </p>
              ) : (
                <p className="text-xs text-stone-600">
                  Não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Quick Profile Switcher for Assessment / Demo */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Alternar Perfis Operacionais (Acesso Direto):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {demoRoles.slice(0, 4).map((r) => (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-medium transition-colors text-left truncate cursor-pointer"
                  title={r.desc}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
              <h4 className="font-display font-bold text-sm text-stone-900">
                Recuperação de Senha
              </h4>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4">
              Informe seu e-mail cadastrado para enviarmos as instruções de redefinição de acesso.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Enviar Link de Recuperação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
