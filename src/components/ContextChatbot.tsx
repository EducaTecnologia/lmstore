import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingCart,
  Truck,
  HardHat,
  Clock,
  ChevronRight,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Wrench,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContextChatbot: React.FC = () => {
  const {
    botOpen,
    setBotOpen,
    botMessages,
    sendBotMessage,
    currentUser,
    orders,
    cart,
    setActiveView
  } = useApp();

  const [input, setInput] = useState('');
  const [thinkingModeActive, setThinkingModeActive] = useState(false);
  const [openThinkingMsgId, setOpenThinkingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (botOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [botMessages, botOpen]);

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
        <span className="hidden md:inline text-xs font-black pr-1 text-white">Engenharia & Obra</span>
      </button>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendBotMessage(input.trim(), thinkingModeActive);
    setInput('');
  };

  const handleActionClick = (action: string) => {
    if (action === 'track_order') {
      sendBotMessage('Onde está a entrega do meu material?', thinkingModeActive);
    } else if (action === 'calc_concrete') {
      sendBotMessage('Como calculo a quantidade de cimento e areia para uma laje?', thinkingModeActive);
    } else if (action === 'create_list') {
      setActiveView('shopping_lists');
      setBotOpen(false);
    } else if (action === 'calc_route') {
      sendBotMessage('Como funciona a entrega com caminhão munck no canteiro?', thinkingModeActive);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[550px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Bot Header */}
      <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white flex items-center justify-between shadow-xs border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-sm text-white">Assistente Técnico LM Store</h3>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-stone-300">Consultoria técnica para canteiros de obra</p>
          </div>
        </div>

        <button
          onClick={() => setBotOpen(false)}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context Badge Strip & Thinking Mode Switch */}
      <div className="bg-stone-50 px-3.5 py-2 border-b border-stone-200 text-[10px] text-stone-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Carrinho: {cart.length} itens</span>
          <span>·</span>
          <span>Último: #{orders[0]?.code || 'LM-2026'}</span>
        </div>

        {/* Thinking Mode Toggle (gemini-3.1-pro-preview with ThinkingLevel.HIGH) */}
        <button
          onClick={() => setThinkingModeActive(!thinkingModeActive)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer border ${
            thinkingModeActive
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs font-bold'
              : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
          }`}
          title="Ativar modo de raciocínio profundo com gemini-3.1-pro-preview (ThinkingLevel.HIGH)"
        >
          <BrainCircuit className={`w-3 h-3 ${thinkingModeActive ? 'text-amber-700' : 'text-stone-400'}`} />
          <span>Dimensionamento Profundo</span>
          <span className={`w-1.5 h-1.5 rounded-full ${thinkingModeActive ? 'bg-amber-600' : 'bg-stone-400'}`} />
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-stone-50/40">
        {botMessages.map((msg) => {
          const isUser = msg.role === 'user';
          const isThinkingOpen = openThinkingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-br-xs shadow-xs'
                    : 'bg-white text-stone-800 rounded-bl-xs border border-stone-200 shadow-xs'
                }`}
              >
                {/* Model badge if used thinking */}
                {!isUser && msg.modelUsed && (
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-100 text-[10px] text-stone-400">
                    <span className="font-mono text-amber-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {msg.modelUsed}
                    </span>
                  </div>
                )}

                {/* Collapsible Chain of Thought (Thinking Process) */}
                {!isUser && msg.thinkingProcess && msg.thinkingProcess.length > 0 && (
                  <div className="mb-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 p-2.5 text-[11px] text-amber-950">
                    <button
                      onClick={() => setOpenThinkingMsgId(isThinkingOpen ? null : msg.id)}
                      className="w-full flex items-center justify-between font-bold text-amber-900 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-amber-700" />
                        <span>Raciocínio de Engenharia ({msg.thinkingProcess.length} etapas)</span>
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

                <div className="text-stone-800 whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Suggested Fast Actions */}
                {msg.suggestedActions && (
                  <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-stone-200 flex gap-2">
        <input
          type="text"
          placeholder={thinkingModeActive ? "Pergunte com cálculo de engenharia (ex: traço de concreto, m² de piso)..." : "Dúvidas técnicas de materiais, marcas, frete canteiro..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
        />
        <button
          type="submit"
          className="p-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
