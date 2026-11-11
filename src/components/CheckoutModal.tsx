import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Copy,
  ChevronRight,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const {
    cartTotal,
    cartDeliveryFee,
    currentAddress,
    createOrder,
    setActiveView,
    showToast,
    isLoggedIn,
    setPostLoginRedirect,
    t
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryWindow, setDeliveryWindow] = useState<'express' | 'scheduled'>('express');
  const [scheduledTime, setScheduledTime] = useState('08:00 - 12:00 (Manhã)');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'money'>('pix');
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit Card fields (Pre-filled with Paulo Silva)
  const [cardHolder, setCardHolder] = useState('Paulo Roberto Silva');
  const [cardNumber, setCardNumber] = useState('5428 •••• •••• 9124');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('618');
  const [installments, setInstallments] = useState(1);
  const [moneyChange, setMoneyChange] = useState('');

  // If user somehow accesses checkout without being logged in, redirect to login
  if (!isLoggedIn) {
    setPostLoginRedirect('checkout');
    setActiveView('login');
    return null;
  }

  const pixPayload = `00020126580014BR.GOV.BCB.PIX0136pix@lmstore.com.br520400005303986540${cartTotal.toFixed(2)}5802BR5920LM STORE MATERIAIS6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    showToast('Código Pix Copia e Cola copiado com sucesso!');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleFinishOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      createOrder({
        paymentMethod,
        address: currentAddress,
        notes: orderNotes,
      });
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <button
          onClick={() => (step > 1 ? setStep((s) => (s - 1) as any) : setActiveView('cart'))}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-600 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step > 1 ? 'Etapa Anterior' : 'Voltar ao Carrinho'}</span>
        </button>

        <h1 className="font-display font-extrabold text-xl text-stone-900">
          Finalização do Pedido
        </h1>

        <div className="flex items-center gap-1.5 text-xs font-mono-numbers text-stone-500">
          <span>{step} / 3</span>
        </div>
      </div>

      {/* Progressive Stepper Indicator */}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-stone-200 text-stone-600'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-stone-800">Endereço da Obra</span>
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-amber-500' : 'bg-stone-200'}`} />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-stone-200 text-stone-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-stone-800">Agendamento & Frota</span>
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-amber-500' : 'bg-stone-200'}`} />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-stone-200 text-stone-600'
              }`}
            >
              3
            </span>
            <span className="text-xs font-semibold text-stone-800">Pagamento / Faturamento</span>
          </div>
        </div>
      </div>

      {/* STEP 1: ENDEREÇO */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <MapPin className="w-5 h-5 text-amber-600" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Endereço de Entrega no Canteiro
            </h3>
          </div>

          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-900">{currentAddress.label}</span>
              <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded">
                Raio de Entrega Munck Homologado
              </span>
            </div>
            <p className="text-sm font-semibold text-stone-800 mt-1">
              {currentAddress.street}, {currentAddress.number} {currentAddress.complement}
            </p>
            <p className="text-xs text-stone-500">
              {currentAddress.neighborhood} · {currentAddress.city} - {currentAddress.state} · CEP {currentAddress.cep}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Observações para o descarregamento da carga
            </label>
            <input
              type="text"
              placeholder="Ex: Deixar paletes de cimento na garagem coberta, fiação elétrica alta na rua..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Avançar para Agendamento</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: HORÁRIO DE ENTREGA */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Selecione o Tipo de Envio
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setDeliveryWindow('express')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                deliveryWindow === 'express'
                  ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Entrega Prioritária
                </span>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-1.5 py-0.5 rounded">
                  Hoje (3 a 5h)
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Carregamento prioritário no Centro de Distribuição LM Store e descarregamento no canteiro.
              </p>
              <p className="text-xs font-bold text-amber-900 mt-2 font-mono-numbers">
                {cartDeliveryFee === 0 ? 'Grátis' : `R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`}
              </p>
            </div>

            <div
              onClick={() => setDeliveryWindow('scheduled')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                deliveryWindow === 'scheduled'
                  ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Janela Programada
                </span>
                <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-1.5 py-0.5 rounded">
                  Amanhã
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Escolha a melhor janela com a presença do seu mestre de obras.
              </p>
              <select
                disabled={deliveryWindow !== 'scheduled'}
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="mt-2 w-full bg-white border border-stone-200 rounded-lg p-1.5 text-xs text-stone-800"
              >
                <option value="08:00 - 12:00 (Manhã)">08:00 - 12:00 (Manhã)</option>
                <option value="13:00 - 17:00 (Tarde)">13:00 - 17:00 (Tarde)</option>
                <option value="Primeira Carga (07:00)">Primeira Carga (07:00)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Avançar para Pagamento</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: FORMA DE PAGAMENTO */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-display font-bold text-base text-stone-900">
                Forma de Pagamento
              </h3>
            </div>
            <span className="text-base font-extrabold text-stone-950 font-mono-numbers">
              R$ {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`py-2.5 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'pix'
                  ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              <span className="text-xs">Pix (5% OFF)</span>
            </button>

            <button
              onClick={() => setPaymentMethod('credit_card')}
              className={`py-2.5 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'credit_card'
                  ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span className="text-xs">Cartão de Crédito</span>
            </button>

            <button
              onClick={() => setPaymentMethod('money')}
              className={`py-2.5 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'money'
                  ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Banknote className="w-4 h-4 text-amber-600" />
              <span className="text-xs">Faturado PJ / Entrega</span>
            </button>
          </div>

          {/* METHOD 1: PIX */}
          {paymentMethod === 'pix' && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-xl shadow-xs border border-stone-200">
                {/* Simulated QR Code */}
                <div className="w-36 h-36 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center text-white text-[10px]">
                  <QrCode className="w-20 h-20 text-amber-400" />
                  <span className="mt-1 font-mono text-[9px] text-amber-300">PIX BACEN LM STORE</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-900">
                  Pagamento Instantâneo via Pix
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Abra o app do seu banco, escaneie o QR Code acima ou utilize o código Copia e Cola.
                </p>
              </div>

              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  readOnly
                  value={pixPayload}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-mono text-stone-600 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* METHOD 2: CARTÃO */}
          {paymentMethod === 'credit_card' && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Número do Cartão</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Validade</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Parcelamento</label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                >
                  <option value={1}>1x de R$ {cartTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                  <option value={2}>2x de R$ {(cartTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                  <option value={3}>3x de R$ {(cartTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                  <option value={6}>6x de R$ {(cartTotal / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
                  <option value={10}>10x de R$ {(cartTotal / 10).toFixed(2).replace('.', ',')} (sem juros)</option>
                </select>
              </div>
            </div>
          )}

          {/* METHOD 3: DINHEIRO / FATURADO */}
          {paymentMethod === 'money' && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
              <p className="text-stone-700 font-semibold">
                Pagamento no ato da entrega com máquina de cartão ou boleto faturado para pessoa jurídica cadastrada.
              </p>
              <div>
                <label className="block text-stone-600 mb-1">Precisa de troco ou maquininha específica?</label>
                <input
                  type="text"
                  placeholder="Ex: Levar máquina Stone ou troco para R$ 200,00"
                  value={moneyChange}
                  onChange={(e) => setMoneyChange(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleFinishOrder}
            disabled={isProcessing}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {isProcessing ? (
              <span>Processando e Emitindo Pedido...</span>
            ) : (
              <>
                <span>Confirmar Pedido de Materiais</span>
                <span className="font-mono-numbers text-slate-900 font-bold">
                  (R$ {cartTotal.toFixed(2).replace('.', ',')})
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
