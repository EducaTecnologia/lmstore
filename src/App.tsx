/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryPageView } from './components/CategoryPageView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { LoginView } from './components/LoginView';
import { UserProfileView } from './components/UserProfileView';
import { InstitutionalView } from './components/InstitutionalView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShoppingListsView } from './components/ShoppingListsView';
import { ContextChatbot } from './components/ContextChatbot';
import { GoogleMapsAgentModal } from './components/GoogleMapsAgentModal';
import { PDFReportModal } from './components/PDFReportModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OperatorOrdersView } from './components/admin/OperatorOrdersView';
import { StockManagementView } from './components/admin/StockManagementView';
import { FinanceView } from './components/admin/FinanceView';
import { DeliveryLogisticsView } from './components/admin/DeliveryLogisticsView';
import { CourierPanelView } from './components/admin/CourierPanelView';
import { CMSView } from './components/admin/CMSView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    currentUser,
    toastMessage,
    searchQuery
  } = useApp();

  // Scroll to top immediately whenever the active screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeView]);

  // Management Views are routed inside AdminLayout
  const isBackofficeView = [
    'admin_dashboard',
    'operator_orders',
    'stock_management',
    'finance_dashboard',
    'delivery_logistics',
    'courier_panel',
    'cms_manager'
  ].includes(activeView);

  if (isBackofficeView) {
    return (
      <AdminLayout>
        {activeView === 'admin_dashboard' && <AdminDashboard />}
        {activeView === 'operator_orders' && <OperatorOrdersView />}
        {activeView === 'stock_management' && <StockManagementView />}
        {activeView === 'finance_dashboard' && <FinanceView />}
        {activeView === 'delivery_logistics' && <DeliveryLogisticsView />}
        {activeView === 'courier_panel' && <CourierPanelView />}
        {activeView === 'cms_manager' && <CMSView />}

        {/* Global Modals for Backoffice */}
        <PDFReportModal />
        <GoogleMapsAgentModal />
        <ContextChatbot />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-5">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        )}
      </AdminLayout>
    );
  }

  // Public / Customer Views
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#142318]">
      {/* Responsive Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'ecommerce' && <HomeView />}
        {activeView === 'category' && <CategoryPageView />}
        {activeView === 'cart' && <CartDrawer />}
        {activeView === 'checkout' && <CheckoutModal />}
        {activeView === 'order_tracking' && <OrderTrackingView />}
        {activeView === 'shopping_lists' && <ShoppingListsView />}
        {activeView === 'login' && <LoginView />}
        {activeView === 'profile' && <UserProfileView />}
        {activeView === 'institutional' && <InstitutionalView />}
      </main>

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal />

      {/* Global Modals for Customer View */}
      <PDFReportModal />
      <GoogleMapsAgentModal />
      <ContextChatbot />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Institutional 4-Column Footer */}
      <Footer />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-5">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
