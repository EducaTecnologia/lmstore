import React, { useState, useEffect } from 'react';
import { BellRing, Mail, Bell, CheckCircle2, X, PackageX } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './OptimizedImage';

interface StockAlertModalProps {
  product: Product | null;
  onClose: () => void;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({ product, onClose }) => {
  const { currentUser, subscribeStockAlert, isSubscribedToStockAlert } = useApp();

  const [email, setEmail] = useState(currentUser.email || '');
  const [channel, setChannel] = useState<'both' | 'push' | 'email'>('both');

  useEffect(() => {
    if (currentUser.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser.email]);

  if (!product) return null;

  const alreadySubscribed = isSubscribedToStockAlert(product.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeStockAlert(product, email, channel);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                Monitoramento de Estoque CD
              </span>
              <h3 className="font-display font-extrabold text-base text-slate-950">
                Avise-me quando chegar
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={96}
            height={96}
            quality={75}
            categoryHint={product.categoryId}
            className="w-14 h-14 rounded-xl border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded mb-1">
              <PackageX className="w-3 h-3" />
              Esgotado temporariamente
            </span>
            <p className="text-xs font-bold text-slate-900 line-clamp-2">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Como deseja receber o aviso automático de reposição?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('both')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  channel === 'both'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BellRing className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[11px] block">Push + E-mail</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('push')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  channel === 'push'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[11px] block">Só Push</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  channel === 'email'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Mail className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[11px] block">Só E-mail</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              E-mail para notificação automática
            </label>
            <input
              type="email"
              required
              placeholder="seuemail@obra.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {alreadySubscribed && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Você já possui um alerta ativo. Enviar novamente atualizará sua preferência.</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{alreadySubscribed ? 'Atualizar Aviso' : 'Ativar Aviso'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
