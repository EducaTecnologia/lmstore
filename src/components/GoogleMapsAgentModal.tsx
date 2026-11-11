import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Leaf,
  ShieldCheck,
  Search,
  X,
  Truck,
  Building,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GoogleMapsAgentModal: React.FC = () => {
  const {
    mapsModalOpen,
    setMapsModalOpen,
    activeRoute,
    calculateRoute,
    currentAddress
  } = useApp();

  const [destInput, setDestInput] = useState(
    `${currentAddress.street}, ${currentAddress.number} - ${currentAddress.neighborhood}, ${currentAddress.city}`
  );

  if (!mapsModalOpen) return null;

  const handleSearchRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (destInput.trim()) {
      calculateRoute(destInput.trim());
    }
  };

  const partnerHubs = [
    { name: 'Sítio Boa Esperança (Hortifrúti)', city: 'Holambra - SP', dist: '124 km', time: '1h 40m' },
    { name: 'Fazenda Santa Cecília (Cafés Alta Mogiana)', city: 'Franca - SP', dist: '390 km', time: '4h 15m' },
    { name: 'Queijaria Serra da Canastra', city: 'São Roque de Minas - MG', dist: '480 km', time: '5h 30m' },
    { name: 'Hortas Hidropônicas do Mogi', city: 'Mogi das Cruzes - SP', dist: '62 km', time: '55m' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Agente Google Maps & Rotas de Entrega
              </h3>
              <p className="text-[11px] text-stone-500">
                Cálculo de rotas para caminhão toco e munck, trânsito em tempo real e tempo estimado até o canteiro
              </p>
            </div>
          </div>

          <button
            onClick={() => setMapsModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Route Calculation Search */}
        <form onSubmit={handleSearchRoute} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite o endereço da obra (ex: Av. Paulista, 1000)..."
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Calcular Rota
          </button>
        </form>

        {/* Route Details Card */}
        {activeRoute && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Distância Total</span>
                <span className="font-extrabold text-sm text-stone-900 font-mono-numbers">
                  {activeRoute.distanceKm} km
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Tempo Previsto</span>
                <span className="font-extrabold text-sm text-amber-800 font-mono-numbers">
                  {activeRoute.durationMinutes} min
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Trânsito em Tempo Real</span>
                <span className="font-extrabold text-sm text-amber-700 capitalize">
                  {activeRoute.trafficStatus}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Capacidade Carga</span>
                <span className="font-extrabold text-sm text-slate-800 flex items-center justify-center gap-1 font-mono-numbers">
                  Até 14 Toneladas
                </span>
              </div>
            </div>

            {/* Turn by turn directions */}
            <div>
              <p className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>Instruções de Rota para o Motorista:</span>
              </p>
              <div className="space-y-1.5 bg-white p-3 rounded-xl border border-amber-100">
                {activeRoute.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-stone-700">
                    <span className="font-mono text-amber-800 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nearby Distribution Centers & Stock */}
        <div className="mt-5 pt-4 border-t border-stone-200">
          <h4 className="font-display font-bold text-xs text-stone-900 mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-600" />
            <span>Centros de Distribuição e Galpões LM Store Homologados</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {partnerHubs.map((hub, idx) => (
              <div key={idx} className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-900 truncate max-w-[180px]">{hub.name}</p>
                  <p className="text-[10px] text-stone-500">{hub.city}</p>
                </div>
                <div className="text-right text-[11px] font-mono-numbers text-stone-600 shrink-0">
                  <span>{hub.dist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
