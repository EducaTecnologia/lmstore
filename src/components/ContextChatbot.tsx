import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  ShoppingCart,
  HardHat,
  ChevronRight,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Ruler,
  Paintbrush,
  Layers,
  Download,
  ExternalLink,
  Tag,
  Loader2,
  Camera,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type AttachmentSlotLabel =
  | 'Foto do Material / Lista'
  | 'Foto da Sala / Garagem'
  | 'Foto do Piso'
  | 'Foto da Parede'
  | 'Foto da Cor';

interface PendingAttachment {
  id: string;
  dataUrl: string;
  label: AttachmentSlotLabel;
}

export const ContextChatbot: React.FC = () => {
  const {
    botOpen,
    setBotOpen,
    botLoading,
    botMessages,
    sendBotMessage,
    orders,
    cart,
    products,
    openProductDetail,
    addToCart,
    showToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [thinkingModeActive, setThinkingModeActive] = useState(false);
  const [openThinkingMsgId, setOpenThinkingMsgId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [helperMode, setHelperMode] = useState<'none' | 'room' | 'paint'>('none');

  // Structured measurements state for Room/Garage or Wall Paint
  const [roomType, setRoomType] = useState<'Sala' | 'Garagem' | 'Cozinha/Área'>('Sala');
  const [measureWidth, setMeasureWidth] = useState<string>('4.0');
  const [measureLength, setMeasureLength] = useState<string>('5.0');
  const [measureHeight, setMeasureHeight] = useState<string>('2.8');
  const [paintColorName, setPaintColorName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotTargetLabelRef = useRef<AttachmentSlotLabel>('Foto do Material / Lista');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (botOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [botMessages, botOpen, botLoading]);

  if (!botOpen) {
    return (
      <button
        onClick={() => setBotOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 p-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-full shadow-2xl border-2 border-amber-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group"
        title="Assistente Técnico LM Store"
      >
        <div className="relative">
          <HardHat className="w-5 h-5 text-amber-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        </div>
        <span className="hidden md:inline text-xs font-black pr-1 text-white">Engenharia & IA</span>
      </button>
    );
  }

  const triggerFilePicker = (label: AttachmentSlotLabel) => {
    slotTargetLabelRef.current = label;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.slice(0, 3 - attachments.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setAttachments((prev) => [
            ...prev.slice(0, 2),
            {
              id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              dataUrl,
              label: slotTargetLabelRef.current,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAttachmentLabel = (id: string, label: AttachmentSlotLabel) => {
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, label } : a)));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botLoading) return;
    if (!input.trim() && attachments.length === 0 && helperMode === 'none') return;

    let finalMessage = input.trim();
    const measurementsPayload =
      helperMode === 'room'
        ? {
            roomType,
            width: Number(measureWidth) || undefined,
            length: Number(measureLength) || undefined,
          }
        : helperMode === 'paint'
        ? {
            roomType: 'Parede',
            width: Number(measureWidth) || undefined,
            height: Number(measureHeight) || undefined,
            colorName: paintColorName.trim() || undefined,
          }
        : undefined;

    if (!finalMessage) {
      if (helperMode === 'room') {
        finalMessage = `Calcule cimento, argamassa e piso para minha ${roomType} de ${measureWidth}m x ${measureLength}m${
          attachments.some((a) => a.label === 'Foto do Piso')
            ? ' e gere uma imagem de como ficaria com o piso anexado.'
            : '.'
        }`;
      } else if (helperMode === 'paint') {
        finalMessage = `Calcule quantidade de tinta, quantas demãos, tempo de secagem e custo estimado para uma parede de ${measureWidth}m de largura por ${measureHeight}m de altura${
          paintColorName ? ` na cor ${paintColorName}` : ' usando a cor da imagem anexada'
        } e gere a imagem simulada da parede pintada.`;
      } else if (attachments.length > 0) {
        finalMessage =
          'Analise as imagens anexadas e monte a lista de materiais com opções e promoções da LM Store.';
      }
    }

    const payloadImages = attachments.map((a) => ({ dataUrl: a.dataUrl, label: a.label }));
    setInput('');
    setAttachments([]);
    setHelperMode('none');

    await sendBotMessage(finalMessage, {
      forceThinking: thinkingModeActive,
      images: payloadImages,
      measurements: measurementsPayload,
    });
  };

  const handleActionClick = (action: string) => {
    if (action === 'photo_materials') {
      triggerFilePicker('Foto do Material / Lista');
      setInput('Gere a lista de materiais desta foto com opções e promoções.');
    } else if (action === 'room_floor') {
      setHelperMode('room');
    } else if (action === 'wall_paint') {
      setHelperMode('paint');
    } else if (action === 'track_order') {
      sendBotMessage('Onde está a entrega do meu material?', { forceThinking: thinkingModeActive });
    }
  };

  const handleDownloadImage = (dataUrl: string, prefix = 'lm-store-simulacao') => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${prefix}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Imagem baixada com sucesso!', 'success');
  };

  return (
    <div className="fixed bottom-4 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:w-[440px] h-[590px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Hidden multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Bot Header */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white flex items-center justify-between shadow-xs border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <HardHat className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-sm text-white truncate">
                Assistente Técnico LM Store
              </h3>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] text-stone-300 truncate">
              Gemini IA · Orçamentos, Fotos, Pisos & Pintura
            </p>
          </div>
        </div>

        <button
          onClick={() => setBotOpen(false)}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          aria-label="Fechar assistente"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context Badge Strip & Thinking Mode Switch */}
      <div className="bg-stone-50 px-3 py-2 border-b border-stone-200 text-[10px] text-stone-600 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <span>Carrinho: {cart.length} itens</span>
          <span>·</span>
          <span>Último: #{orders[0]?.code || 'LM-2026'}</span>
        </div>

        <button
          type="button"
          onClick={() => setThinkingModeActive(!thinkingModeActive)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer border shrink-0 ${
            thinkingModeActive
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs font-bold'
              : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
          }`}
          title="Ativar modo de raciocínio profundo com Gemini"
        >
          <BrainCircuit className={`w-3 h-3 ${thinkingModeActive ? 'text-amber-700' : 'text-stone-400'}`} />
          <span>Dimensionamento Profundo</span>
          <span className={`w-1.5 h-1.5 rounded-full ${thinkingModeActive ? 'bg-amber-600' : 'bg-stone-400'}`} />
        </button>
      </div>

      {/* Quick Tools Bar */}
      <div className="bg-white px-3 py-1.5 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => triggerFilePicker('Foto do Material / Lista')}
          className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
        >
          <Camera className="w-3 h-3 text-amber-600" />
          <span>Foto de Materiais</span>
        </button>
        <button
          type="button"
          onClick={() => setHelperMode(helperMode === 'room' ? 'none' : 'room')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
            helperMode === 'room'
              ? 'bg-amber-500 text-stone-950'
              : 'bg-stone-100 hover:bg-amber-100 text-stone-800'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Sala/Garagem + Piso</span>
        </button>
        <button
          type="button"
          onClick={() => setHelperMode(helperMode === 'paint' ? 'none' : 'paint')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
            helperMode === 'paint'
              ? 'bg-amber-500 text-stone-950'
              : 'bg-stone-100 hover:bg-amber-100 text-stone-800'
          }`}
        >
          <Paintbrush className="w-3 h-3" />
          <span>Parede & Tinta</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-stone-50/40">
        {botMessages.map((msg) => {
          const isUser = msg.role === 'user';
          const isThinkingOpen = openThinkingMsgId === msg.id;

          const matchedProductsForAll = (msg.materialsList || [])
            .map((item) => products.find((p) => p.id === item.matchedProductId))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[94%] leading-relaxed ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-br-xs shadow-xs'
                    : 'bg-white text-stone-800 rounded-bl-xs border border-stone-200 shadow-xs'
                }`}
              >
                {/* Model badge */}
                {!isUser && msg.modelUsed && (
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-100 text-[10px] text-stone-400">
                    <span className="font-mono text-amber-700 font-bold flex items-center gap-1 truncate">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{msg.modelUsed}</span>
                    </span>
                  </div>
                )}

                {/* User uploaded image attachments */}
                {isUser && msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {msg.attachments.map((att, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-amber-700/20 bg-white">
                        <img
                          src={att.dataUrl}
                          alt={att.label || 'Anexo'}
                          className="w-20 h-20 object-cover"
                        />
                        {att.label && (
                          <span className="block bg-stone-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 text-center truncate max-w-[80px]">
                            {att.label.replace('Foto ', '')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Collapsible Chain of Thought */}
                {!isUser && msg.thinkingProcess && msg.thinkingProcess.length > 0 && (
                  <div className="mb-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 p-2 text-[11px] text-amber-950">
                    <button
                      onClick={() => setOpenThinkingMsgId(isThinkingOpen ? null : msg.id)}
                      className="w-full flex items-center justify-between font-bold text-amber-900 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-amber-700" />
                        <span>Raciocínio Técnico ({msg.thinkingProcess.length} etapas)</span>
                      </span>
                      {isThinkingOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isThinkingOpen && (
                      <ol className="mt-2 space-y-1 list-decimal list-inside text-stone-700 text-[10px] leading-relaxed pt-1 border-t border-amber-200/50">
                        {msg.thinkingProcess.map((step, idx) => (
                          <li key={idx} className="pl-1">
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {/* Text Response */}
                <div className="text-stone-800 whitespace-pre-line text-xs leading-relaxed">
                  {msg.content}
                </div>

                {/* Room / Floor Quantitative Estimate Card */}
                {!isUser && msg.roomEstimate && (
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-900 text-white space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        Dimensionamento do Ambiente
                      </span>
                      <span className="font-mono-numbers font-bold">
                        {msg.roomEstimate.floorAreaM2} m²
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Piso (+10% recorte)</span>
                        <strong className="text-white">{msg.roomEstimate.floorWithMarginM2}</strong>
                      </div>
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Cimento (50kg)</span>
                        <strong className="text-white">{msg.roomEstimate.cementBags}</strong>
                      </div>
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Argamassa (20kg)</span>
                        <strong className="text-white">{msg.roomEstimate.mortarBags}</strong>
                      </div>
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Rejunte</span>
                        <strong className="text-white">{msg.roomEstimate.groutKg}</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                      <span className="text-stone-300">Custo Estimado:</span>
                      <span className="font-black text-amber-400 font-mono-numbers text-xs">
                        R$ {Number(msg.roomEstimate.estimatedCostBRL || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Wall Paint Quantitative Estimate Card */}
                {!isUser && msg.paintEstimate && (
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-900 text-white space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Paintbrush className="w-3.5 h-3.5" />
                        Orçamento Técnico de Pintura
                      </span>
                      <span className="font-mono-numbers font-bold">
                        {msg.paintEstimate.surfaceAreaM2} m²
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Quantidade de Tinta</span>
                        <strong className="text-white">{msg.paintEstimate.litersNeeded} ({msg.paintEstimate.cansRecommended})</strong>
                      </div>
                      <div className="bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Demãos (Mãos)</span>
                        <strong className="text-white">{msg.paintEstimate.coats}</strong>
                      </div>
                      <div className="col-span-2 bg-stone-800/70 p-1.5 rounded-lg">
                        <span className="text-stone-400 block">Tempo de Secagem</span>
                        <strong className="text-white">{msg.paintEstimate.dryingTime}</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                      <span className="text-stone-300">Custo Estimado:</span>
                      <span className="font-black text-amber-400 font-mono-numbers text-xs">
                        R$ {Number(msg.paintEstimate.estimatedCostBRL || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Generated Simulated Image */}
                {!isUser && msg.generatedImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    <div className="relative">
                      <img
                        src={msg.generatedImage}
                        alt="Simulação visual LM Store com Gemini"
                        className="w-full h-44 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-stone-950/80 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full">
                        Simulação Gemini IA
                      </span>
                    </div>
                    <div className="p-2 bg-white flex items-center justify-between border-t border-stone-100">
                      <span className="text-[10px] font-semibold text-stone-600">
                        Prévia do resultado no seu ambiente
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadImage(msg.generatedImage!, 'simulacao-lmstore')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Baixar Foto</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Warning if image generation was skipped/failed */}
                {!isUser && msg.generatedImageWarning && (
                  <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Prévia visual: {msg.generatedImageWarning}</span>
                  </div>
                )}

                {/* Materials List with Real LM Store Links & Promotions */}
                {!isUser && msg.materialsList && msg.materialsList.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-stone-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        Lista de Materiais & Opções LM Store
                      </span>
                      {matchedProductsForAll.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            matchedProductsForAll.forEach((p) => addToCart(p, 1));
                            showToast(`${matchedProductsForAll.length} materiais adicionados ao carrinho!`, 'success');
                          }}
                          className="text-[10px] font-black text-amber-800 hover:text-amber-950 underline cursor-pointer"
                        >
                          + Tudo ao carrinho
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {msg.materialsList.map((item, idx) => {
                        const matched = products.find((p) => p.id === item.matchedProductId);
                        const hasPromo = matched && (matched.isPromo || (matched.salePrice !== undefined && matched.salePrice < matched.price));
                        const finalPrice = matched ? (matched.salePrice ?? matched.price) : null;

                        return (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="font-bold text-stone-900 text-[11px] leading-tight">
                                    {item.name}
                                  </span>
                                  {(item.isPromoOption || hasPromo) && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black">
                                      <Tag className="w-2.5 h-2.5" />
                                      PROMO
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-stone-500 mt-0.5">
                                  Qtd: <strong className="text-stone-800">{item.quantity}</strong> · {item.notes}
                                </p>
                              </div>
                              {finalPrice !== null && (
                                <span className="font-mono-numbers font-black text-stone-900 text-[11px] shrink-0">
                                  R$ {finalPrice.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                            </div>

                            {matched && (
                              <div className="flex items-center gap-1.5 pt-1 border-t border-stone-200/60">
                                <button
                                  type="button"
                                  onClick={() => openProductDetail(matched)}
                                  className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-amber-50 border border-stone-200 text-stone-800 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 text-amber-600" />
                                  <span>Ver Opção / Link</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addToCart(matched, 1)}
                                  className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  <span>Comprar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggested Fast Actions */}
                {msg.suggestedActions && (
                  <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleActionClick(act.action)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-200 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-stone-400 mt-1 px-1 font-mono-numbers">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {botLoading && (
          <div className="flex items-start">
            <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-2 text-xs text-stone-700">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              <span>Gemini calculando materiais e processando anexos...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Expandable Structured Helper Panel: Room/Garage + Floor OR Wall Paint */}
      {helperMode !== 'none' && (
        <div className="p-2.5 bg-amber-50/90 border-t border-amber-200 space-y-2 text-[11px] shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-stone-900 flex items-center gap-1">
              {helperMode === 'room' ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  <span>Medidas da Sala/Garagem & Piso</span>
                </>
              ) : (
                <>
                  <Paintbrush className="w-3.5 h-3.5 text-amber-700" />
                  <span>Medidas da Parede & Cor da Tinta</span>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => setHelperMode('none')}
              className="text-stone-500 hover:text-stone-900 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {helperMode === 'room' ? (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as any)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px] font-semibold"
                >
                  <option value="Sala">Sala</option>
                  <option value="Garagem">Garagem</option>
                  <option value="Cozinha/Área">Cozinha/Área</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  placeholder="Larg (m)"
                  value={measureWidth}
                  onChange={(e) => setMeasureWidth(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px] font-mono-numbers"
                  title="Largura em metros"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  placeholder="Comp (m)"
                  value={measureLength}
                  onChange={(e) => setMeasureLength(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px] font-mono-numbers"
                  title="Comprimento em metros"
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerFilePicker('Foto da Sala / Garagem')}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-amber-300 rounded-lg font-bold text-[10px] text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-amber-600" />
                  <span>+ Foto Sala/Garagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerFilePicker('Foto do Piso')}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-amber-300 rounded-lg font-bold text-[10px] text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-amber-600" />
                  <span>+ Foto do Piso</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  placeholder="Larg (m)"
                  value={measureWidth}
                  onChange={(e) => setMeasureWidth(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px] font-mono-numbers"
                  title="Largura da parede (m)"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  placeholder="Alt (m)"
                  value={measureHeight}
                  onChange={(e) => setMeasureHeight(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px] font-mono-numbers"
                  title="Altura da parede (m)"
                />
                <input
                  type="text"
                  placeholder="Nome da cor"
                  value={paintColorName}
                  onChange={(e) => setPaintColorName(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-[11px]"
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerFilePicker('Foto da Parede')}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-amber-300 rounded-lg font-bold text-[10px] text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-amber-600" />
                  <span>+ Foto da Parede</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerFilePicker('Foto da Cor')}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-amber-300 rounded-lg font-bold text-[10px] text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Paintbrush className="w-3 h-3 text-amber-600" />
                  <span>+ Foto da Cor</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Pending Attachments Strip */}
      {attachments.length > 0 && (
        <div className="px-2.5 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative bg-white border border-stone-300 rounded-xl p-1 flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <img
                src={att.dataUrl}
                alt={att.label}
                className="w-9 h-9 rounded-lg object-cover"
              />
              <select
                value={att.label}
                onChange={(e) => updateAttachmentLabel(att.id, e.target.value as AttachmentSlotLabel)}
                className="text-[10px] font-bold text-stone-800 bg-transparent focus:outline-none max-w-[110px]"
              >
                <option value="Foto do Material / Lista">Material / Lista</option>
                <option value="Foto da Sala / Garagem">Sala / Garagem</option>
                <option value="Foto do Piso">Foto do Piso</option>
                <option value="Foto da Parede">Foto da Parede</option>
                <option value="Foto da Cor">Foto da Cor</option>
              </select>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="p-0.5 text-stone-400 hover:text-red-600 cursor-pointer"
                title="Remover anexo"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => triggerFilePicker('Foto do Material / Lista')}
          disabled={attachments.length >= 3 || botLoading}
          className="p-2 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded-xl transition-colors cursor-pointer disabled:opacity-40 shrink-0"
          title="Anexar foto de material, sala, piso, parede ou cor"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={
            helperMode === 'room'
              ? 'Obs. extras ou clique enviar para calcular sala/piso...'
              : helperMode === 'paint'
              ? 'Obs. extras ou clique enviar para simular pintura...'
              : 'Anexe foto ou pergunte medidas, piso, tinta...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={botLoading}
          className="flex-1 min-w-0 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
        />

        <button
          type="submit"
          disabled={botLoading}
          className="p-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          title="Enviar para IA Gemini"
        >
          {botLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
