import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Plus,
  Navigation,
  CheckCircle2,
  Users,
  FileText,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Leaf,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryZone } from '../../types';

export const DeliveryLogisticsView: React.FC = () => {
  const {
    deliveryZones,
    addZone,
    updateZone,
    deleteZone,
    orders,
    updateOrderStatus,
    openReportModal,
    setMapsModalOpen,
    calculateRoute,
    showToast
  } = useApp();

  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [baseFee, setBaseFee] = useState(9.90);
  const [perKmFee, setPerKmFee] = useState(1.50);
  const [minOrder, setMinOrder] = useState(40);
  const [estimatedMinutes, setEstimatedMinutes] = useState(35);
  const [active, setActive] = useState(true);

  const activeDeliveries = orders.filter((o) => o.status === 'em_entrega' || o.status === 'separacao');
  const deliveredToday = orders.filter((o) => o.status === 'entregue').length;

  const handleOpenNewZone = () => {
    setEditingZone(null);
    setName('');
    setRadiusKm(8);
    setBaseFee(8.90);
    setPerKmFee(1.40);
    setMinOrder(35);
    setEstimatedMinutes(30);
    setActive(true);
    setZoneModalOpen(true);
  };

  const handleOpenEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setRadiusKm(zone.radiusKm);
    setBaseFee(zone.baseFee);
    setPerKmFee(zone.perKmFee);
    setMinOrder(zone.minOrder);
    setEstimatedMinutes(zone.estimatedMinutes);
    setActive(zone.active);
    setZoneModalOpen(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingZone) {
      updateZone({
        ...editingZone,
        name: name.trim(),
        radiusKm: Number(radiusKm),
        baseFee: Number(baseFee),
        perKmFee: Number(perKmFee),
        minOrder: Number(minOrder),
        estimatedMinutes: Number(estimatedMinutes),
        active,
      });
    } else {
      addZone({
        name: name.trim(),
        radiusKm: Number(radiusKm),
        baseFee: Number(baseFee),
        perKmFee: Number(perKmFee),
        minOrder: Number(minOrder),
        estimatedMinutes: Number(estimatedMinutes),
        active,
      });
    }

    setZoneModalOpen(false);
  };

  const handleConfirmDeleteZone = () => {
    if (deleteConfirmId) {
      deleteZone(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleZone = (zone: DeliveryZone) => {
    updateZone({ ...zone, active: !zone.active });
  };

  const handleExportLogisticsPdf = () => {
    openReportModal(
      'Relatório de Performance Logística & Despacho Urbano',
      'Auditoria de rotas de entrega, cumprimento de SLAs, cobertura de zonas e cálculo de emissões evitadas.',
      'delivery',
      {
        metrics: [
          { label: 'Zonas Ativas', value: `${deliveryZones.filter(z => z.active).length} zonas` },
          { label: 'Entregas Hoje', value: `${deliveredToday + activeDeliveries.length} rotas` },
          { label: 'Tempo Médio Ciclo', value: '31 min' },
          { label: 'CO2 Evitado (Rotas Eco)', value: '14.2 kg' },
        ],
        headers: ['Zona de Atendimento', 'Raio (km)', 'Taxa Base', 'Taxa/km', 'Pedido Mínimo', 'Prazo Médio', 'Status'],
        items: deliveryZones.map((z) => [
          z.name,
          `${z.radiusKm} km`,
          `R$ ${z.baseFee.toFixed(2).replace('.', ',')}`,
          `R$ ${z.perKmFee.toFixed(2).replace('.', ',')}`,
          `R$ ${z.minOrder.toFixed(2).replace('.', ',')}`,
          `${z.estimatedMinutes} min`,
          z.active ? 'ATIVA' : 'PAUSADA',
        ]),
        summary: 'Todas as rotas de hoje foram otimizadas via Google Maps API com seleção prioritária de veículos elétricos e ciclistas para distâncias até 3.5km, mantendo 98% de pontualidade no prazo estimado.',
      }
    );
  };

  const handleTraceRouteOnMap = (destination: string) => {
    calculateRoute(destination);
    setMapsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Torre de Controle Logístico LM Store
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Zonas de Entrega & Despacho
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configuração de frete dinâmico por distância, raios de cobertura e monitoramento de frota.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenNewZone}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Zona de Frete</span>
          </button>

          <button
            onClick={() => setMapsModalOpen(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-950 rounded-xl text-xs font-semibold border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Google Maps</span>
          </button>

          <button
            onClick={handleExportLogisticsPdf}
            className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Relatório Oficial (PDF)</span>
          </button>
        </div>
      </div>

      {/* Real-time Logistics Fleet Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Entregas em Andamento</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            {activeDeliveries.length} rotas
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            100% monitoradas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Tempo Médio de Ciclo</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            31 min
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Meta: abaixo de 45 min
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Entregadores Ativos</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            6 parceiros
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Motos & e-bikes conectadas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Logística Inteligente LM Store</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2 font-mono-numbers flex items-center gap-1">
            <Leaf className="w-5 h-5 text-emerald-600" />
            -14,2 kg CO2
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Economia de emissões hoje
          </span>
        </div>
      </div>

      {/* Delivery Zones Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
          <span className="font-bold text-stone-900">Zonas de Cobertura Cadastradas ({deliveryZones.length})</span>
          <span className="text-stone-500 text-[11px]">Frete = Taxa Base + (km × Taxa/km)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-100">
            <thead className="bg-stone-50/60 text-stone-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Zona / Região</th>
                <th className="py-3 px-4">Raio Máximo</th>
                <th className="py-3 px-4">Taxa Base</th>
                <th className="py-3 px-4">Adicional / km</th>
                <th className="py-3 px-4">Pedido Mínimo</th>
                <th className="py-3 px-4">Prazo Médio</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {deliveryZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{zone.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono-numbers">{zone.radiusKm} km</td>
                  <td className="py-3 px-4 font-mono-numbers font-semibold">
                    R$ {zone.baseFee.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers">
                    R$ {zone.perKmFee.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers">
                    R$ {zone.minOrder.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-mono-numbers">
                    {zone.estimatedMinutes} min
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleZone(zone)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                        zone.active
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 text-stone-500 border border-stone-300'
                      }`}
                    >
                      {zone.active ? 'Ativa' : 'Pausada'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditZone(zone)}
                        className="p-1.5 text-stone-400 hover:text-emerald-700 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Editar Zona"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(zone.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Excluir Zona"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Orders In Dispatch */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-display font-bold text-sm text-stone-900">
            Entregas em Rota e Separação Ativa ({activeDeliveries.length})
          </h3>
          <span className="text-[11px] text-stone-400">Rastreio Dinâmico com Google Maps</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDeliveries.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 font-mono-numbers text-sm">
                  #{ord.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900">
                  {ord.status.replace('_', ' ')}
                </span>
              </div>

              <p className="font-semibold text-stone-800">{ord.customerName}</p>
              <p className="text-stone-500">
                Destino: {ord.address.street}, {ord.address.number} ({ord.address.neighborhood})
              </p>
              <p className="text-stone-600 font-mono-numbers text-[11px]">
                Distância: {ord.distanceKm} km · Estimativa: {ord.estimatedDeliveryMinutes} min
              </p>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => handleTraceRouteOnMap(`${ord.address.street}, ${ord.address.number} - ${ord.address.neighborhood}, ${ord.address.city}`)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>Traçar Rota no Mapa</span>
                </button>

                {ord.status === 'em_entrega' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'entregue')}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Confirmar Conclusão
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Form Modal */}
      {zoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">
                {editingZone ? 'Editar Zona de Cobertura' : 'Cadastrar Nova Zona de Frete'}
              </h3>
              <button onClick={() => setZoneModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nome da Zona / Região</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Zona Oeste Express (Pinheiros / Butantã)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Raio Máximo (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Prazo Médio (min)</label>
                  <input
                    type="number"
                    required
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Taxa Base (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={baseFee}
                    onChange={(e) => setBaseFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Taxa/km (R$)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={perKmFee}
                    onChange={(e) => setPerKmFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Pedido Mín (R$)</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setZoneModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingZone ? 'Salvar Alterações' : 'Criar Zona de Frete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Confirmar Exclusão de Zona?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Esta ação removerá a zona de cálculo de frete da plataforma.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmDeleteZone}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Excluir Zona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
