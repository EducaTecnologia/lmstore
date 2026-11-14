import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { OptimizedImage } from '../OptimizedImage';
import { LMStoreLogo } from '../LMStoreLogo';

const CATEGORY_OPTIONS = [
  { id: 'cat-estrutura', name: 'Estrutura e Alvenaria' },
  { id: 'cat-hidraulica', name: 'Hidráulica e Encanamento' },
  { id: 'cat-eletrica', name: 'Elétrica e Iluminação' },
  { id: 'cat-acabamento', name: 'Acabamento, Pisos e Revestimentos' },
  { id: 'cat-tintas', name: 'Tintas, Químicos e Pintura' },
  { id: 'cat-coberturas', name: 'Coberturas, Telhados e Esquadrias' },
  { id: 'cat-ferramentas', name: 'Ferramentas, Equipamentos e EPIs' },
];

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    financialTransactions,
    openReportModal
  } = useApp();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Construction material CRUD states
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Estrutura e Alvenaria');
  const [categoryId, setCategoryId] = useState('cat-estrutura');
  const [subcategory, setSubcategory] = useState('Cimentos e Argamassas');
  const [price, setPrice] = useState(38.90);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [weightValue, setWeightValue] = useState('50kg');
  const [unit, setUnit] = useState<'un' | 'sc' | 'm2' | 'br' | 'cx' | 'rolo'>('un');
  const [stock, setStock] = useState(50);
  const [minStock, setMinStock] = useState(15);
  const [producer, setProducer] = useState('Votoran');
  const [originLocation, setOriginLocation] = useState('Centro Fabril - São Paulo / SP');
  const [description, setDescription] = useState('Material de construção certificado conforme normas ABNT com garantia de fábrica.');
  const [isAbntCertified, setIsAbntCertified] = useState(true);

  const totalRevenue = financialTransactions
    .filter((t) => t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setName('');
    setCategoryName('Estrutura e Alvenaria');
    setCategoryId('cat-estrutura');
    setSubcategory('Cimentos e Argamassas');
    setPrice(38.90);
    setSalePrice(undefined);
    setWeightValue('50kg');
    setUnit('sc');
    setStock(60);
    setMinStock(15);
    setProducer('Votoran');
    setOriginLocation('Centro Logístico LM Store - SP');
    setDescription('Material de construção de alta performance com certificação técnica.');
    setIsAbntCertified(true);
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
    setUnit((p.unit as any) || 'un');
    setStock(p.stock);
    setMinStock(p.minStock);
    setProducer(p.brand || p.producer);
    setOriginLocation(p.originLocation);
    setDescription(p.description);
    setIsAbntCertified(true);
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
        brand: producer || editingProduct.brand,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        weightValue,
        unit: unit as any,
        stock: Number(stock),
        minStock: Number(minStock),
        producer,
        originLocation,
        description,
      });
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        categoryName,
        categoryId,
        subcategory,
        brand: producer || 'LM Store',
        sku: `LM-${Date.now().toString().slice(-6)}`,
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
        isOrganic: isAbntCertified,
        isPerishable: false,
        rating: 5.0,
        reviewsCount: 1,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
        lots: [
          {
            id: `lot-${Date.now()}`,
            lotNumber: `LM-${new Date().getFullYear()}-01`,
            quantity: Number(stock),
            unitCost: Number(price) * 0.65,
            expirationDate: '2030-12-31',
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
      'Relatório Executivo & Desempenho Operacional LM Store',
      'Demonstrativo consolidado de faturamento, pedidos de materiais e governança dos 7 perfis.',
      'admin',
      {
        metrics: [
          { label: 'Faturamento Bruto', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}` },
          { label: 'Total de Pedidos', value: `${orders.length} pedidos` },
          { label: 'Ticket Médio', value: `R$ ${(totalRevenue / Math.max(1, orders.length)).toFixed(2).replace('.', ',')}` },
          { label: 'SKUs Ativos', value: `${products.length} materiais` },
        ],
        headers: ['Código', 'Cliente / Obra', 'Valor Total', 'Método', 'Status'],
        items: orders.map((o) => [
          `#${o.code}`,
          o.customerName,
          `R$ ${o.total.toFixed(2).replace('.', ',')}`,
          o.paymentMethod.toUpperCase(),
          o.status.toUpperCase(),
        ]),
        summary: 'Operação de materiais de construção operando com conformidade nos prazos de separação, conferência de cargas paletizadas e despacho via frota Munck.',
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Brand Executive Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 sm:p-6 rounded-xl border border-slate-800 border-l-4 border-l-amber-500 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="hidden sm:block shrink-0 mt-0.5">
            <LMStoreLogo variant="icon" size="md" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Painel do Administrador Geral · LM Store
            </span>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
              Visão Geral de Materiais & Operações
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Indicadores comerciais, gestão de catálogo técnico e governança dos 7 perfis da loja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportAdminPdf}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={handleOpenNewProduct}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Cadastrar Material</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vendas do Dia</span>
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2 font-mono-numbers">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18.4% vs meta prevista
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pedidos Totais</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2 font-mono-numbers">
            {orders.length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {orders.filter((o) => o.status === 'em_entrega').length} cargas em rota para obra
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2 font-mono-numbers">
            R$ {(totalRevenue / Math.max(1, orders.length)).toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Alta recorrência em obra bruta
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Alertas de Estoque</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockProducts.length > 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2 font-mono-numbers">
            {lowStockProducts.length}
          </p>
          <span className="text-[11px] text-slate-600 font-medium mt-1 block">
            {lowStockProducts.length > 0 ? 'Itens exigem reposição imediata' : 'Todos os lotes operando normais'}
          </span>
        </div>
      </div>

      {/* PRODUCTS CRUD MANAGEMENT TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Gestão do Catálogo LM Store ({products.length} materiais)
            </h3>
            <p className="text-xs text-slate-500">
              Visualizar, editar preços, especificações e gerenciar SKUs da loja.
            </p>
          </div>
          <button
            onClick={handleOpenNewProduct}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo SKU</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3">Departamento</th>
                <th className="py-2.5 px-3">Preço Normal</th>
                <th className="py-2.5 px-3">Preço Oferta</th>
                <th className="py-2.5 px-3">Estoque</th>
                <th className="py-2.5 px-3">Marca / Fabricante</th>
                <th className="py-2.5 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <OptimizedImage
                        src={p.image}
                        alt={p.name}
                        width={80}
                        height={80}
                        quality={70}
                        categoryHint={p.categoryId}
                        className="w-9 h-9 rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-[190px]">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{p.categoryName}</td>
                  <td className="py-2.5 px-3 font-mono-numbers font-semibold text-slate-800">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers text-amber-700 font-bold">
                    {p.salePrice ? `R$ ${p.salePrice.toFixed(2).replace('.', ',')}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers font-medium text-slate-800">
                    {p.stock} {p.unit}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                    {p.brand || p.producer}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar Material"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Material"
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
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingProduct ? 'Editar Material de Construção' : 'Cadastrar Novo Material'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Material</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cimento CP-II F 32 Todas as Obras 50kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departamento</label>
                  <select
                    value={categoryName}
                    onChange={(e) => {
                      const chosen = CATEGORY_OPTIONS.find((c) => c.name === e.target.value);
                      setCategoryName(e.target.value);
                      if (chosen) setCategoryId(chosen.id);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subcategoria</label>
                  <input
                    type="text"
                    required
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preço Normal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preço Oferta (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Opcional"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    required
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Origem / Centro Fabril</label>
                  <input
                    type="text"
                    required
                    value={originLocation}
                    onChange={(e) => setOriginLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Especificação & Descrição</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAbntCertified}
                  onChange={(e) => setIsAbntCertified(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded accent-amber-500"
                />
                <span className="font-semibold text-slate-800">Certificado conforme Normas ABNT / INMETRO</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Salvar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900">
              Confirmar Exclusão do Material?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Esta ação removerá o produto e seus lotes vinculados permanentemente do catálogo. Deseja prosseguir?
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
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
