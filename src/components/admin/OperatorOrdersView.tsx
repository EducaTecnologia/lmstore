import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  X,
  Phone,
  User,
  MapPin,
  Check,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OperatorOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, sendChatMessage, cancelOrder, openReportModal, showToast } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [operatorMsg, setOperatorMsg] = useState('');
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Item esgotado no campo');

  const handleExportOperatorPdf = () => {
    openReportModal(
      'Relatório de Operações & Despacho de Pedidos',
      'Auditoria de fluxo operacional, tempos de separação FEFO e tempos de expedição.',
      'operator',
      {
        metrics: [
          { label: 'Pedidos Totais', value: `${orders.length}` },
          { label: 'Em Separação', value: `${orders.filter(o => o.status === 'separacao').length}` },
          { label: 'Em Rota de Entrega', value: `${orders.filter(o => o.status === 'em_entrega').length}` },
          { label: 'Entregues Hoje', value: `${orders.filter(o => o.status === 'entregue').length}` },
        ],
        headers: ['Código', 'Cliente', 'Bairro', 'Status', 'Tempo Est.'],
        items: orders.map((o) => [
          `#${o.code}`,
          o.customerName,
          o.address.neighborhood,
          o.status.toUpperCase(),
          `${o.estimatedDeliveryMinutes} min`,
        ]),
        summary: 'Todas as ordens de colheita e conferência de lote foram atendidas com precisão. O tempo médio entre recebimento e despacho permaneceu inferior a 18 minutos.',
      }
    );
  };

  const columns: { status: OrderStatus; label: string; color: string }[] = [
    { status: 'novo', label: '1. Novo Pedido', color: 'border-blue-400 bg-blue-50/30' },
    { status: 'pago', label: '2. Pago (Aprovado)', color: 'border-emerald-400 bg-emerald-50/30' },
    { status: 'separacao', label: '3. Em Separação FEFO', color: 'border-amber-400 bg-amber-50/30' },
    { status: 'em_entrega', label: '4. Em Rota de Entrega', color: 'border-purple-400 bg-purple-50/30' },
    { status: 'entregue', label: '5. Entregue', color: 'border-stone-400 bg-stone-50/30' },
  ];

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'novo': return 'pago';
      case 'pago': return 'separacao';
      case 'separacao': return 'em_entrega';
      case 'em_entrega': return 'entregue';
      default: return null;
    }
  };

  const handleAdvanceStatus = (order: Order) => {
    const next = getNextStatus(order.status);
    if (next) {
      updateOrderStatus(order.id, next, next === 'em_entrega' ? 'user-courier-1' : undefined);
    }
  };

  const handleSendOperatorChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorMsg.trim() || !selectedOrder) return;
    sendChatMessage(operatorMsg, selectedOrder.id);
    setOperatorMsg('');
    showToast(`Mensagem enviada para ${selectedOrder.customerName}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Painel do Operador
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Fila Operacional de Pedidos (Kanban)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerencie o ciclo de separação, conferência de lotes FEFO e despacho aos entregadores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportOperatorPdf}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Relatório Operacional (PDF)</span>
          </button>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold font-mono-numbers">
            {orders.length} pedidos
          </span>
        </div>
      </div>

      {/* Kanban Board (Horizontal Scrolling on Tablet/Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-2xl border-t-4 ${col.color} bg-white p-3.5 border border-stone-200 shadow-xs flex flex-col min-h-[460px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-100">
                <span className="font-display font-bold text-xs text-stone-900">{col.label}</span>
                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono-numbers">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                {colOrders.map((order) => {
                  const next = getNextStatus(order.status);

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="p-3 bg-stone-50/80 hover:bg-stone-50 border border-stone-200 hover:border-emerald-400 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-emerald-950 font-mono-numbers">
                          #{order.code}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono-numbers">
                          {order.timeline[0]?.timestamp}
                        </span>
                      </div>

                      <p className="font-semibold text-xs text-stone-900 mt-1 truncate">
                        {order.customerName}
                      </p>

                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {order.items.length} itens · <strong className="text-stone-800 font-mono-numbers">R$ {order.total.toFixed(2).replace('.', ',')}</strong>
                      </p>

                      <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-500 font-mono">
                          {order.paymentMethod}
                        </span>

                        {next && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(order);
                            }}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                            title={`Avançar para: ${next}`}
                          >
                            <span>Avançar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colOrders.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-stone-400 border border-dashed border-stone-200 rounded-xl">
                    Sem pedidos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal for Operator */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  Detalhe Operacional
                </span>
                <h3 className="font-display font-extrabold text-base text-stone-900">
                  Pedido #{selectedOrder.code} — {selectedOrder.status.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Customer data */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-bold text-stone-900">{selectedOrder.customerName}</p>
                <p className="text-stone-600">{selectedOrder.customerPhone} · {selectedOrder.customerEmail}</p>
                <p className="text-stone-500 mt-1">
                  Endereço: {selectedOrder.address.street}, {selectedOrder.address.number} ({selectedOrder.address.neighborhood})
                </p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 font-medium mt-1 bg-amber-50 p-1.5 rounded">
                    Obs cliente: {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Items checklist */}
              <div>
                <p className="font-bold text-stone-900 mb-2">Conferência de Separação FEFO</p>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white text-xs">
                      <div>
                        <span className="font-semibold text-stone-900 block">{it.productName}</span>
                        <span className="text-[10px] text-stone-400">
                          {it.quantity} {it.unit} · Lote Atribuído: <strong className="text-emerald-800">{it.lotNumber}</strong>
                        </span>
                      </div>
                      <span className="font-bold font-mono-numbers text-stone-800">
                        R$ {it.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier info */}
              {selectedOrder.courierName && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                  <span className="font-bold block">Entregador Responsável</span>
                  <span>{selectedOrder.courierName} ({selectedOrder.courierPhone})</span>
                </div>
              )}

              {/* Operator Quick Chat Form */}
              <div className="pt-2 border-t border-stone-100">
                <p className="font-bold text-stone-900 mb-1">Mensagem Direta ao Cliente</p>
                <form onSubmit={handleSendOperatorChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Seu pedido de hortifrúti já está pronto e embalado..."
                    value={operatorMsg}
                    onChange={(e) => setOperatorMsg(e.target.value)}
                    className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between gap-2">
              <button
                onClick={() => {
                  setCancelModalOrder(selectedOrder);
                }}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar Pedido
              </button>

              <button
                onClick={() => {
                  handleAdvanceStatus(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Avançar Status do Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-stone-900">
              Confirmar Cancelamento do Pedido #{cancelModalOrder.code}?
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Esta ação estornará os valores ao cliente e liberará os lotes reservados de volta ao estoque.
            </p>
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Motivo do Cancelamento:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="Item esgotado no campo">Item esgotado no campo</option>
                <option value="Solicitação direta do cliente">Solicitação direta do cliente</option>
                <option value="Endereço não localizado">Endereço não localizado pelo entregador</option>
                <option value="Avaria na colheita">Avaria identificada na colheita</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  cancelOrder(cancelModalOrder.id, cancelReason);
                  setCancelModalOrder(null);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
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
