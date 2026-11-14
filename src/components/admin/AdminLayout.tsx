import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  DollarSign,
  Truck,
  Image as ImageIcon,
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
import { LMStoreLogo } from '../LMStoreLogo';

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
      label: 'Estoque & Lotes',
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
      label: 'Logística & Frota Munck',
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

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador Geral';
      case 'operator': return 'Operador';
      case 'stock': return 'Estoque';
      case 'finance': return 'Financeiro';
      case 'delivery': return 'Logística';
      case 'courier': return 'Entregador';
      case 'customer': return 'Cliente';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col">
      {/* Top Management Header (LM Store Slate-950 + Amber-500 Brand Palette) */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white px-4 sm:px-6 py-2.5 border-b-2 border-b-amber-500 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            aria-label="Abrir menu mobile"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleAdminSidebar}
            className="hidden md:flex p-1.5 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            title={adminSidebarCollapsed ? 'Expandir Menu' : 'Colapsar Menu'}
            aria-label="Expandir ou Colapsar menu"
          >
            {adminSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-amber-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <div
            onClick={() => setActiveView('admin_dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <LMStoreLogo variant="compact" inverted={true} size="sm" />
            <span className="text-[11px] font-bold text-amber-400 border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline">
              Gestão
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-3 pl-3 border-l border-slate-800 text-xs">
            <span className="text-slate-400">Perfil:</span>
            <span className="bg-slate-800 border border-slate-700 text-amber-400 font-bold px-2.5 py-0.5 rounded-md">
              {getRoleLabel(currentUser.role)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('ecommerce')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Loja</span>
          </button>

          <button
            onClick={() => setActiveView('login')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Alternar Perfil / Sair"
            aria-label="Alternar Perfil ou Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed md:sticky top-[54px] left-0 z-20 h-[calc(100vh-54px)] bg-white border-r border-slate-200 shrink-0 transition-all duration-300 flex flex-col justify-between ${
            adminSidebarCollapsed ? 'md:w-18 p-2.5' : 'md:w-64 p-4'
          } ${
            mobileSidebarOpen
              ? 'translate-x-0 w-64 shadow-2xl p-4'
              : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            {!adminSidebarCollapsed ? (
              <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-amber-700 font-semibold truncate">
                    {getRoleLabel(currentUser.role)} · LM Store
                  </p>
                </div>
                <button
                  onClick={toggleAdminSidebar}
                  className="hidden md:flex p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
                  title="Colapsar Menu"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4 pb-3 border-b border-slate-100 text-center hidden md:block">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs mx-auto">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {!adminSidebarCollapsed && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Módulos da Plataforma
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
                    className={`w-full text-left rounded-lg text-xs flex items-center gap-2.5 font-medium transition-all cursor-pointer ${
                      adminSidebarCollapsed
                        ? 'p-2.5 justify-center'
                        : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-slate-900 text-amber-400 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-amber-50/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {!adminSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick RBAC Switcher Footer */}
          <div>
            {!adminSidebarCollapsed ? (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                  Alternar Perfil (RBAC)
                </p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {(['admin', 'operator', 'stock', 'finance', 'delivery', 'courier', 'customer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`px-2 py-1.5 rounded text-left truncate transition-colors cursor-pointer capitalize ${
                        currentUser.role === r
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 text-center hidden md:block">
                <button
                  onClick={toggleAdminSidebar}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-7 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
