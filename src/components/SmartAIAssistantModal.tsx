import React, { useState } from 'react';
import {
  Sparkles,
  X,
  HardHat,
  ShoppingBag,
  Calculator,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  Building2,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartAIAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { products, addToCart, showToast } = useApp();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState<{
    title: string;
    description: string;
    estimatedCost: string;
    areaOrMetric: string;
    items: string[];
    matchingProductIds: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (customQuery?: string) => {
    setLoading(true);
    const query = (customQuery || prompt || '').toLowerCase();

    setTimeout(() => {
      setLoading(false);

      if (query.includes('piso') || query.includes('porcelanato') || query.includes('revestimento')) {
        setCalculation({
          title: 'Orçamento de Piso & Porcelanato (Área: 40m² + 10% de Perda)',
          description: 'Cálculo de assentamento de porcelanato com argamassa colante AC-III e rejunte fino impermeabilizado de alta resistência.',
          estimatedCost: 'R$ 4.290,00',
          areaOrMetric: '44 m² calculados (com margem de recorte)',
          items: [
            'Porcelanato Esmaltado Retificado 84x84cm Portobello (44 m²)',
            'Argamassa Colante AC-III Branca Quartzolit (9 sacos de 20kg)',
            'Espaçadores e Niveladores de Piso Cortag (1 pacote com 100 peças)',
            'Rejunte Acrílico Impermeável Quartzolit (2 baldes de 1kg)'
          ],
          matchingProductIds: ['prod-mat-16', 'prod-mat-19', 'prod-mat-20', 'prod-mat-2'],
        });
      } else if (query.includes('pintura') || query.includes('tinta') || query.includes('parede')) {
        setCalculation({
          title: 'Orçamento de Pintura Residencial Completa (120m² de Paredes)',
          description: 'Cálculo para 2 a 3 demãos de acabamento fosco aveludado com preparação de fundo preparador e selador acrílico.',
          estimatedCost: 'R$ 1.150,00',
          areaOrMetric: '120 m² de área de pintura (2 demãos)',
          items: [
            'Tinta Acrílica Toque de Seda Fosco Suvinil 18L (1 lata)',
            'Massa Corrida PVA Interior Coral 25kg (1 barrica)',
            'Rolo de Lã Microfibra Antirrespingo Atlas 23cm com Cabo (1 unidade)',
            'Fita Crepe Automotiva e de Pintura Norton 24mm (3 rolos)'
          ],
          matchingProductIds: ['prod-mat-21', 'prod-mat-22', 'prod-mat-24'],
        });
      } else if (query.includes('eletrica') || query.includes('tomada') || query.includes('fio') || query.includes('luz')) {
        setCalculation({
          title: 'Kit de Instalação Elétrica (Quadro Residencial e Circuitos)',
          description: 'Dimensionamento para 4 circuitos de iluminação e tomadas com condutores antichama normatizados pela NBR 5410.',
          estimatedCost: 'R$ 890,00',
          areaOrMetric: 'Apartamento / Casa até 70m²',
          items: [
            'Cabo Flexível 2,5mm² 750V Rolo 100m SIL (2 rolos - Azul e Vermelho)',
            'Disjuntor Bipolar DIN 25A Curva C Steck (2 unidades)',
            'Eletroduto Corrugado Amarelo 3/4" 25mm Rolo 50m Krona (1 rolo)',
            'Lâmpada LED Bulbo 9W Bivolt Ourolux 6500K (10 unidades)'
          ],
          matchingProductIds: ['prod-mat-11', 'prod-mat-12', 'prod-mat-13', 'prod-mat-15'],
        });
      } else {
        // Obra Bruta / Concretagem default
        setCalculation({
          title: 'Cálculo de Alvenaria e Concretagem (Laje / Piso de 25m² e 8cm de Espessura)',
          description: 'Traço estrutural 1:2:3 (cimento, areia, brita) com armadura de aço CA-50 para máxima solidez e conformidade técnica ABNT NBR 6118.',
          estimatedCost: 'R$ 2.480,00',
          areaOrMetric: 'Volume estimado: 2.0 m³ de concreto estrutural',
          items: [
            'Cimento Poty Todas as Obras CP-II-F 32 Votoran 50kg (16 sacos)',
            'Vergalhão CA-50 Nervurado 3/8" (10.0mm) Gerdau Barra 12m (12 barras)',
            'Argamassa Assentamento e Reboco AC-II Quartzolit 20kg (10 sacos)',
            'Impermeabilizante Vedacit Neutrol Balde 18L (1 balde de proteção)'
          ],
          matchingProductIds: ['prod-mat-1', 'prod-mat-3', 'prod-mat-2', 'prod-mat-5'],
        });
      }
    }, 850);
  };

  const handleAddAllToCart = () => {
    if (!calculation) return;
    calculation.matchingProductIds.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) {
        addToCart(prod, 1);
      }
    });
    showToast('Materiais da estimativa adicionados ao carrinho com sucesso!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Calculadora de Materiais LM Store
              </h3>
              <p className="text-[11px] text-stone-500">
                Assistente técnico para dimensionar cimento, porcelanato, tintas e fiação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Query Input */}
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Quanto cimento para laje de 30m², piso para sala de 40m², tinta para 3 quartos..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
            />
            <button
              onClick={() => handleCalculate()}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{loading ? 'Calculando...' : 'Calcular'}</span>
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-stone-400 self-center">Cálculos rápidos:</span>
            <button
              onClick={() => handleCalculate('concreto')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-full cursor-pointer font-medium"
            >
              🧱 Concretagem & Lajes
            </button>
            <button
              onClick={() => handleCalculate('porcelanato')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-full cursor-pointer font-medium"
            >
              ✨ Porcelanato & Argamassa
            </button>
            <button
              onClick={() => handleCalculate('pintura')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-full cursor-pointer font-medium"
            >
              🎨 Pintura & Suvinil
            </button>
            <button
              onClick={() => handleCalculate('eletrica')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-full cursor-pointer font-medium"
            >
              ⚡ Fiação SIL & Disjuntores
            </button>
          </div>
        </div>

        {/* Calculation Result Card */}
        {calculation && (
          <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-amber-600 tracking-wider flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5" />
                  Dimensionamento Técnico da Obra
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-stone-900 mt-0.5">
                  {calculation.title}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                {calculation.areaOrMetric}
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed">
              {calculation.description}
            </p>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <p className="font-bold text-stone-900 mb-2 flex items-center justify-between">
                <span>Lista de Materiais Recomendada:</span>
                <span className="text-xs text-amber-600 font-black">Total Estimado: {calculation.estimatedCost}</span>
              </p>
              <ul className="space-y-1.5 text-stone-700">
                {calculation.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500 font-medium">
                Itens disponíveis com pronta entrega no canteiro de obras.
              </span>
              <button
                onClick={handleAddAllToCart}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-stone-950" />
                <span>Adicionar Materiais ao Carrinho</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
