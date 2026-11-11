import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  QrCode,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Plus,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialTransaction } from '../../types';

export const FinanceView: React.FC = () => {
  const { financialTransactions, addTransaction, cancelTransaction, openReportModal, showToast } = useApp();

  const [newTxModalOpen, setNewTxModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FinancialTransaction['type']>('receita_venda');
  const [amount, setAmount] = useState<number>(150);
  const [fee, setFee] = useState<number>(1.50);
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('pix');
  const [status, setStatus] = useState<FinancialTransaction['status']>('concluido');

  const totalGrossRevenue = financialTransactions
    .filter((t) => t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGatewayFees = financialTransactions
    .filter((t) => t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.fee, 0);

  const totalCourierPayouts = financialTransactions
    .filter((t) => t.type === 'repasse_entregador')
    .reduce((sum, t) => sum + Math.abs(t.netAmount), 0);

  const netResult = totalGrossRevenue - totalGatewayFees - totalCourierPayouts;

  // Breakdown by payment method
  const pixRevenue = financialTransactions
    .filter((t) => t.paymentMethod === 'pix' && t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const cardRevenue = financialTransactions
    .filter((t) => t.paymentMethod === 'credit_card' && t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const moneyRevenue = financialTransactions
    .filter((t) => t.paymentMethod === 'money' && t.type === 'receita_venda')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMethodRev = (pixRevenue + cardRevenue + moneyRevenue) || 1;
  const pixPct = Math.round((pixRevenue / totalMethodRev) * 100);
  const cardPct = Math.round((cardRevenue / totalMethodRev) * 100);
  const moneyPct = Math.round((moneyRevenue / totalMethodRev) * 100);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Data,Tipo,Descricao,Valor Bruto,Taxa Gateway,Valor Liquido,Metodo,Status\n' +
      financialTransactions
        .map(
          (t) =>
            `${t.id},${t.date},${t.type},"${t.description}",${t.amount},${t.fee},${t.netAmount},${t.paymentMethod},${t.status}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lmstore_relatorio_financeiro_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relatório financeiro CSV exportado com sucesso!');
  };

  const handleExportPDF = () => {
    openReportModal(
      'Demonstrativo Financeiro & Conciliação de Vendas (DRE)',
      'Relatório analítico de faturamento bruto, taxas de liquidação de gateway e repasses logísticos.',
      'finance',
      {
        metrics: [
          { label: 'Receita Operacional Bruta', value: `R$ ${totalGrossRevenue.toFixed(2).replace('.', ',')}` },
          { label: 'Taxas Adquirentes', value: `- R$ ${totalGatewayFees.toFixed(2).replace('.', ',')}` },
          { label: 'Repasses a Entregadores', value: `- R$ ${totalCourierPayouts.toFixed(2).replace('.', ',')}` },
          { label: 'Resultado Operacional Líquido', value: `R$ ${netResult.toFixed(2).replace('.', ',')}` },
        ],
        headers: ['Data', 'Descrição', 'Método', 'Bruto', 'Taxa', 'Líquido', 'Status'],
        items: financialTransactions.map((t) => [
          t.date,
          t.description,
          t.paymentMethod.toUpperCase(),
          `R$ ${t.amount.toFixed(2).replace('.', ',')}`,
          `R$ ${t.fee.toFixed(2).replace('.', ',')}`,
          `R$ ${t.netAmount.toFixed(2).replace('.', ',')}`,
          t.status.toUpperCase(),
        ]),
        summary: `Conciliação realizada com sucesso: Pix responde por ${pixPct}% do faturamento com taxa média de 0,99%. Todos os repasses a entregadores parceiros estão auditados e provisionados.`,
      }
    );
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const netAmount = type === 'repasse_entregador' || type === 'estorno'
      ? -(Math.abs(amount) + fee)
      : amount - fee;

    addTransaction({
      type,
      description: description.trim(),
      amount: Number(amount),
      fee: Number(fee),
      netAmount,
      paymentMethod,
      status,
    });

    setNewTxModalOpen(false);
    setDescription('');
    setAmount(100);
    setFee(1);
    showToast('Novo lançamento financeiro registrado com sucesso!');
  };

  const handleConfirmCancelTransaction = () => {
    if (deleteConfirmId) {
      cancelTransaction(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Lançamento cancelado / estornado no livro financeiro.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Controladoria & Tesouraria LM Store
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Financeiro & Conciliação de Pagamentos
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Conciliação instantânea com webhooks do gateway, taxas contratuais e repasses a entregadores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNewTxModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Lançamento</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Relatório Oficial (PDF)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Receita Bruta Total</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            R$ {totalGrossRevenue.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            100% conciliada
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Taxas de Adquirentes</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            R$ {totalGatewayFees.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            0,99% Pix · 2,99% Cartão
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Repasses Entregadores</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 font-mono-numbers">
            R$ {totalCourierPayouts.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Pago semanalmente via Pix
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Resultado Líquido</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-2 font-mono-numbers">
            R$ {netResult.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Margem líquida de contribuição
          </span>
        </div>
      </div>

      {/* Visual Chart: Payment Methods Distribution & Gateway Reconciliation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Distribuição por Meio de Pagamento & Liquidez
            </h3>
            <span className="text-[11px] text-stone-400 font-mono-numbers">Tempo Real</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  Pix Instantâneo (Liquidação imediata)
                </span>
                <span className="font-mono-numbers font-bold text-stone-900">
                  R$ {pixRevenue.toFixed(2).replace('.', ',')} ({pixPct}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pixPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Cartão de Crédito / Débito (D+1)
                </span>
                <span className="font-mono-numbers font-bold text-stone-900">
                  R$ {cardRevenue.toFixed(2).replace('.', ',')} ({cardPct}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cardPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-amber-600" />
                  Dinheiro na Entrega (Prestação de contas pelo entregador)
                </span>
                <span className="font-mono-numbers font-bold text-stone-900">
                  R$ {moneyRevenue.toFixed(2).replace('.', ',')} ({moneyPct}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${moneyPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DRE Gerencial Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Demonstrativo de Resultado (DRE)
            </h3>

            <div className="mt-4 divide-y divide-stone-100 text-xs">
              <div className="py-2 flex justify-between font-bold text-stone-900">
                <span>(+) RECEITA OPERACIONAL</span>
                <span className="font-mono-numbers">R$ {totalGrossRevenue.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="py-2 flex justify-between text-stone-600">
                <span>(-) Taxas de Gateway</span>
                <span className="font-mono-numbers text-red-600">- R$ {totalGatewayFees.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="py-2 flex justify-between text-stone-600">
                <span>(-) Repasses Logísticos</span>
                <span className="font-mono-numbers text-red-600">- R$ {totalCourierPayouts.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          <div className="py-3 flex justify-between font-extrabold text-sm text-emerald-950 bg-emerald-50/70 p-3 rounded-xl mt-4">
            <span>(=) RESULTADO LÍQUIDO</span>
            <span className="font-mono-numbers">R$ {netResult.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Transactions Audit Log */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-900">
          <span>Livro Diário de Transações Financeiras</span>
          <span className="text-stone-500 font-normal font-mono-numbers">
            {financialTransactions.length} lançamentos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/60 text-stone-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Data / Hora</th>
                <th className="py-2.5 px-4">Descrição</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Método</th>
                <th className="py-2.5 px-4">Bruto</th>
                <th className="py-2.5 px-4">Taxa</th>
                <th className="py-2.5 px-4">Líquido</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {financialTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 text-stone-500 font-mono-numbers text-[11px]">
                    {tx.date}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800">
                    {tx.description}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-stone-600 capitalize">
                    {tx.type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-mono text-stone-600">
                    {tx.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers font-bold text-stone-900">
                    R$ {tx.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers text-stone-500">
                    R$ {tx.fee.toFixed(2).replace('.', ',')}
                  </td>
                  <td className={`py-3 px-4 font-mono-numbers font-bold ${
                    tx.netAmount >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    R$ {tx.netAmount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tx.status === 'concluido'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {tx.status !== 'cancelado' && (
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Cancelar / Estornar lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {newTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">Novo Lançamento Financeiro</h3>
              <button onClick={() => setNewTxModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aporte operacional, ajuste adquirente, estorno..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="receita_venda">Receita de Venda</option>
                    <option value="repasse_entregador">Repasse a Entregador</option>
                    <option value="estorno">Estorno / Reembolso</option>
                    <option value="taxa_gateway">Taxa Operacional</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Meio de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="pix">Pix Instantâneo</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="money">Dinheiro Físico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Valor Bruto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Taxa Estimada (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewTxModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Gravar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Transaction Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Confirmar Estorno / Cancelamento?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Esta ação marcará a transação como estornada e recalculará o resultado líquido do exercício.
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
                onClick={handleConfirmCancelTransaction}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirmar Estorno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
