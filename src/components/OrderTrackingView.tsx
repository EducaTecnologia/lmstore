import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Navigation,
  Send,
  AlertCircle,
  FileText,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderTrackingView: React.FC = () => {
  const {
    activeOrder,
    setActiveView,
    chatMessages,
    sendChatMessage,
    updateOrderStatus,
    cancelOrder,
    openReportModal,
    setMapsModalOpen,
    calculateRoute,
    showToast,
    orders
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Desisti da compra');

  // Fallback to latest order if none active
  const order = activeOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="font-display font-bold text-lg text-stone-900">Nenhum pedido encontrado</h2>
        <p className="text-xs text-stone-500 mt-1">Faça um pedido no e-commerce para acompanhar sua entrega aqui.</p>
        <button
          onClick={() => setActiveView('ecommerce')}
          className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-amber-500/20"
        >
          Ir às Compras
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput, order.id);
    setMessageInput('');
  };

  const handleExportOrderPdf = () => {
    openReportModal(
      `Comprovante Oficial de Compra - Pedido #${order.code}`,
      `Nota e romaneio de entrega LM Store com autenticação fiscal, especificação de materiais e frota munck.`,
      'customer',
      {
        metrics: [
          { label: 'Valor Total', value: `R$ ${order.total.toFixed(2).replace('.', ',')}` },
          { label: 'Forma de Pagamento', value: order.paymentMethod.toUpperCase() },
          { label: 'Status da Entrega', value: order.status.toUpperCase() },
          { label: 'Distância do Hub', value: `${order.distanceKm} km` },
        ],
        headers: ['Produto / Material', 'Qtd', 'Preço Unitário', 'Lote / NF', 'Total Item'],
        items: order.items.map((i) => [
          i.productName,
          `${i.quantity}x`,
          `R$ ${i.unitPrice.toFixed(2).replace('.', ',')}`,
          i.lotNumber || 'LT-OBRA',
          `R$ ${i.total.toFixed(2).replace('.', ',')}`,
        ]),
        summary: `Entrega destinada ao canteiro de obras de ${order.customerName} em ${order.address.street}, ${order.address.number} - ${order.address.neighborhood}, ${order.address.city}/${order.address.state}. Compra com garantia de qualidade LM Store e normas ABNT.`,
      }
    );
  };

  const handleTraceRoute = () => {
    calculateRoute(`${order.address.street}, ${order.address.number} - ${order.address.neighborhood}, ${order.address.city}`);
    setMapsModalOpen(true);
  };

  const handleConfirmCancelOrder = () => {
    cancelOrder(order.id, cancelReason);
    setCancelModalOpen(false);
  };

  const steps = [
    { key: 'novo', label: 'Pedido Recebido', icon: Package },
    { key: 'pago', label: 'Pagamento Aprovado', icon: CheckCircle2 },
    { key: 'separacao', label: 'Separação FEFO', icon: Clock },
    { key: 'em_entrega', label: 'Saiu para Entrega', icon: Truck },
    { key: 'entregue', label: 'Entregue', icon: ShieldCheck },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'novo') return 0;
    if (status === 'pago') return 1;
    if (status === 'separacao') return 2;
    if (status === 'em_entrega') return 3;
    if (status === 'entregue') return 4;
    return 0;
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <button
          onClick={() => setActiveView('ecommerce')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-600 font-medium cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar à Loja</span>
        </button>

        <div className="text-center sm:text-left">
          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">
            Acompanhamento em Tempo Real
          </span>
          <h1 className="font-display font-extrabold text-lg sm:text-xl text-stone-900">
            Pedido #{order.code}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportOrderPdf}
            className="px-3 py-1.5 rounded-full bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Salvar comprovante em PDF"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Comprovante PDF</span>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-slate-900 border border-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Chat</span>
          </button>

          {order.status !== 'entregue' && order.status !== 'cancelado' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer"
              title="Cancelar Pedido"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Status & Map Simulation (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Banner */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
                  Previsão de Chegada no Canteiro
                </span>
                <p className="text-2xl font-extrabold font-mono-numbers mt-0.5">
                  {order.status === 'entregue' ? 'Entregue com sucesso!' : `${order.estimatedDeliveryMinutes} minutos`}
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/40 uppercase">
                {order.status.replace('_', ' ')}
              </span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-5 gap-1 pt-2">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = st.icon;

                return (
                  <div key={st.key} className="text-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800 text-slate-400 opacity-60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] mt-1.5 block leading-tight font-medium ${
                        isCurrent
                          ? 'text-amber-400 font-bold'
                          : isPassed
                          ? 'text-amber-200'
                          : 'text-stone-500'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Google Maps Route Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <h3 className="font-display font-bold text-sm text-stone-900">
                  Roteamento & Localização do Caminhão
                </h3>
              </div>
              <button
                onClick={handleTraceRoute}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1 border border-amber-200 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>Ver Rota Detalhada</span>
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Origem:</span>
                <span className="font-semibold text-stone-800">Centro de Distribuição LM Store (São Paulo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Destino:</span>
                <span className="font-semibold text-stone-800">
                  {order.address.street}, {order.address.number} - {order.address.neighborhood}
                </span>
              </div>
              <div className="flex justify-between font-mono-numbers">
                <span className="text-stone-500">Distância / Trânsito:</span>
                <span className="font-bold text-amber-800">{order.distanceKm} km · Tráfego Moderado</span>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <h3 className="font-display font-bold text-sm text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Histórico do Pedido
            </h3>
            <div className="mt-4 space-y-4">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="font-mono text-[11px] text-stone-400 shrink-0 mt-0.5">
                    {event.timestamp}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <p className="font-semibold text-stone-900">{event.label}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar: Order Summary & Integrated Chat (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <h3 className="font-display font-bold text-sm text-stone-900 pb-3 border-b border-stone-100">
              Materiais do Pedido ({order.items.length})
            </h3>
            <div className="mt-3 divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-stone-900 truncate">{item.productName}</p>
                      <span className="text-[10px] text-stone-400 block font-mono-numbers">
                        {item.quantity}x R$ {item.unitPrice.toFixed(2).replace('.', ',')} · Lote: {item.lotNumber}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 font-mono-numbers shrink-0 ml-2">
                    R$ {item.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono-numbers">R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Desconto:</span>
                  <span className="font-mono-numbers">- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete:</span>
                <span className="font-mono-numbers">R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Pago:</span>
                <span className="font-mono-numbers">R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Integrated Real-Time Support Chat */}
          {showChat && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-display font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  Chat com Operador do Pedido
                </h4>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Fechar
                </button>
              </div>

              <div className="h-44 overflow-y-auto space-y-2 text-xs p-1">
                {chatMessages
                  .filter((m) => !m.orderId || m.orderId === order.id)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl max-w-[85%] ${
                        msg.sender === 'customer'
                          ? 'ml-auto bg-amber-500 text-slate-950 font-medium'
                          : 'mr-auto bg-stone-100 text-stone-800'
                      }`}
                    >
                      <p className="text-[10px] font-bold opacity-75">{msg.senderName}</p>
                      <p className="mt-0.5">{msg.text}</p>
                    </div>
                  ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal with Confirmation */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Confirmar Cancelamento do Pedido?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Esta ação cancelará o pedido <strong>#{order.code}</strong> e iniciará o estorno automático via gateway.
              </p>
            </div>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-left"
            >
              <option value="Desisti da compra">Desisti da compra</option>
              <option value="Tempo de entrega estimado alto">Tempo de entrega alto</option>
              <option value="Endereço de entrega incorreto">Endereço de entrega incorreto</option>
              <option value="Desejo trocar os produtos">Desejo trocar os produtos</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
