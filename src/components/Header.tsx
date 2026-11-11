import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  X,
  HelpCircle,
  Bell,
  User as UserIcon,
  HardHat,
  PhoneCall,
  Truck,
  CheckCheck,
  Check,
  Info,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LMStoreLogo } from './LMStoreLogo';
import { FreightLogisticsModal } from './FreightLogisticsModal';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = () => {
  const {
    currentUser,
    cartCount,
    cartTotal,
    currentAddress,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setSelectedCategorySlug,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
    openInstitutional,
    activeView,
    t
  } = useApp();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [showFreightModal, setShowFreightModal] = useState(false);

  const searchShortcuts = [
    'Cimento Votoran 50kg',
    'Tubo Soldável Tigre',
    'Cabo Flexível SIL 2.5mm',
    'Porcelanato Portobello',
    'Tinta Suvinil Fosco',
    'Vergalhão Gerdau 3/8',
    'Furadeira de Impacto Bosch',
    'Argamassa AC-III Quartzolit'
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
        {/* Main top bar container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-2.5 sm:gap-5">
            
            {/* ZONE 1: LOGO & ADDRESS SELECTOR */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setActiveView('ecommerce');
                }}
                className="group text-left cursor-pointer transition-transform active:scale-95"
                title="LM Store - Início"
              >
                <LMStoreLogo variant="full" size="md" />
              </button>

              {/* Delivery Address Pill (Desktop) */}
              <button
                onClick={() => setShowAddressModal(true)}
                className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-800 bg-slate-100 hover:bg-amber-50/70 px-2.5 py-1.5 rounded-full transition-colors border border-slate-200/80 cursor-pointer"
                title="Alterar endereço de entrega para a obra"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[170px] font-medium text-slate-800">
                  {currentAddress.street}, {currentAddress.number}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* ZONE 2: SEARCH BAR WITH AUTOCOMPLETE */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar cimento, porcelanato, fios, tubos, ferramentas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-full border border-slate-200 focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchSuggestions && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSearchSuggestions(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 p-3.5 text-xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Mais Buscados na Construção:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {searchShortcuts.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setShowSearchSuggestions(false);
                            setActiveView('ecommerce');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 rounded-full transition-colors text-[11px] font-medium cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ZONE 3: ACTIONS (CARRINHO & LOGIN / PERFIL DO PAULO SILVA) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Shopping Cart Button */}
              <button
                onClick={() => setActiveView('cart')}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Ver Carrinho de Materiais"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-slate-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono-numbers shadow">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-mono-numbers font-bold">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </button>

              {/* Notification Bell Button & Popover Container */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                  className="relative p-2 text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title="Notificações e Alertas de Entrega"
                >
                  <Bell className="w-5 h-5 text-slate-800" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-4 px-1 bg-amber-500 text-slate-950 font-mono-numbers font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Rich Notification Dropdown Panel */}
                {showNotificationPanel && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotificationPanel(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-3xl shadow-2xl z-40 overflow-hidden text-xs animate-in fade-in zoom-in-95">
                      {/* Notification Header */}
                      <div className="bg-slate-950 text-white p-3.5 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-amber-400" />
                          <span className="font-extrabold text-xs">Notificações LM Store</span>
                          {unreadNotificationsCount > 0 && (
                            <span className="bg-amber-500 text-slate-950 font-mono-numbers font-black text-[10px] px-1.5 py-0.5 rounded-full">
                              {unreadNotificationsCount} novas
                            </span>
                          )}
                        </div>

                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={() => {
                              markAllNotificationsAsRead();
                              showToast('Todas as notificações foram marcadas como lidas.');
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Ler todas</span>
                          </button>
                        )}
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex border-b border-stone-100 bg-stone-50 px-3 py-1.5 gap-2 text-[11px]">
                        <button
                          onClick={() => setNotificationFilter('all')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                            notificationFilter === 'all'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Todas ({notifications.length})
                        </button>
                        <button
                          onClick={() => setNotificationFilter('unread')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                            notificationFilter === 'unread'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Não Lidas ({unreadNotificationsCount})
                        </button>
                      </div>

                      {/* Notifications Items List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                        {(notificationFilter === 'unread'
                          ? notifications.filter((n) => !n.read)
                          : notifications
                        ).length === 0 ? (
                          <div className="p-6 text-center text-stone-400">
                            <Info className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="font-semibold text-stone-600">Nenhuma notificação nesta aba.</p>
                          </div>
                        ) : (
                          (notificationFilter === 'unread'
                            ? notifications.filter((n) => !n.read)
                            : notifications
                          ).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if (notif.link === '#rastreio') {
                                  setActiveView('order_tracking');
                                  setShowNotificationPanel(false);
                                }
                              }}
                              className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer hover:bg-amber-50/50 ${
                                !notif.read ? 'bg-amber-50/30' : 'bg-white'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {notif.type === 'order' && (
                                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                                    <Truck className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'promo' && (
                                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'stock' && (
                                  <div className="w-7 h-7 rounded-xl bg-stone-100 text-amber-800 flex items-center justify-center font-bold">
                                    <HardHat className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {notif.type === 'system' && (
                                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                                    <Info className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-bold text-stone-900 text-xs truncate">
                                    {notif.title}
                                  </p>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug line-clamp-2">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer link to Logistics calculator */}
                      <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                        <button
                          onClick={() => {
                            setShowNotificationPanel(false);
                            setShowFreightModal(true);
                          }}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Simular Frete & Frota Munck</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>

          {/* Subheader: Category Navigation Bar */}
          <nav className="mt-2 pt-2 border-t border-slate-100 hidden md:flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setActiveView('ecommerce');
                }}
                className={`font-semibold transition-colors hover:text-amber-600 cursor-pointer ${
                  activeView === 'ecommerce' && !searchQuery ? 'text-amber-600 font-bold' : ''
                }`}
              >
                Todos os Departamentos
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('estrutura-alvenaria');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Estrutura & Alvenaria
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('hidraulica-encanamento');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Hidráulica
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('eletrica-iluminacao');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Elétrica
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('acabamento-pisos-revestimentos');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Pisos & Acabamentos
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('tintas-quimicos-pintura');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Tintas & Pintura
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('coberturas-telhados-esquadrias');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Coberturas & Esquadrias
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug('ferramentas-equipamentos-epis');
                  setActiveView('category');
                }}
                className="hover:text-amber-600 transition-colors cursor-pointer"
              >
                Ferramentas & EPIs
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-500 shrink-0">
              <button
                onClick={() => setShowFreightModal(true)}
                className="hover:text-amber-600 flex items-center gap-1.5 cursor-pointer font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-colors"
                title="Simular Frete, Frota Munck e Regras de Entrega"
              >
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Frete & Logística</span>
              </button>

              <button
                onClick={() => openInstitutional('fale-conosco')}
                className="hover:text-amber-600 flex items-center gap-1 cursor-pointer font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Televendas Obras</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Endereço da Obra</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{currentAddress.label}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.2 rounded-md">
                      Principal
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 font-medium">
                    {currentAddress.street}, {currentAddress.number} {currentAddress.complement && `(${currentAddress.complement})`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentAddress.neighborhood} · {currentAddress.city}/{currentAddress.state} · CEP {currentAddress.cep}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddressModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Confirmar Endereço
            </button>
          </div>
        </div>
      )}

      {/* Interactive Freight & Logistics Modal */}
      <FreightLogisticsModal
        isOpen={showFreightModal}
        onClose={() => setShowFreightModal(false)}
      />
    </>
  );
};
