import React, { useState } from 'react';
import {
  Layers,
  Plus,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  TrendingDown,
  Building,
  Search,
  Filter,
  X,
  FileText,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const StockManagementView: React.FC = () => {
  const { products, addInventoryLot, deleteInventoryLot, openReportModal, showToast } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedProductForLot, setSelectedProductForLot] = useState<Product | null>(null);
  const [deleteLotTarget, setDeleteLotTarget] = useState<{ productId: string; lotId: string; lotNumber: string } | null>(null);

  // New lot intake modal form
  const [lotNumber, setLotNumber] = useState(`LT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [lotQuantity, setLotQuantity] = useState(25);
  const [lotUnitCost, setLotUnitCost] = useState(6.50);
  const [lotExpiration, setLotExpiration] = useState('2026-11-15');
  const [lotSupplier, setLotSupplier] = useState('Cooperativa Agro Familiar');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleOpenLotModal = (product: Product) => {
    setSelectedProductForLot(product);
    setLotNumber(`LT-${new Date().getFullYear()}-${product.sku.slice(0, 4)}-${Math.floor(10 + Math.random() * 90)}`);
  };

  const handleSaveLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForLot) return;

    addInventoryLot(selectedProductForLot.id, {
      lotNumber,
      quantity: Number(lotQuantity),
      unitCost: Number(lotUnitCost),
      expirationDate: lotExpiration,
      supplier: lotSupplier,
    });

    setSelectedProductForLot(null);
  };

  const handleConfirmDeleteLot = () => {
    if (deleteLotTarget) {
      deleteInventoryLot(deleteLotTarget.productId, deleteLotTarget.lotId);
      setDeleteLotTarget(null);
    }
  };

  const handleExportStockPdf = () => {
    const totalPhysicalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const criticalCount = products.filter(p => p.stock <= p.minStock).length;

    openReportModal(
      'Relatório de Posição de Estoque & Validades FEFO',
      'Inventário físico auditado, saldos por SKU e monitoramento de lotes perecíveis.',
      'stock',
      {
        metrics: [
          { label: 'Unidades Físicas', value: `${totalPhysicalUnits} un` },
          { label: 'SKUs Cadastrados', value: `${products.length} itens` },
          { label: 'Abaixo do Mínimo', value: `${criticalCount} SKUs` },
          { label: 'Acurácia FEFO', value: '99.8%' },
        ],
        headers: ['SKU', 'Produto', 'Saldo', 'Lote Ativo', 'Validade', 'Fornecedor'],
        items: products.map((p) => [
          p.sku,
          p.name,
          `${p.stock} ${p.unit}`,
          p.lots[0]?.lotNumber || 'LT-01',
          p.lots[0]?.expirationDate || 'N/A',
          p.lots[0]?.supplier || p.producer,
        ]),
        summary: 'Todas as safras hortifrúti e perecíveis foram rotuladas no recebimento térmico. Não há lotes vencidos presentes no centro de distribuição.',
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Gestão de Estoque Agroecológico
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Controle de Saldo & Lotes FEFO
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Regra FEFO (First Expired, First Out) com alertas automáticos de validade e reposição.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por produto ou categoria..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Products & Lots Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
          <span className="font-bold text-stone-900">
            Catálogo de Estoque Físico ({filteredProducts.length} itens)
          </span>
          <span className="text-stone-500 text-[11px]">
            Clique em "Receber Lote" para dar entrada de nova safra
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-100">
            <thead className="bg-stone-50/60 text-stone-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Produto & Categoria</th>
                <th className="py-3 px-4">Saldo Atual</th>
                <th className="py-3 px-4">Semáforo de Estoque</th>
                <th className="py-3 px-4">Lote Ativo (FEFO)</th>
                <th className="py-3 px-4">Data de Validade</th>
                <th className="py-3 px-4">Fornecedor / Cooperativa</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const activeLot = p.lots[0];
                const isCritical = p.stock <= p.minStock;
                const isExcess = p.stock >= p.maxStock;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{p.name}</p>
                          <span className="text-[10px] text-stone-400">
                            {p.categoryName} · SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono-numbers font-bold text-stone-900">
                      {p.stock} {p.unit}
                    </td>

                    <td className="py-3 px-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Abaixo do Mín ({p.minStock})
                        </span>
                      ) : isExcess ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Excesso (&gt; {p.maxStock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Saldo Ideal
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-700 font-semibold">
                      {activeLot?.lotNumber || 'LT-PADRAO'}
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-mono-numbers">
                      {activeLot ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {activeLot.expirationDate}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td className="py-3 px-4 text-stone-600 truncate max-w-[150px]">
                      {activeLot?.supplier || p.producer}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenLotModal(p)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Receber Lote</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lot Modal */}
      {selectedProductForLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
                  Entrada de Mercadoria FEFO
                </span>
                <h3 className="font-display font-bold text-base text-stone-900">
                  {selectedProductForLot.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductForLot(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLot} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Número do Lote</label>
                <input
                  type="text"
                  required
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Quantidade Recebida ({selectedProductForLot.unit})</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lotQuantity}
                    onChange={(e) => setLotQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={lotUnitCost}
                    onChange={(e) => setLotUnitCost(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Data de Validade (Regra FEFO)</label>
                <input
                  type="date"
                  required
                  value={lotExpiration}
                  onChange={(e) => setLotExpiration(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Fornecedor / Cooperativa</label>
                <input
                  type="text"
                  required
                  value={lotSupplier}
                  onChange={(e) => setLotSupplier(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForLot(null)}
                  className="flex-1 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Confirmar Entrada no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
