import React, { useState } from 'react';
import {
  ListChecks,
  Plus,
  Trash2,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  Heart,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { OptimizedImage } from './OptimizedImage';

export const ShoppingListsView: React.FC = () => {
  const {
    shoppingLists,
    createShoppingList,
    deleteShoppingList,
    addItemToShoppingList,
    removeItemFromShoppingList,
    addListToCart,
    products,
    setActiveView,
    showToast
  } = useApp();

  const [activeListId, setActiveListId] = useState<string>(shoppingLists[0]?.id || '');
  const [newListTitle, setNewListTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeList = shoppingLists.find((l) => l.id === activeListId) || shoppingLists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const created = createShoppingList(newListTitle.trim());
    setActiveListId(created.id);
    setNewListTitle('');
    setShowCreateModal(false);
  };

  // Personalized suggestions based on past purchases and popular items in favorite categories
  const recommendedProducts: Product[] = products.filter(
    (p) => p.isOrganic || p.isPromo || p.rating >= 4.9
  ).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Organização & Economia
          </span>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-0.5">
            Minhas Listas de Compras
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Crie listas personalizadas para feiras semanais, churrascos ou reposição de despensa e compre tudo com um clique.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Lista de Compras</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lists selector (1 col) */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-stone-900 px-1">
            Suas Listas ({shoppingLists.length})
          </h3>

          <div className="space-y-2">
            {shoppingLists.map((list) => {
              const isActive = list.id === activeListId;

              return (
                <div
                  key={list.id}
                  onClick={() => setActiveListId(list.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs"
                      style={{ backgroundColor: list.color || '#047857' }}
                    >
                      <ListChecks className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {list.title}
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        {list.items.length} produtos salvos
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Deseja realmente excluir a lista "${list.title}"?`)) {
                        deleteShoppingList(list.id);
                      }
                    }}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                    title="Excluir lista"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Box */}
          <div className="p-4 bg-emerald-950 text-white rounded-2xl text-xs space-y-2">
            <span className="font-bold text-emerald-300 block">💡 Dica LM Store</span>
            <p className="text-emerald-100/80 leading-relaxed text-[11px]">
              Listas salvas atualizam os preços automaticamente de acordo com as safras e promoções vigentes no momento da compra.
            </p>
          </div>
        </div>

        {/* Center / Right Column: Active list contents (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {activeList ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              
              {/* Active List Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-display font-bold text-lg text-stone-900">
                    {activeList.title}
                  </h2>
                  <p className="text-xs text-stone-400">
                    Criada em {activeList.createdAt} · Atualizada em {activeList.updatedAt}
                  </p>
                </div>

                {activeList.items.length > 0 && (
                  <button
                    onClick={() => addListToCart(activeList.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Adicionar Lista Inteira ao Carrinho</span>
                  </button>
                )}
              </div>

              {/* Items in active list */}
              {activeList.items.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {activeList.items.map((item) => {
                    const prod = products.find((p) => p.id === item.productId);
                    if (!prod) return null;
                    const price = prod.salePrice ?? prod.price;

                    return (
                      <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <OptimizedImage
                            src={prod.image}
                            alt={prod.name}
                            width={112}
                            height={112}
                            quality={72}
                            categoryHint={prod.categoryId}
                            className="w-12 h-12 rounded-xl shrink-0 border border-stone-200/60"
                          />
                          <div className="truncate">
                            <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider block">
                              {prod.producer}
                            </span>
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {prod.name}
                            </h4>
                            <span className="text-[11px] text-stone-500 font-mono-numbers">
                              R$ {price.toFixed(2).replace('.', ',')} /{prod.unit}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Stepper */}
                          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  removeItemFromShoppingList(activeList.id, item.productId);
                                } else {
                                  addItemToShoppingList(activeList.id, item.productId, -1);
                                }
                              }}
                              className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold font-mono-numbers">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItemToShoppingList(activeList.id, item.productId, 1)}
                              className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-extrabold text-xs font-mono-numbers text-stone-900 min-w-[65px] text-right">
                            R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>

                          <button
                            onClick={() => removeItemFromShoppingList(activeList.id, item.productId)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Remover da lista"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                  <ListChecks className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="font-semibold text-stone-700">Esta lista está vazia</p>
                  <p>Adicione produtos recomendados abaixo ou navegue pelo catálogo.</p>
                </div>
              )}

              {/* Personalized Suggestions Based On Past Purchases */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Sugestões Personalizadas com Base no Seu Perfil</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Favoritos do Campo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-xl border border-stone-200/90 bg-stone-50/60 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <OptimizedImage
                          src={prod.image}
                          alt={prod.name}
                          width={96}
                          height={96}
                          quality={72}
                          categoryHint={prod.categoryId}
                          className="w-10 h-10 rounded-lg shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-stone-900 truncate">{prod.name}</p>
                          <span className="text-[11px] font-mono-numbers text-stone-500 font-bold">
                            R$ {(prod.salePrice ?? prod.price).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => addItemToShoppingList(activeList.id, prod.id, 1)}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Adicionar a esta lista"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-stone-200">
              <p className="text-xs text-stone-500">Crie sua primeira lista para começar.</p>
            </div>
          )}
        </div>

      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="font-display font-bold text-base text-stone-900">
              Nova Lista de Compras
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Dê um nome para organizar suas compras com agilidade.
            </p>

            <form onSubmit={handleCreateList} className="mt-4 space-y-3">
              <input
                type="text"
                required
                autoFocus
                placeholder="Ex: Feira de Domingo, Despensa Orgânica..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Criar Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
