import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Users,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    financialTransactions,
    setActiveView,
    openReportModal,
    showToast
  } = useApp();

  // Product CRUD states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for Product
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Hortifrúti Fresco');
  const [categoryId, setCategoryId] = useState('cat-hortifruti');
  const [subcategory, setSubcategory] = useState('Frutas & Legumes');
  const [price, setPrice] = useState(12.50);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [weightValue, setWeightValue] = useState('500g');
  const [unit, setUnit] = useState<'un' | 'kg' | 'g'>('un');
  const [stock, setStock] = useState(50);
  const [minStock, setMinStock] = useState(15);
  const [producer, setProducer] = useState('Fazenda Cooperativa Agro');
  const [originLocation, setOriginLocation] = useState('Holambra - SP');
  const [description, setDescription] = useState('Produto agroecológico com procedência e colheita fresca garantida.');
  const [isOrganic, setIsOrganic] = useState(true);

  const totalRevenue = financialTransactions
    .filter((t) => t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setName('');
    setPrice(12.50);
    setSalePrice(undefined);
    setWeightValue('500g');
    setStock(40);
    setMinStock(10);
    setProducer('Cooperativa Terra Nova');
    setOriginLocation('São Paulo - SP');
    setDescription('Produto agro sustentável selecionado.');
    setIsOrganic(true);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryName(p.categoryName);
    setCategoryId(p.categoryId);
    setSubcategory(p.subcategory);
    setPrice(p.price);
    setSalePrice(p.salePrice);
    setWeightValue(p.weightValue);
    setUnit(p.unit as any);
    setStock(p.stock);
    setMinStock(p.minStock);
    setProducer(p.producer);
    setOriginLocation(p.originLocation);
    setDescription(p.description);
    setIsOrganic(!!p.isOrganic);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        categoryName,
        categoryId,
        subcategory,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        weightValue,
        unit: unit as any,
        stock: Number(stock),
        minStock: Number(minStock),
        producer,
        originLocation,
        description,
        isOrganic,
      });
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        categoryName,
        categoryId,
        subcategory,
        brand: producer || 'LM Store',
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        barcode: `7891000${Math.floor(100000 + Math.random() * 900000)}`,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        weightValue,
        unit: unit as any,
        stock: Number(stock),
        minStock: Number(minStock),
        maxStock: Number(stock) * 3,
        producer,
        originLocation,
        description,
        isOrganic,
        isPerishable: true,
        rating: 5.0,
        reviewsCount: 1,
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
        lots: [
          {
            id: `lot-${Date.now()}`,
            lotNumber: `LT-${new Date().getFullYear()}-01`,
            quantity: Number(stock),
            unitCost: Number(price) * 0.45,
            expirationDate: '2026-11-20',
            receivedAt: new Date().toISOString().slice(0, 10),
            supplier: producer,
          },
        ],
      });
    }

    setProductModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleExportAdminPdf = () => {
    openReportModal(
      'Relatório Executivo & Desempenho Operacional',
      'Demonstrativo consolidado de faturamento, pedidos e governança de materiais de construção LM Store.',
      'admin',
      {
        metrics: [
          { label: 'Faturamento Bruto', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}` },
          { label: 'Total de Pedidos', value: `${orders.length} pedidos` },
          { label: 'Ticket Médio', value: `R$ ${(totalRevenue / Math.max(1, orders.length)).toFixed(2).replace('.', ',')}` },
          { label: 'SKUs Ativos', value: `${products.length} itens` },
        ],
        headers: ['Código', 'Cliente', 'Valor Total', 'Método', 'Status'],
        items: orders.map((o) => [
          `#${o.code}`,
          o.customerName,
          `R$ ${o.total.toFixed(2).replace('.', ',')}`,
          o.paymentMethod.toUpperCase(),
          o.status.toUpperCase(),
        ]),
        summary: `A operação atual atingiu conformidade total nos prazos de separação e distribuição. A retenção de clientes orgânicos registrou crescimento expressivo com zero ocorrências de avaria em perecíveis.`,
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Painel Executivo LM Store
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Visão Geral das Operações de Materiais
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Indicadores de faturamento, gestão de produtos e governança dos 7 perfis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportAdminPdf}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Exportar Relatório PDF</span>
          </button>

          <button
            onClick={handleOpenNewProduct}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Produto</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Vendas do Dia</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18.4% vs meta prevista
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Pedidos Totais</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            {orders.length}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {orders.filter((o) => o.status === 'em_entrega').length} pedidos em rota agora
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            R$ {(totalRevenue / Math.max(1, orders.length)).toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Alto engajamento em perecíveis
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Alertas de Estoque</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockProducts.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            {lowStockProducts.length}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            {lowStockProducts.length > 0 ? 'Produtos exigem reposição FEFO' : 'Todos os saldos operando normais'}
          </span>
        </div>
      </div>

      {/* PRODUCTS CRUD MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-display font-bold text-base text-stone-900">
              Gestão de Catálogo de Produtos ({products.length} itens)
            </h3>
            <p className="text-xs text-stone-500">
              Visualizar, editar preços, safras e excluir produtos com confirmação.
            </p>
          </div>
          <button
            onClick={handleOpenNewProduct}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold rounded-xl text-xs border border-emerald-200 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700" />
            <span>Adicionar Novo SKU</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-100">
            <thead className="bg-stone-50/70 text-stone-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Produto</th>
                <th className="py-2.5 px-3">Departamento</th>
                <th className="py-2.5 px-3">Preço Regular</th>
                <th className="py-2.5 px-3">Preço Promo</th>
                <th className="py-2.5 px-3">Saldo</th>
                <th className="py-2.5 px-3">Produtor</th>
                <th className="py-2.5 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-stone-100 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-900 block truncate max-w-[170px]">{p.name}</span>
                        <span className="text-[10px] text-stone-400">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-stone-600">{p.categoryName}</td>
                  <td className="py-2.5 px-3 font-mono-numbers font-semibold">R$ {p.price.toFixed(2).replace('.', ',')}</td>
                  <td className="py-2.5 px-3 font-mono-numbers text-emerald-700 font-bold">
                    {p.salePrice ? `R$ ${p.salePrice.toFixed(2).replace('.', ',')}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers">{p.stock} {p.unit}</td>
                  <td className="py-2.5 px-3 text-stone-500 truncate max-w-[130px]">{p.producer}</td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar Produto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Produto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mandioca Manteiga Descascada 1kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Departamento</label>
                  <select
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      if (e.target.value === 'Hortifrúti Fresco') setCategoryId('cat-hortifruti');
                      if (e.target.value === 'Carnes & Açougue') setCategoryId('cat-carnes');
                      if (e.target.value === 'Grãos & Cereais') setCategoryId('cat-graos');
                    }}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Hortifrúti Fresco">Hortifrúti Fresco</option>
                    <option value="Carnes & Açougue">Carnes & Açougue</option>
                    <option value="Grãos & Cereais">Grãos & Cereais</option>
                    <option value="Café & Cacau">Café & Cacau</option>
                    <option value="Frios & Laticínios">Frios & Laticínios</option>
                    <option value="Produtos de Limpeza">Produtos de Limpeza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Subcategoria</label>
                  <input
                    type="text"
                    required
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Preço Normal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Preço Promo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Opcional"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Produtor / Fazenda</label>
                  <input
                    type="text"
                    required
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Localidade de Origem</label>
                  <input
                    type="text"
                    required
                    value={originLocation}
                    onChange={(e) => setOriginLocation(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Descrição</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded accent-emerald-700"
                />
                <span className="font-semibold text-stone-800">Alimento com Certificação Orgânica</span>
              </label>

              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-stone-900">
              Confirmar Exclusão do Produto?
            </h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Esta ação removerá o produto e seus lotes vinculados permanentemente do catálogo. Deseja prosseguir?
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
