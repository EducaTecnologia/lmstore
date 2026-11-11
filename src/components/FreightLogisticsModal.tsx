import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Info,
  Package,
  Wrench,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FreightLogisticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { currentAddress, cartSubtotal, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'calculator' | 'rules' | 'fleet'>('calculator');
  const [cepInput, setCepInput] = useState(currentAddress.cep || '01451-000');
  const [cargoType, setCargoType] = useState<'heavy' | 'medium' | 'light'>('heavy');
  const [selectedFleet, setSelectedFleet] = useState<'munck' | 'vuc' | 'express' | 'pickup'>('munck');
  const [simulated, setSimulated] = useState(true);

  if (!isOpen) return null;

  // Calculation Logic
  const freeShippingThreshold = 250;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cepInput.startsWith('01') || cepInput.startsWith('04');

  const getShippingFee = () => {
    if (selectedFleet === 'pickup') return 0;
    if (isFreeShipping && selectedFleet !== 'express') return 0;
    
    switch (selectedFleet) {
      case 'munck': return 39.90;
      case 'vuc': return 29.90;
      case 'express': return 49.90;
      default: return 29.90;
    }
  };

  const getDeliveryTime = () => {
    switch (selectedFleet) {
      case 'express': return 'Em até 3 horas';
      case 'vuc': return 'Hoje (Janela de 4 horas)';
      case 'munck': return '1 dia útil (com Agendamento no Canteiro)';
      case 'pickup': return 'Pronto para Retirada em 2 horas (Grátis)';
    }
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cepInput || cepInput.length < 8) {
      showToast('Digite um CEP válido com 8 dígitos.', 'warning');
      return;
    }
    setSimulated(true);
    showToast(`Cotação de frete atualizada para o CEP ${cepInput}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-white rounded-full bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md shadow-amber-500/20">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-extrabold block">
                LM Store Logística & Canteiro
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-white">
                Calculadora de Frete & Frota Munck
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pt-1 text-xs">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-2.5 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Simulador por CEP</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-2.5 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'rules'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Regras de Frete Grátis</span>
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`pb-2.5 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'fleet'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Frota de Veículos</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 text-stone-900">

          {/* TAB 1: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-5">
              {/* CEP Input Form */}
              <form onSubmit={handleSimulate} className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Informe o CEP de Entrega do Canteiro:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="01451-000"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
                  >
                    Calcular Frete
                  </button>
                </div>
              </form>

              {/* Cargo Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  1. Selecione o Perfil de Carga dos Materiais:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setCargoType('heavy'); setSelectedFleet('munck'); }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      cargoType === 'heavy'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-stone-900 block">Carga Pesada / Paletes</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">Cimento, Tijolos, Blocos e Vergalhões</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCargoType('medium'); setSelectedFleet('vuc'); }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      cargoType === 'medium'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-stone-900 block">Carga Média / Volumes</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">Porcelanatos, Tubos 6m, Caixas D'água</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCargoType('light'); setSelectedFleet('express'); }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      cargoType === 'light'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-stone-900 block">Carga Leve / Acabamento</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">Fios, Tintas, Fechaduras e Ferramentas</span>
                  </button>
                </div>
              </div>

              {/* Fleet Modal Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  2. Escolha o Veículo e Tipo de Descarregamento:
                </label>
                <div className="space-y-2">
                  {/* Munck */}
                  <div
                    onClick={() => setSelectedFleet('munck')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedFleet === 'munck'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Caminhão Munck com Guindaste Hidráulico</span>
                        <span className="text-[11px] text-stone-500">Descarregamento de paletes de cimento e sacaria direto na obra</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-numbers font-bold text-xs text-slate-950 block">
                        {isFreeShipping ? 'Grátis' : 'R$ 39,90'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">1 dia útil</span>
                    </div>
                  </div>

                  {/* VUC / Toco */}
                  <div
                    onClick={() => setSelectedFleet('vuc')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedFleet === 'vuc'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Caminhão Toco / VUC Urbano</span>
                        <span className="text-[11px] text-stone-500">Para entrega de tintas, porcelanatos e tubulações</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-numbers font-bold text-xs text-slate-950 block">
                        {isFreeShipping ? 'Grátis' : 'R$ 29,90'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Hoje</span>
                    </div>
                  </div>

                  {/* Express Pick-up Vehicle */}
                  <div
                    onClick={() => setSelectedFleet('express')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedFleet === 'express'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Picape Expressa 3 Horas</span>
                        <span className="text-[11px] text-stone-500">Despacho de emergência para reposição imediata de obra</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-numbers font-bold text-xs text-slate-950 block">R$ 49,90</span>
                      <span className="text-[10px] text-amber-800 font-bold">Até 3 horas</span>
                    </div>
                  </div>

                  {/* Pickup at Counter */}
                  <div
                    onClick={() => setSelectedFleet('pickup')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedFleet === 'pickup'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Retirada Expressa no Balcão do CD</span>
                        <span className="text-[11px] text-stone-500">Retire na loja do Jaguaré / SP com doc do mestre de obra</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-emerald-700 block uppercase font-mono-numbers">Grátis</span>
                      <span className="text-[10px] text-stone-500">Em 2 horas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Results Banner */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                    Resumo do Frete Cotado:
                  </span>
                  <p className="font-bold text-sm sm:text-base text-white mt-0.5">
                    {getDeliveryTime()}
                  </p>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Endereço cotado: CEP {cepInput} · Serviço de descarregamento homologado.
                  </p>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 shrink-0">
                  <span className="text-[11px] text-stone-400 block">Valor Final do Frete</span>
                  <span className="text-2xl font-black text-amber-400 font-mono-numbers">
                    {getShippingFee() === 0 ? 'GRÁTIS' : `R$ ${getShippingFee().toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Política Oficial de Frete Grátis LM Store
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  Para garantir agilidade nas obras de nossos clientes, a LM Store oferece políticas de isenção de taxa de entrega para a região metropolitana de São Paulo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-stone-900 block text-sm">1. Isenção por Valor de Compra</span>
                  <p className="text-stone-600 leading-relaxed">
                    Compras a partir de <strong className="text-stone-900">R$ 250,00</strong> contam com frete grátis automático para a Grande São Paulo em frotas convencionais e munck.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-stone-900 block text-sm">2. Descarregamento Munck Incluso</span>
                  <p className="text-stone-600 leading-relaxed">
                    Em pedidos de cimento, blocos e tijolos acima de R$ 800,00, a operação do guindaste hidráulico munck é 100% isenta de cobrança adicional.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-stone-900 block text-sm">3. Condições de Acesso ao Canteiro</span>
                  <p className="text-stone-600 leading-relaxed">
                    O canteiro deve possuir rua transitável para veículos de até 14 toneladas e fiação elétrica suspensa com altura mínima de 4,50 metros.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-stone-900 block text-sm">4. Horários de Entrega e Descarga</span>
                  <p className="text-stone-600 leading-relaxed">
                    Entregas realizadas de segunda a sexta-feira das 07:00 às 18:00 e aos sábados das 08:00 às 13:00 com acompanhamento do mestre de obras.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET */}
          {activeTab === 'fleet' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800">
                <h4 className="font-extrabold text-sm text-amber-400 mb-1 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500" />
                  Frota Própria Homologada LM Store
                </h4>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Contamos com veículos de carga adaptados para descarregamento seguro em canteiros urbanos e grandes edificações.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-stone-900">Caminhão Munck 14T (Guindaste Hidráulico)</h5>
                    <p className="text-stone-600 text-xs mt-0.5">Capacidade de carga: 14.000 kg · Braço estendível até 12 metros</p>
                    <p className="text-[11px] text-stone-500 mt-1">Ideal para paletes de cimento, cal, blocos de concreto e ferragens estruturais.</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-950 font-bold rounded-full text-xs shrink-0">
                    Carga Estrutural
                  </span>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-stone-900">Caminhão Toco / VUC Baú</h5>
                    <p className="text-stone-600 text-xs mt-0.5">Capacidade de carga: 6.000 kg · Acesso livre em ZMRU (São Paulo)</p>
                    <p className="text-[11px] text-stone-500 mt-1">Ideal para caixas de porcelanatos, revestimentos, latas de tinta e tubos PVC de 6 metros.</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-200 text-slate-900 font-bold rounded-full text-xs shrink-0">
                    Carga Média
                  </span>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-stone-900">Picape Expressa 3 Horas</h5>
                    <p className="text-stone-600 text-xs mt-0.5">Capacidade de carga: 800 kg · Saída imediata do CD Jaguaré</p>
                    <p className="text-[11px] text-stone-500 mt-1">Ideal para fiação elétrica, disjuntores, registros de água, fechaduras e ferramentas.</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-full text-xs shrink-0">
                    Expressa 3H
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Entregas rastreadas com frete seguro LM Store
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
