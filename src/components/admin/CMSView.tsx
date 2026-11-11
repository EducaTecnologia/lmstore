import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Banner } from '../../types';

export const CMSView: React.FC = () => {
  const { banners, updateBanner, showToast } = useApp();

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [badge, setBadge] = useState('');

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCtaLabel(banner.ctaLabel);
    setBadge(banner.badge || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    updateBanner({
      ...editingBanner,
      title,
      subtitle,
      ctaLabel,
      badge,
    });

    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Gestão de Conteúdo (CMS)
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Banners & Seções da Home
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure campanhas da safra, cupons de boas-vindas e banners rotativos.
          </p>
        </div>
      </div>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-stone-100">
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Ordem: {banner.order}
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs">
              {banner.badge && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {banner.badge}
                </span>
              )}
              <h3 className="font-display font-bold text-sm text-stone-900">{banner.title}</h3>
              <p className="text-stone-500 text-[11px] line-clamp-2">{banner.subtitle}</p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-stone-400 text-[11px]">Botão: {banner.ctaLabel}</span>
                <button
                  onClick={() => handleEdit(banner)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">
                Editar Banner Promocional
              </h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Título do Banner</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Subtítulo Explicativo</label>
                <textarea
                  rows={2}
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    required
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Badge Superior</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="flex-1 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
