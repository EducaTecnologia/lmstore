import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
  FileText,
  AlertTriangle,
  X,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const CourierPanelView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    openReportModal,
    setMapsModalOpen,
    calculateRoute,
    showToast
  } = useApp();

  const [online, setOnline] = useState(true);
  const [incidentModalOrder, setIncidentModalOrder] = useState<Order | null>(null);
  const [incidentReason, setIncidentReason] = useState('Cliente ausente no local');

  // Orders relevant to the courier
  const myDeliveries = orders.filter(
    (o) => o.status === 'em_entrega' || o.status === 'separacao' || o.status === 'entregue'
  );

  const earningsToday = 68.50;
  const deliveriesDone = 4;
  const dailyGoal = 8;
  const progressPercent = Math.min(100, Math.round((deliveriesDone / dailyGoal) * 100));

  const handleAdvanceCourierStatus = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'separacao') {
      updateOrderStatus(orderId, 'em_entrega', 'user-courier-1');
      showToast('Pedido retirado! Você iniciou a rota de entrega.');
    } else if (currentStatus === 'em_entrega') {
      updateOrderStatus(orderId, 'entregue');
      showToast('Entrega confirmada com sucesso! Ganho creditado.');
    }
  };

  const handleOpenIncident = (order: Order) => {
    setIncidentModalOrder(order);
  };

  const handleConfirmIncident = () => {
    if (incidentModalOrder) {
      updateOrderStatus(incidentModalOrder.id, 'separacao');
      showToast(`Ocorrência registrada: "${incidentReason}". Pedido devolvido à central.`, 'warning');
      setIncidentModalOrder(null);
    }
  };

  const handleOpenInAppMaps = (dest: string) => {
    calculateRoute(dest);
    setMapsModalOpen(true);
  };

  const handleExportCourierPdf = () => {
    openReportModal(
      'Extrato Diário de Corridas & Repasses - Entregador Parceiro',
      'Demonstrativo individual de entregas realizadas, quilometragem rodada e créditos acumulados.',
      'courier',
      {
        metrics: [
          { label: 'Corridas Realizadas', value: `${deliveriesDone} entregas` },
          { label: 'Ganhos Acumulados', value: `R$ ${earningsToday.toFixed(2).replace('.', ',')}` },
          { label: 'Média por Corrida', value: `R$ ${(earningsToday / (deliveriesDone || 1)).toFixed(2).replace('.', ',')}` },
          { label: 'Índice de Pontualidade', value: '100%' },
        ],
        headers: ['Código', 'Cliente', 'Bairro', 'Distância', 'Valor Repasse', 'Status'],
        items: myDeliveries.map((d) => [
          `#${d.code}`,
          d.customerName,
          d.address.neighborhood,
          `${d.distanceKm} km`,
          'R$ 14,50',
          d.status.toUpperCase(),
        ]),
        summary: 'Todas as taxas de corrida com repasse semanal programado via chave Pix cadastrada. Bonificação por eco-eficiência e zero avarias aplicada.',
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Courier Top Status Card */}
      <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-sm">
              TS
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Tiago Santos</h2>
              <p className="text-xs text-emerald-300">Honda CG Cargo · Placa BRA-8E92</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCourierPdf}
              className="p-2 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              title="Exportar Extrato PDF"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setOnline(!online);
                showToast(online ? 'Você ficou Offline' : 'Você está Online para novas entregas!');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                online
                  ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-stone-700 text-stone-300'
              }`}
            >
              {online ? 'Online' : 'Pausado'}
            </button>
          </div>
        </div>

        {/* Daily Earnings & Goal */}
        <div className="pt-2 border-t border-emerald-800/60 grid grid-cols-2 gap-3 text-center">
          <div className="bg-emerald-900/60 p-3 rounded-xl">
            <span className="text-[11px] text-emerald-300 block">Ganhos de Hoje</span>
            <span className="font-extrabold text-lg font-mono-numbers text-white">
              R$ {earningsToday.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="bg-emerald-900/60 p-3 rounded-xl">
            <span className="text-[11px] text-emerald-300 block">Meta do Dia</span>
            <span className="font-extrabold text-lg font-mono-numbers text-white">
              {deliveriesDone} / {dailyGoal}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-emerald-300 mb-1">
            <span>Progresso da Meta Diária ({progressPercent}%)</span>
            <span>Faltam {Math.max(0, dailyGoal - deliveriesDone)} entregas p/ bônus R$ 25</span>
          </div>
          <div className="w-full bg-emerald-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-bold text-sm text-stone-900">
            Minhas Entregas ({myDeliveries.length})
          </h3>
          <button
            onClick={handleExportCourierPdf}
            className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Baixar Extrato PDF</span>
          </button>
        </div>

        {myDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-sm font-mono-numbers">
                #{delivery.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                delivery.status === 'entregue'
                  ? 'bg-stone-100 text-stone-600'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {delivery.status.replace('_', ' ')}
              </span>
            </div>

            {/* Destination */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-stone-900">{delivery.customerName}</p>
                <p className="text-stone-600">
                  {delivery.address.street}, {delivery.address.number} {delivery.address.complement}
                </p>
                <p className="text-[11px] text-stone-400">
                  {delivery.address.neighborhood} · {delivery.address.city}
                </p>
              </div>
              <span className="font-mono-numbers font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200 text-[11px]">
                {delivery.distanceKm} km
              </span>
            </div>

            {/* Navigation & Call shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpenInAppMaps(`${delivery.address.street}, ${delivery.address.number} - ${delivery.address.neighborhood}, ${delivery.address.city}`)}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                <span>Google Maps Rota</span>
              </button>

              <a
                href={`tel:${delivery.customerPhone}`}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ligar p/ Cliente</span>
              </a>
            </div>

            {/* Action Workflow Button & Incident */}
            {delivery.status !== 'entregue' && (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleAdvanceCourierStatus(delivery.id, delivery.status)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {delivery.status === 'separacao' && (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Confirmar Retirada no CD Agro</span>
                    </>
                  )}
                  {delivery.status === 'em_entrega' && (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Entrega ao Cliente (R$ 14,50)</span>
                    </>
                  )}
                </button>

                {delivery.status === 'em_entrega' && (
                  <button
                    onClick={() => handleOpenIncident(delivery)}
                    className="w-full py-2 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-xl font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reportar Ocorrência / Recusa</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Incident Modal with Confirmation */}
      {incidentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Registrar Ocorrência
              </h3>
              <button onClick={() => setIncidentModalOrder(null)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Informe o motivo pelo qual a entrega <strong>#{incidentModalOrder.code}</strong> não pôde ser concluída:
            </p>

            <select
              value={incidentReason}
              onChange={(e) => setIncidentReason(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            >
              <option value="Cliente ausente no local">Cliente ausente no local</option>
              <option value="Endereço não localizado / número inexistente">Endereço não localizado</option>
              <option value="Recusa pelo destinatário">Recusa pelo destinatário</option>
              <option value="Problema mecânico com veículo">Problema mecânico com o veículo</option>
              <option value="Condições climáticas adversas">Chuva / tempestade forte</option>
            </select>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIncidentModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmIncident}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirmar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
