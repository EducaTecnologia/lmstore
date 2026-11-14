import React, { useState, useEffect } from 'react';
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
  Truck,
  Calendar,
  CheckCircle2
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
  } = useApp();

  const todayIso = new Date().toISOString().slice(0, 10);
  const tomorrowDateObj = new Date();
  tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
  const tomorrowIso = tomorrowDateObj.toISOString().slice(0, 10);

  const quickDateOptions = Array.from({ length: 5 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    const iso = d.toISOString().slice(0, 10);
    const weekday = idx === 0
      ? 'Hoje'
      : idx === 1
      ? 'Amanhã'
      : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const shortDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { iso, weekday, shortDate };
  });

  const shiftOptions = [
    { id: 'Primeira Carga (07:00 - 09:00)', title: 'Primeira Carga', hours: '07:00 - 09:00', note: 'Ideal para betonagem e equipe cedo' },
    { id: 'Manhã (08:00 - 12:00)', title: 'Turno Manhã', hours: '08:00 - 12:00', note: 'Recebimento padrão em obra' },
    { id: 'Tarde (13:00 - 17:00)', title: 'Turno Tarde', hours: '13:00 - 17:00', note: 'Descarregamento munck vespertino' },
    { id: 'Fim de Tarde (17:00 - 19:00)', title: 'Fim de Tarde', hours: '17:00 - 19:00', note: 'Entrega estendida após expediente' },
  ];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryWindow, setDeliveryWindow] = useState<'scheduled' | 'express'>('scheduled');
  const [scheduledDate, setScheduledDate] = useState<string>(tomorrowIso);
  const [scheduledShift, setScheduledShift] = useState<string>('Manhã (08:00 - 12:00)');
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

  useEffect(() => {
    if (!isLoggedIn) {
      setPostLoginRedirect('checkout');
      setActiveView('login');
    }
  }, [isLoggedIn, setPostLoginRedirect, setActiveView]);

  if (!isLoggedIn) {
    return null;
  }

  const formatBrDate = (isoDate: string) => {
    if (!isoDate || !isoDate.includes('-')) return isoDate;
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const effectiveDateLabel =
    deliveryWindow === 'express'
      ? `Hoje (${formatBrDate(todayIso)})`
      : formatBrDate(scheduledDate);

  const effectiveShiftLabel =
    deliveryWindow === 'express'
      ? 'Entrega Expressa (3 a 5h)'
      : scheduledShift;

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
        scheduledDate: effectiveDateLabel,
        scheduledShift: effectiveShiftLabel,
      });
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <button
          onClick={() => (step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : setActiveView('cart'))}
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

      {/* STEP 2: SELETOR DE DATA E TURNO DE ENTREGA */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Agende Data e Turno na Obra
                </h3>
                <p className="text-[11px] text-stone-500">
                  Garanta a presença do responsável pelo recebimento e descarregamento dos materiais.
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg font-mono-numbers shrink-0">
              {cartDeliveryFee === 0 ? 'Frete Grátis' : `Frete R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`}
            </span>
          </div>

          {/* Delivery Mode Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryWindow('scheduled')}
              className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                deliveryWindow === 'scheduled'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Agendar Data e Turno
                </span>
                <span className="text-[10px] bg-slate-950 text-amber-400 font-bold px-2 py-0.5 rounded">
                  Recomendado
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Escolha o dia exato e o turno em que sua equipe estará no canteiro.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryWindow('express')}
              className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                deliveryWindow === 'express'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Entrega Expressa Hoje
                </span>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-2 py-0.5 rounded">
                  3 a 5 horas
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Carregamento imediato no CD LM Store para entrega ainda hoje.
              </p>
            </button>
          </div>

          {/* Date + Shift Picker when Scheduled */}
          {deliveryWindow === 'scheduled' && (
            <div className="space-y-4 pt-1 animate-in fade-in">
              {/* Date Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>1. Selecione a Data da Entrega:</span>
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value || tomorrowIso)}
                    aria-label="Selecionar data no calendário"
                    className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono-numbers font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {quickDateOptions.map((opt) => {
                    const isSelected = scheduledDate === opt.iso;
                    return (
                      <button
                        key={opt.iso}
                        type="button"
                        onClick={() => setScheduledDate(opt.iso)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-slate-950 text-white shadow-xs'
                            : 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span className={`block text-[10px] uppercase font-bold ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                          {opt.weekday}
                        </span>
                        <span className="block text-xs font-extrabold font-mono-numbers mt-0.5">
                          {opt.shortDate}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Escolha o Turno de Descarregamento:</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {shiftOptions.map((shift) => {
                    const isSelected = scheduledShift === shift.id;
                    return (
                      <button
                        key={shift.id}
                        type="button"
                        onClick={() => setScheduledShift(shift.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-stone-900">{shift.title}</span>
                            <span className="text-[10px] font-mono-numbers font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                              {shift.hours}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1">{shift.note}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Selected Window Live Summary */}
          <div className="p-3 rounded-xl bg-slate-950 text-white flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Programação selecionada:{' '}
                <strong className="text-amber-400">
                  {effectiveDateLabel} · {effectiveShiftLabel}
                </strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
