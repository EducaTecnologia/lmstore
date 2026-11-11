import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  DollarSign,
  Truck,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Store,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    switchRole,
    activeView,
    setActiveView,
    adminSidebarCollapsed,
    toggleAdminSidebar
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Module items with permissions
  const menuItems = [
    {
      id: 'admin_dashboard',
      label: 'Dashboard Executivo',
      icon: LayoutDashboard,
      allowedRoles: ['admin'],
    },
    {
      id: 'operator_orders',
      label: 'Kanban de Pedidos',
      icon: ShoppingCart,
      allowedRoles: ['admin', 'operator'],
    },
    {
      id: 'stock_management',
      label: 'Estoque & Lotes FEFO',
      icon: Layers,
      allowedRoles: ['admin', 'stock'],
    },
    {
      id: 'finance_dashboard',
      label: 'Financeiro & Conciliação',
      icon: DollarSign,
      allowedRoles: ['admin', 'finance'],
    },
    {
      id: 'delivery_logistics',
      label: 'Logística & Despacho',
      icon: Truck,
      allowedRoles: ['admin', 'delivery'],
    },
    {
      id: 'courier_panel',
      label: 'Painel do Entregador',
      icon: Truck,
      allowedRoles: ['admin', 'courier'],
    },
    {
      id: 'cms_manager',
      label: 'CMS Banners & Home',
      icon: ImageIcon,
      allowedRoles: ['admin'],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(currentUser.role)
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Management Header */}
      <header className="sticky top-0 z-30 bg-emerald-950 text-white px-4 sm:px-6 py-2.5 border-b border-emerald-900 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900 cursor-pointer"
            aria-label="Abrir menu mobile"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Toggle Expand/Collapse Sidebar for Desktop */}
          <button
            onClick={toggleAdminSidebar}
            className="hidden md:flex p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900 cursor-pointer transition-colors"
            title={adminSidebarCollapsed ? 'Expandir Menu' : 'Colapsar Menu'}
            aria-label="Expandir ou Colapsar menu"
          >
            {adminSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-emerald-300" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-emerald-300" />
            )}
          </button>

          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-lg sm:text-xl text-white">
              KM<span className="text-emerald-400">Food</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 ml-1 uppercase tracking-wider hidden sm:inline">
              Gestão
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-emerald-800 text-xs">
            <span className="text-emerald-300">Perfil:</span>
            <span className="bg-emerald-800 text-white font-bold px-2.5 py-0.5 rounded-full capitalize">
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('ecommerce')}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Loja (E-commerce)</span>
          </button>

          <button
            onClick={() => setActiveView('login')}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            title="Alternar Perfil / Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* SIDEBAR NAVIGATION: EXPANDABLE / COLLAPSIBLE */}
        <aside
          className={`fixed md:sticky top-12 left-0 z-20 h-[calc(100vh-3rem)] bg-white border-r border-stone-200 shrink-0 transition-all duration-300 flex flex-col justify-between ${
            adminSidebarCollapsed ? 'md:w-18 p-2.5' : 'md:w-64 p-4'
          } ${
            mobileSidebarOpen
              ? 'translate-x-0 w-64 shadow-2xl p-4'
              : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            {/* Header info inside sidebar */}
            {!adminSidebarCollapsed ? (
              <div className="mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-900 truncate max-w-[170px]">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-400 capitalize">{currentUser.role} · LM Store</p>
                </div>
                <button
                  onClick={toggleAdminSidebar}
                  className="hidden md:flex p-1 text-stone-400 hover:text-stone-700 rounded"
                  title="Colapsar Menu"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4 pb-3 border-b border-stone-100 text-center hidden md:block">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs mx-auto">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}

            {/* Menu Navigation items */}
            <nav className="space-y-1">
              {!adminSidebarCollapsed && (
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Módulos Liberados
                </p>
              )}
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={adminSidebarCollapsed ? item.label : undefined}
                    className={`w-full text-left rounded-xl text-xs flex items-center gap-2.5 font-medium transition-all cursor-pointer ${
                      adminSidebarCollapsed
                        ? 'p-2.5 justify-center'
                        : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 shadow-xs'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                    {!adminSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick RBAC Switcher Footer in Sidebar */}
          <div>
            {!adminSidebarCollapsed ? (
              <div className="pt-4 border-t border-stone-200">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1 mb-2">
                  Trocar Perfil (RBAC)
                </p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {(['admin', 'operator', 'stock', 'finance', 'delivery', 'courier', 'customer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`px-2 py-1 rounded text-left truncate transition-colors cursor-pointer ${
                        currentUser.role === r
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-stone-200 text-center hidden md:block">
                <button
                  onClick={toggleAdminSidebar}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Expandir Menu Completo"
                >
                  <PanelLeftOpen className="w-4 h-4 mx-auto" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
};
