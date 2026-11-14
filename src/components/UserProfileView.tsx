import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  MapPin,
  CreditCard,
  Ticket,
  Clock,
  Sparkles,
  Award,
  Wallet,
  Coins,
  ShieldCheck,
  Bell,
  Heart,
  ListChecks,
  Headphones,
  FileText,
  LogOut,
  Edit3,
  Plus,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  ArrowRight,
  Check,
  Camera,
  Download,
  Building2,
  HardHat,
  X,
  FileSpreadsheet,
  Mail,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address, UserPaymentMethod, UserCoupon } from '../types';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    updateUserProfile,
    addSavedAddress,
    deleteSavedAddress,
    addPaymentMethod,
    deletePaymentMethod,
    orders,
    currentAddress,
    setCurrentAddress,
    setActiveView,
    logout,
    showToast,
    openReportModal,
    wishlistIds,
    loyaltyPoints,
    loyaltyHistory,
    loyaltyRewardsCatalog,
    redeemedCoupons,
    redeemLoyaltyReward,
    applyCoupon
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'loyalty' | 'orders' | 'addresses' | 'wallet' | 'coupons'>('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Hidden file input for Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit profile state
  const [editName, setEditName] = useState(currentUser.name || 'Paulo Silva');
  const [editFullName, setEditFullName] = useState(currentUser.fullName || 'Paulo Roberto Silva');
  const [editEmail, setEditEmail] = useState(currentUser.email || 'paulo.silva@lmstore.com.br');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '(11) 98123-4567');
  const [editCpf, setEditCpf] = useState(currentUser.cpf || '234.567.890-12');

  // Address form state
  const [addrLabel, setAddrLabel] = useState('Obra Residencial / Casa');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrNumber, setAddrNumber] = useState('');
  const [addrComplement, setAddrComplement] = useState('');
  const [addrNeighborhood, setAddrNeighborhood] = useState('');
  const [addrCity, setAddrCity] = useState('São Paulo');
  const [addrState, setAddrState] = useState('SP');
  const [addrCep, setAddrCep] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Card form state
  const [cardHolder, setCardHolder] = useState('Paulo R. Silva');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('Mastercard Black');

  const savedAddresses = currentUser.savedAddresses || [
    currentUser.address || {
      id: 'addr-paulo-1',
      label: 'Obra Residencial / Casa',
      street: 'Rua Oscar Freire',
      number: '1420',
      complement: 'Canteiro Lote B',
      neighborhood: 'Cerqueira César / Jardins',
      city: 'São Paulo',
      state: 'SP',
      cep: '01426-001',
      isDefault: true,
    }
  ];

  const paymentMethods: UserPaymentMethod[] = currentUser.paymentMethods || [
    { id: 'pay-1', type: 'credit', brand: 'Mastercard Black', last4: '4829', label: 'Cartão Principal (Crédito Corporativo)' },
    { id: 'pay-2', type: 'pix', label: 'Chave Pix (CPF 234.567.***-**)' },
    { id: 'pay-3', type: 'wallet', label: 'Carteira Digital LM Store Pay' },
  ];

  const baseCoupons: UserCoupon[] = currentUser.coupons || [
    { id: 'coup-1', code: 'LMOBRA10', discount: 10, type: 'percent', description: '10% OFF em toda a linha de cimento e argamassa', minOrder: 150, validUntil: '31/12/2026' },
    { id: 'coup-2', code: 'FRETECAMPANHA', discount: 100, type: 'shipping', description: 'Frete Munck Grátis para pedidos acima de R$ 300', minOrder: 300, validUntil: '31/12/2026' },
    { id: 'coup-3', code: 'PROVIP50', discount: 50, type: 'fixed', description: 'R$ 50 OFF exclusivo para construtores Clube Pro', minOrder: 400, validUntil: '31/12/2026' },
  ];

  const coupons: UserCoupon[] = [
    ...redeemedCoupons,
    ...baseCoupons.filter((bc) => !redeemedCoupons.some((rc) => rc.code === bc.code)),
  ];

  // Avatar Upload Handler via FileReader
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG ou WEBP).', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        updateUserProfile({ avatar: base64Data });
        showToast('Foto de perfil do Paulo Silva atualizada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || 'Paulo Silva',
      fullName: editFullName.trim() || 'Paulo Roberto Silva',
      email: editEmail.trim() || 'paulo.silva@lmstore.com.br',
      phone: editPhone.trim() || '(11) 98123-4567',
      cpf: editCpf.trim() || '234.567.890-12',
    });
    setIsEditingProfile(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrLabel('Canteiro de Obras 02');
    setAddrStreet('');
    setAddrNumber('');
    setAddrComplement('');
    setAddrNeighborhood('');
    setAddrCity('São Paulo');
    setAddrState('SP');
    setAddrCep('');
    setAddrIsDefault(false);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrStreet(addr.street);
    setAddrNumber(addr.number);
    setAddrComplement(addr.complement || '');
    setAddrNeighborhood(addr.neighborhood);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrCep(addr.cep);
    setAddrIsDefault(Boolean(addr.isDefault));
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrNumber || !addrNeighborhood || !addrCep) {
      showToast('Preencha os campos obrigatórios do endereço.', 'warning');
      return;
    }

    const newAddr: Address = {
      id: editingAddressId || `addr-${Date.now()}`,
      label: addrLabel.trim() || 'Endereço da Obra',
      street: addrStreet.trim(),
      number: addrNumber.trim(),
      complement: addrComplement.trim(),
      neighborhood: addrNeighborhood.trim(),
      city: addrCity.trim(),
      state: addrState.trim().toUpperCase(),
      cep: addrCep.trim(),
      isDefault: addrIsDefault,
    };

    addSavedAddress(newAddr);
    setShowAddressModal(false);
  };

  const handleSetDefaultAddress = (addr: Address) => {
    const updated = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === addr.id,
    }));
    updateUserProfile({
      address: addr,
      savedAddresses: updated,
    });
    setCurrentAddress(addr);
    showToast(`Endereço "${addr.label}" definido como principal para entregas.`);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.length < 4) {
      showToast('Informe os 16 dígitos do cartão.', 'warning');
      return;
    }
    const last4Digits = cardNumber.replace(/\D/g, '').slice(-4) || '1234';
    const newCard: UserPaymentMethod = {
      id: `pay-${Date.now()}`,
      type: 'credit',
      brand: cardBrand,
      last4: last4Digits,
      label: `${cardBrand} final ${last4Digits}`,
    };
    addPaymentMethod(newCard);
    setShowCardModal(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Cupom ${code} copiado para a área de transferência!`);
  };

  // Download official cadastral report PDF
  const handleDownloadCadastralReport = () => {
    openReportModal(
      'Ficha Cadastral Oficial & Comprovante de Construtor',
      'Certificado de homologação cadastral, limite de faturamento PJ e canteiros registrados na LM Store.',
      'customer',
      {
        metrics: [
          { label: 'Cliente Titular', value: currentUser.fullName || currentUser.name },
          { label: 'E-mail Cadastrado', value: currentUser.email },
          { label: 'Status da Conta', value: currentUser.vipStatus || 'Clube LM Store Pro' },
          { label: 'Canteiros Ativos', value: `${savedAddresses.length} endereços homologados` },
        ],
        headers: ['Tipo de Registro', 'Identificação', 'Status', 'Data Validação'],
        items: [
          ['Titular da Conta', currentUser.fullName || currentUser.name, 'Ativo', 'Novembro / 2026'],
          ['Documento Fiscal', currentUser.cpf || '234.567.890-12', 'Regularizado', 'Conforme RFB'],
          ['Endereço Padrão', `${currentAddress.street}, ${currentAddress.number} - ${currentAddress.city}`, 'Ativo', 'Área de Entrega Munck'],
          ['Saldo em Carteira', `R$ ${(currentUser.walletBalance || 125.50).toFixed(2).replace('.', ',')}`, 'Disponível', 'LM Store Pay'],
        ],
        summary: `Cadastro validado para faturamento em canteiro de obras e emissão de NF-e pela LM Store Materiais de Construção Ltda. Autenticidade garantida por chave digital SHA-256.`
      }
    );
  };

  // Download orders in CSV format
  const handleDownloadOrdersCsv = () => {
    const csvHeader = 'Código,Data,Status,Total (R$),Forma de Pagamento,Itens\n';
    const csvRows = orders.map(o => {
      const itemsList = o.items.map(i => `${i.quantity}x ${i.productName}`).join('; ');
      return `"${o.code}","${new Date(o.createdAt).toLocaleDateString()}","${o.status.toUpperCase()}","${o.total.toFixed(2)}","${o.paymentMethod}","${itemsList}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lmstore_pedidos_${currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Histórico de pedidos exportado em CSV com sucesso!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Hidden file input for Avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
        <button
          onClick={() => setActiveView('ecommerce')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors p-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para a Loja</span>
        </button>

        <h1 className="font-display font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <HardHat className="w-5 h-5 text-amber-600" />
          <span>Perfil</span>
        </h1>

        <div className="w-20 sm:w-28" />
      </div>

      {/* Profile Header Card (LM Store Theme: Deep Slate + Amber) */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-slate-950 rounded-3xl text-white p-5 sm:p-8 shadow-xl relative overflow-hidden mb-6 border border-stone-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar with Upload Trigger */}
            <div className="relative group shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center font-display font-black text-2xl border-2 border-amber-500 shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              {/* Upload Camera Action Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer shadow-inner"
                title="Alterar foto de perfil (Upload)"
              >
                <Camera className="w-5 h-5 text-amber-400" />
                <span className="text-[9px] font-bold mt-0.5">Trocar Foto</span>
              </button>

              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 fill-current" /> VIP
              </span>
            </div>

            {/* Name, Contact & Metadata */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                  {currentUser.name}
                </h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-1.5 text-amber-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Editar dados cadastrais"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-1 text-xs text-stone-300 font-medium">
                <div className="flex items-center gap-1.5 text-stone-200">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentUser.phone}</span>
                </div>
              </div>

              {/* VIP Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{currentUser.vipStatus || 'Clube LM Store Pro · Frete Canteiro Ativo'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Upload & Export) */}
          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-amber-500/30 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload de Foto</span>
            </button>

            <button
              onClick={handleDownloadCadastralReport}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Comprovante</span>
            </button>
          </div>
        </div>

        {/* Quick Wallet Stats Strip */}
        <div className="mt-6 pt-5 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-white">
          <div
            onClick={() => setActiveTab('wallet')}
            className="bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 rounded-2xl p-3 cursor-pointer transition-colors"
          >
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Wallet className="w-3 h-3 text-amber-400" /> Saldo em Carteira
            </p>
            <p className="text-base sm:text-lg font-extrabold font-mono-numbers text-white mt-0.5">
              R$ {(currentUser.walletBalance || 125.50).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('wallet')}
            className="bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 rounded-2xl p-3 cursor-pointer transition-colors"
          >
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Cashback Acumulado
            </p>
            <p className="text-base sm:text-lg font-extrabold font-mono-numbers text-amber-300 mt-0.5">
              R$ {(currentUser.cashback || 34.80).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('loyalty')}
            className="bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 rounded-2xl p-3 cursor-pointer transition-colors"
          >
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Fidelidade LM
            </p>
            <p className="text-base sm:text-lg font-extrabold font-mono-numbers text-white mt-0.5">
              {loyaltyPoints.toLocaleString('pt-BR')} pts
            </p>
          </div>

          <div
            onClick={() => setActiveTab('coupons')}
            className="bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 rounded-2xl p-3 cursor-pointer transition-colors"
          >
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Ticket className="w-3 h-3 text-amber-400" /> Cupons Ativos
            </p>
            <p className="text-base sm:text-lg font-extrabold font-mono-numbers text-amber-400 mt-0.5">
              {coupons.length} disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile inline drawer / form */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-300 shadow-xl mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Editar Dados Cadastrais de Paulo Silva</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome de Exibição</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo / Razão Social</label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone com WhatsApp</label>
              <input
                type="text"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF ou CNPJ</label>
              <input
                type="text"
                required
                value={editCpf}
                onChange={(e) => setEditCpf(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fazer Upload de Nova Foto</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Navigation Tabs (Overview, Fidelidade, Pedidos, Endereços, Carteira, Cupons) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {[
          { id: 'overview', label: 'Visão Geral', icon: UserIcon },
          { id: 'loyalty', label: 'Fidelidade LM', icon: Award },
          { id: 'orders', label: 'Meus Pedidos', icon: Clock },
          { id: 'addresses', label: 'Endereços de Obra', icon: MapPin },
          { id: 'wallet', label: 'Carteira & Pagamentos', icon: CreditCard },
          { id: 'coupons', label: 'Cupons da Obra', icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-amber-400 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISÃO GERAL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Order Quick Track Card */}
          {orders.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-pulse text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
                    Pedido em Andamento #{orders[0].code}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {orders[0].items.length} itens da obra · Entrega programada no canteiro
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('order_tracking')}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Acompanhar Rota</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Menu Options */}
          <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
            <div className="p-2">
              <p className="px-4 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Minha Conta & Obras
              </p>

              <button
                onClick={() => setActiveTab('orders')}
                className="w-full px-4 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Histórico de Pedidos & Cotações</p>
                    <p className="text-[11px] text-slate-500">{orders.length} pedidos realizados</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className="w-full px-4 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Canteiros de Obras & Endereços</p>
                    <p className="text-[11px] text-slate-500">{savedAddresses.length} endereços cadastrados ({currentAddress.street})</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className="w-full px-4 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Carteira LM Store & Cartões</p>
                    <p className="text-[11px] text-slate-500">Formas de pagamento e faturamento PJ</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className="w-full px-4 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Ticket className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Cupons de Desconto da Obra</p>
                    <p className="text-[11px] text-slate-500">{coupons.length} cupons disponíveis para uso</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('loyalty')}
                className="w-full px-4 py-3 hover:bg-amber-50/60 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Programa de Fidelidade LM</p>
                    <p className="text-[11px] text-amber-700 font-semibold">
                      {loyaltyPoints.toLocaleString('pt-BR')} pontos acumulados · Troque por cupons de desconto
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => setActiveView('wishlist')}
                className="w-full px-4 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Minha Lista de Desejos</p>
                    <p className="text-[11px] text-slate-500">
                      {wishlistIds.length === 0
                        ? 'Nenhum produto salvo para compra futura'
                        : `${wishlistIds.length} ${wishlistIds.length === 1 ? 'produto salvo' : 'produtos salvos'} para compra futura`}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Document and Data Export Section */}
            <div className="p-2">
              <p className="px-4 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Downloads & Exportações
              </p>

              <button
                onClick={handleDownloadCadastralReport}
                className="w-full px-4 py-3 hover:bg-amber-50/50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Baixar Comprovante Cadastral (PDF)</p>
                    <p className="text-[11px] text-slate-500">Dados do titular, canteiros e homologação fiscal</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={handleDownloadOrdersCsv}
                className="w-full px-4 py-3 hover:bg-amber-50/50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Exportar Histórico de Pedidos (CSV)</p>
                    <p className="text-[11px] text-slate-500">Planilha com todos os insumos e valores para controle da obra</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-amber-600" />
              </button>
            </div>

            {/* Logout Action */}
            <div className="p-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-4 py-3 hover:bg-rose-50 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-700">Encerrar Sessão (Sair da Conta)</p>
                    <p className="text-[11px] text-rose-500">Você só sairá da conta ao clicar aqui</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROGRAMA DE FIDELIDADE LM */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {/* Loyalty Summary Card */}
          <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Programa de Fidelidade LM
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono-numbers text-white">
                    {loyaltyPoints.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm font-bold text-amber-400">pontos disponíveis</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Nível atual:{' '}
                  <strong className="text-amber-400">
                    {loyaltyPoints >= 700
                      ? 'Mestre Ouro'
                      : loyaltyPoints >= 300
                      ? 'Construtor Prata'
                      : 'Obra Bronze'}
                  </strong>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-xs font-extrabold text-amber-400 block">+1 pt / R$10</span>
                  <span className="text-[10px] text-slate-400">Em compras</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-xs font-extrabold text-amber-400 block">+35 pts</span>
                  <span className="text-[10px] text-slate-400">Avaliações</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-xs font-extrabold text-amber-400 block">+15 pts</span>
                  <span className="text-[10px] text-slate-400">Uso da IA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Catalog */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Resgatar Cupons com Pontos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {loyaltyRewardsCatalog.map((reward) => {
                const canRedeem = loyaltyPoints >= reward.pointsCost;
                return (
                  <div
                    key={reward.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-950">{reward.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-mono-numbers font-black text-[11px]">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                        {reward.description}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Pedido mínimo: R$ {reward.minOrder.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canRedeem}
                      onClick={() => redeemLoyaltyReward(reward.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        canRedeem
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem
                        ? `Resgatar por ${reward.pointsCost} pontos`
                        : `Faltam ${reward.pointsCost - loyaltyPoints} pontos`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeemed Coupons Wallet */}
          {redeemedCoupons.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-slate-900">
                Meus Cupons Resgatados ({redeemedCoupons.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {redeemedCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-mono font-black text-xs text-slate-950 bg-white px-2 py-0.5 rounded border border-amber-300 inline-block">
                        {coupon.code}
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {coupon.description}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Mín. R$ {coupon.minOrder.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        applyCoupon(coupon.code);
                        setActiveView('cart');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points History */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Extrato de Pontuação ({loyaltyHistory.length})
            </h3>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {loyaltyHistory.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.description}</p>
                    <span className="text-[10px] text-slate-400">
                      {item.date} · {item.source.toUpperCase()}
                      {item.couponCode ? ` · Cupom ${item.couponCode}` : ''}
                    </span>
                  </div>
                  <span
                    className={`font-mono-numbers font-extrabold shrink-0 ${
                      item.type === 'earn' ? 'text-amber-700' : 'text-red-600'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEUS PEDIDOS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Histórico de Pedidos de Paulo Silva ({orders.length})
            </h3>
            <button
              onClick={handleDownloadOrdersCsv}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Planilha CSV</span>
            </button>
          </div>

          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-900">Pedido #{order.code}</span>
                  <p className="text-[11px] text-slate-400">
                    Entrega no canteiro em {order.address?.city || 'São Paulo'}
                    {order.scheduledDate && order.scheduledShift
                      ? ` · Agendado: ${order.scheduledDate} (${order.scheduledShift})`
                      : ''}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {order.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono-numbers">{item.quantity}x</span>
                      <span>{item.productName}</span>
                    </div>
                    <span className="font-mono-numbers font-medium">R$ {item.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500">Total do Pedido</span>
                  <p className="text-sm font-extrabold font-mono-numbers text-slate-900">
                    R$ {order.items.reduce((acc, i) => acc + i.total, 0).toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('order_tracking')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Rastrear Caminhão
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ENDEREÇOS DA OBRA (CRUD COMPLETO) */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                Canteiros e Endereços Cadastrados ({savedAddresses.length})
              </h3>
              <p className="text-xs text-slate-500">Adicione, edite ou exclua pontos de entrega com munck.</p>
            </div>
            <button
              onClick={handleOpenAddAddress}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Canteiro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {savedAddresses.map((addr) => {
              const isSelected = currentAddress.id === addr.id || addr.isDefault;
              return (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 shadow-md ring-1 ring-amber-500/30'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                        <h4 className="font-display font-bold text-xs text-slate-900">{addr.label}</h4>
                      </div>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          Principal
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 mt-2 font-medium">
                      {addr.street}, {addr.number}
                    </p>
                    {addr.complement && (
                      <p className="text-[11px] text-slate-500">{addr.complement}</p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      {addr.neighborhood} · {addr.city} - {addr.state} · CEP {addr.cep}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {!isSelected ? (
                      <button
                        onClick={() => handleSetDefaultAddress(addr)}
                        className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                      >
                        Definir como Principal
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Endereço Padrão de Entrega
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Editar endereço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {savedAddresses.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o endereço "${addr.label}"?`)) {
                              deleteSavedAddress(addr.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Excluir endereço"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CARTEIRA & PAGAMENTOS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-stone-900 to-slate-950 rounded-3xl p-6 text-white shadow-lg border border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Carteira Digital LM Store Pay
                </p>
                <h3 className="font-display font-extrabold text-3xl font-mono-numbers mt-1">
                  R$ {(currentUser.walletBalance || 125.50).toFixed(2).replace('.', ',')}
                </h3>
              </div>
              <button
                onClick={() => showToast('Chave Pix copiada para recarga do saldo da obra!')}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow transition-all hover:bg-amber-400 cursor-pointer"
              >
                + Recarregar Saldo
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span>Cashback acumulado: R$ {(currentUser.cashback || 34.80).toFixed(2).replace('.', ',')}</span>
              <span>100% protegido com emissão de NF-e e boleto faturado PJ</span>
            </div>
          </div>

          {/* Saved Cards & Payment Methods (CRUD) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-display font-bold text-xs text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Formas de Pagamento Homologadas</span>
              </h4>
              <button
                onClick={() => setShowCardModal(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Cartão</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {paymentMethods.map((pay) => (
                <div key={pay.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      {pay.type === 'pix' ? <Coins className="w-4 h-4 text-amber-600" /> : <CreditCard className="w-4 h-4 text-slate-700" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{pay.label}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{pay.brand || pay.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Ativo
                    </span>
                    {paymentMethods.length > 1 && (
                      <button
                        onClick={() => deletePaymentMethod(pay.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Remover forma de pagamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEUS CUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Cupons da Obra Disponíveis ({coupons.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-extrabold text-sm text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Válido até {coupon.validUntil}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 mt-1">{coupon.description}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pedido mínimo: R$ {coupon.minOrder.toFixed(2).replace('.', ',')}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </button>

                  <button
                    onClick={() => {
                      const res = applyCoupon(coupon.code);
                      if (!res.success) {
                        handleCopyCoupon(coupon.code);
                      }
                      setActiveView('cart');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                  >
                    Usar no Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR / EDITAR ENDEREÇO */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-display font-bold text-base text-slate-900">
                {editingAddressId ? 'Editar Endereço da Obra' : 'Adicionar Novo Canteiro de Obras'}
              </h4>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Identificação / Nome do Local</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canteiro Edifício Horizonte, Casa de Campo, Obra Vila Mariana"
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rua / Logradouro</label>
                  <input
                    type="text"
                    required
                    placeholder="Av. Paulista"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={addrNumber}
                    onChange={(e) => setAddrNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complemento / Lote</label>
                  <input
                    type="text"
                    placeholder="Galpão B, Lote 14"
                    value={addrComplement}
                    onChange={(e) => setAddrComplement(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    placeholder="Bela Vista"
                    value={addrNeighborhood}
                    onChange={(e) => setAddrNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CEP</label>
                  <input
                    type="text"
                    required
                    placeholder="01451-000"
                    value={addrCep}
                    onChange={(e) => setAddrCep(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                />
                <span>Definir este endereço como principal para descarregamento</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  Salvar Endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR NOVO CARTÃO */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-display font-bold text-sm text-slate-900">
                Adicionar Cartão de Crédito
              </h4>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bandeira</label>
                <select
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Mastercard Black">Mastercard Black / Corporativo</option>
                  <option value="Visa Infinite">Visa Infinite</option>
                  <option value="Cartão BNDES">Cartão BNDES Construção</option>
                  <option value="Elo Empresarial">Elo Empresarial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="5502 •••• •••• 4829"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Validade</label>
                  <input
                    type="text"
                    required
                    placeholder="12/29"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR SAÍDA DA CONTA (LOGOUT) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>
            <h4 className="font-display font-black text-base text-slate-900">
              Deseja sair da sua conta?
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Você continuará podendo navegar pelo catálogo de materiais de construção, mas precisará fazer login novamente para finalizar compras e acompanhar suas entregas.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Permanecer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
