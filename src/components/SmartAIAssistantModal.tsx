import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  HardHat,
  ShoppingCart,
  Calculator,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  Building2,
  Package,
  Paintbrush,
  Camera,
  Download,
  Plus,
  Trash2,
  Wand2,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartAIAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { products, addToCart, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'calculator' | 'wall_color' | '3d_material'>('calculator');

  // Tab 1: Calculator State
  const [prompt, setPrompt] = useState('');
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [calculation, setCalculation] = useState<{
    title: string;
    description: string;
    estimatedCost: string;
    areaOrMetric: string;
    items: string[];
    matchingProductIds: string[];
  } | null>(null);

  // Tab 2: Wall Color Simulator State
  const [wallImageBase64, setWallImageBase64] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string>('Azul Sereno Suvinil');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#38bdf8');
  const [newColorNameInput, setNewColorNameInput] = useState('');
  const [newColorHexInput, setNewColorHexInput] = useState('#f59e0b');
  const [paletteColors, setPaletteColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Branco Neve Suvinil', hex: '#f8fafc' },
    { name: 'Azul Sereno Suvinil', hex: '#38bdf8' },
    { name: 'Cinza Cimento Queimado', hex: '#64748b' },
    { name: 'Terracota Rustico', hex: '#ea580c' },
    { name: 'Verde Alecrim Coral', hex: '#10b981' },
    { name: 'Amarelo Sol Suvinil', hex: '#f59e0b' },
  ]);
  const [recolorLoading, setRecolorLoading] = useState(false);
  const [recolorResultImage, setRecolorResultImage] = useState<string | null>(null);

  // Tab 3: 3D Material Visualizer State
  const [environmentImageBase64, setEnvironmentImageBase64] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Porcelanato Polido 90x90cm Portobello');
  const [customMaterialPrompt, setCustomMaterialPrompt] = useState<string>('');
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateResultImage, setSimulateResultImage] = useState<string | null>(null);

  const wallFileInputRef = useRef<HTMLInputElement>(null);
  const envFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handlers for Tab 1 (Calculator)
  const handleCalculate = (customQuery?: string) => {
    setLoadingCalc(true);
    const query = (customQuery || prompt || '').toLowerCase();

    setTimeout(() => {
      setLoadingCalc(false);

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
    }, 600);
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

  // Handlers for Tab 2 (Wall Color Recolor)
  const handleWallImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setWallImageBase64(base64);
      setRecolorResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddColorToPalette = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorNameInput.trim()) return;
    const newColor = { name: newColorNameInput.trim(), hex: newColorHexInput };
    setPaletteColors((prev) => [...prev, newColor]);
    setSelectedColorName(newColor.name);
    setSelectedColorHex(newColor.hex);
    setNewColorNameInput('');
    showToast(`Cor "${newColor.name}" adicionada à paleta!`, 'success');
  };

  const handleDeleteColorFromPalette = (hexToRemove: string) => {
    setPaletteColors((prev) => prev.filter((c) => c.hex !== hexToRemove));
    showToast('Cor removida da paleta.', 'info');
  };

  const handleRecolorWall = async () => {
    if (!wallImageBase64) {
      showToast('Por favor, carregue uma foto da parede primeiro.', 'warning');
      return;
    }
    setRecolorLoading(true);
    try {
      const res = await fetch('/api/ai/recolor-wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: wallImageBase64,
          colorName: selectedColorName,
          colorHex: selectedColorHex,
        }),
      });
      const data = await res.json();
      setRecolorLoading(false);
      if (!res.ok || data.error) {
        showToast(data.error || 'Erro ao simular pintura com Gemini.', 'warning');
        return;
      }
      if (data.resultImage) {
        setRecolorResultImage(data.resultImage);
        showToast(`Parede repintada com a cor "${selectedColorName}" por Inteligência Artificial!`, 'success');
      }
    } catch {
      setRecolorLoading(false);
      showToast('Erro de comunicação ao simular cor de parede.', 'warning');
    }
  };

  // Handlers for Tab 3 (3D Material Simulation)
  const handleEnvImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEnvironmentImageBase64(base64);
      setSimulateResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateMaterial = async () => {
    if (!environmentImageBase64) {
      showToast('Por favor, envie uma foto do ambiente primeiro.', 'warning');
      return;
    }
    setSimulateLoading(true);
    try {
      const res = await fetch('/api/ai/simulate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: environmentImageBase64,
          materialName: selectedMaterial,
          customPrompt: customMaterialPrompt,
        }),
      });
      const data = await res.json();
      setSimulateLoading(false);
      if (!res.ok || data.error) {
        showToast(data.error || 'Erro ao simular material 3D com Gemini.', 'warning');
        return;
      }
      if (data.resultImage) {
        setSimulateResultImage(data.resultImage);
        showToast(`Simulação 3D com ${selectedMaterial} gerada com sucesso!`, 'success');
      }
    } catch {
      setSimulateLoading(false);
      showToast('Erro de comunicação ao simular ambiente 3D.', 'warning');
    }
  };

  const handleDownloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download da imagem iniciado!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Wand2 className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-1.5">
                <span>Assistente de IA Studio LM Store</span>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">Gemini IA</span>
              </h3>
              <p className="text-xs text-stone-500">
                Simulador visual 3D, repintura de paredes e dimensionamento técnico de materiais
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mt-4 pb-2 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'calculator'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>1. Cálculo de Materiais</span>
          </button>

          <button
            onClick={() => setActiveTab('wall_color')}
            className={`font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'wall_color'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Paintbrush className="w-4 h-4 text-amber-400" />
            <span>2. Simulador de Cores de Parede</span>
          </button>

          <button
            onClick={() => setActiveTab('3d_material')}
            className={`font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === '3d_material'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>3. Simulador 3D de Materiais</span>
          </button>
        </div>

        {/* TAB 1: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Quanto cimento para laje de 30m², piso para sala de 40m², tinta Suvinil para 3 quartos..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                />
                <button
                  onClick={() => handleCalculate()}
                  disabled={loadingCalc}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>{loadingCalc ? 'Calculando...' : 'Calcular'}</span>
                </button>
              </div>

              {/* Quick Suggestions Chips */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-stone-400 self-center font-medium">Cálculos rápidos:</span>
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
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs animate-in fade-in">
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
                    <ShoppingCart className="w-4 h-4 text-stone-950" />
                    <span>Adicionar Materiais ao Carrinho</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WALL COLOR RECOLOR (GEMINI AI) */}
        {activeTab === 'wall_color' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <Paintbrush className="w-4 h-4 text-amber-600" />
                Simulador de Pintura de Parede com Inteligência Artificial
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Tire ou envie uma foto da parede do ambiente e selecione ou adicione cores da paleta para visualizar instantaneamente como ficaria o resultado final repintado.
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={wallFileInputRef}
              accept="image/*"
              onChange={handleWallImageUpload}
              className="hidden"
            />

            {/* Upload & Preview Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Wall Image Box */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800">Foto Original da Parede / Cômodo:</label>
                {wallImageBase64 ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group">
                    <img src={wallImageBase64} alt="Parede Original" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => wallFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Trocar Foto</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => wallFileInputRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center text-stone-500 hover:text-amber-900 transition-all cursor-pointer p-4 text-center"
                  >
                    <Camera className="w-8 h-8 text-amber-600 mb-2" />
                    <span className="font-bold text-stone-800">Tirar Foto ou Carregar Parede</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Formatos JPG, PNG ou WEBP</span>
                  </button>
                )}
              </div>

              {/* Recolored AI Result Box */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800 flex items-center justify-between">
                  <span>Resultado da Repintura com IA:</span>
                  {recolorResultImage && (
                    <button
                      type="button"
                      onClick={() => handleDownloadImage(recolorResultImage, `parede_lmstore_${selectedColorName.replace(/\s+/g, '_')}.jpg`)}
                      className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </label>

                {recolorLoading ? (
                  <div className="w-full aspect-[4/3] rounded-2xl border border-stone-200 bg-stone-900 text-white flex flex-col items-center justify-center p-4 text-center">
                    <Wand2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                    <span className="font-bold text-amber-300">Processando Repintura por IA...</span>
                    <span className="text-[10px] text-stone-300 mt-1">Gerando textura de tinta acrílica Suvinil em tempo real</span>
                  </div>
                ) : recolorResultImage ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-400 bg-stone-100 shadow-md">
                    <img src={recolorResultImage} alt="Resultado Parede Repintada" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[11px] flex items-center justify-between">
                      <span className="font-semibold truncate">{selectedColorName}</span>
                      <span className="w-3 h-3 rounded-full border border-white shrink-0" style={{ backgroundColor: selectedColorHex }} />
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-2xl border border-stone-200 bg-stone-100 text-stone-400 flex flex-col items-center justify-center p-4 text-center">
                    <Palette className="w-8 h-8 text-stone-300 mb-1" />
                    <span>Selecione a cor e clique em "Simular Nova Cor"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Color Palette */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                  <Palette className="w-4 h-4 text-amber-600" />
                  Paleta de Cores e Tintas da Obra:
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  Cor selecionada: <strong className="text-stone-900">{selectedColorName}</strong>
                </span>
              </div>

              {/* Color Palette Chips */}
              <div className="flex flex-wrap gap-2">
                {paletteColors.map((col, idx) => {
                  const isSelected = selectedColorHex === col.hex;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedColorName(col.name);
                        setSelectedColorHex(col.hex);
                      }}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-amber-400 shadow-md scale-105'
                          : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-xs" style={{ backgroundColor: col.hex }} />
                      <span className="font-bold text-[11px]">{col.name}</span>
                      {paletteColors.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteColorFromPalette(col.hex);
                          }}
                          className="text-stone-400 hover:text-red-500 transition-colors p-0.5 ml-1 cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Excluir cor da paleta"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Custom Color Form */}
              <form onSubmit={handleAddColorToPalette} className="pt-2 border-t border-stone-200 flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHexInput}
                  onChange={(e) => setNewColorHexInput(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 p-0 bg-transparent shrink-0"
                  title="Escolher código de cor"
                />
                <input
                  type="text"
                  placeholder="Nome da nova cor (ex: Verde Alecrim Suvinil)..."
                  value={newColorNameInput}
                  onChange={(e) => setNewColorNameInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Cor</span>
                </button>
              </form>
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              onClick={handleRecolorWall}
              disabled={recolorLoading || !wallImageBase64}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Simular Nova Cor na Parede com IA</span>
            </button>
          </div>
        )}

        {/* TAB 3: 3D MATERIAL VISUALIZER (GEMINI AI) */}
        {activeTab === '3d_material' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <Layers className="w-4 h-4 text-amber-600" />
                Simulador 3D de Materiais no Canteiro / Cômodo
              </h4>
              <p className="text-[11px] text-stone-600 mt-1">
                Tire foto do ambiente e selecione qual material de construção (porcelanato, janela, piso vinílico, telhas) deseja inserir para ver como fica antes de comprar.
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={envFileInputRef}
              accept="image/*"
              onChange={handleEnvImageUpload}
              className="hidden"
            />

            {/* Upload & Render Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Environment Box */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800">Foto do Local / Cômodo:</label>
                {environmentImageBase64 ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group">
                    <img src={environmentImageBase64} alt="Ambiente Original" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => envFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Trocar Foto</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => envFileInputRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center text-stone-500 hover:text-amber-900 transition-all cursor-pointer p-4 text-center"
                  >
                    <Camera className="w-8 h-8 text-amber-600 mb-2" />
                    <span className="font-bold text-stone-800">Tirar Foto do Cômodo / Fachada</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Formatos JPG, PNG ou WEBP</span>
                  </button>
                )}
              </div>

              {/* Rendered 3D Result Box */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800 flex items-center justify-between">
                  <span>Render 3D do Material por IA:</span>
                  {simulateResultImage && (
                    <button
                      type="button"
                      onClick={() => handleDownloadImage(simulateResultImage, `projeto_3d_lmstore_${selectedMaterial.replace(/\s+/g, '_')}.jpg`)}
                      className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 3D</span>
                    </button>
                  )}
                </label>

                {simulateLoading ? (
                  <div className="w-full aspect-[4/3] rounded-2xl border border-stone-200 bg-stone-900 text-white flex flex-col items-center justify-center p-4 text-center">
                    <Wand2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                    <span className="font-bold text-amber-300">Renderizando Projeto 3D...</span>
                    <span className="text-[10px] text-stone-300 mt-1">Aplicando iluminação e sombras de alto padrão</span>
                  </div>
                ) : simulateResultImage ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-400 bg-stone-100 shadow-md">
                    <img src={simulateResultImage} alt="Render 3D com Material" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[11px] truncate font-semibold">
                      {selectedMaterial}
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-2xl border border-stone-200 bg-stone-100 text-stone-400 flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="w-8 h-8 text-stone-300 mb-1" />
                    <span>Selecione o material e clique em "Gerar Simulação 3D"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Material Selector & Custom Prompt Form */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div>
                <label className="block font-bold text-stone-900 mb-1">Selecione o Material de Construção a Inserir:</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-600"
                >
                  <option value="Porcelanato Polido 90x90cm Portobello">Porcelanato Polido 90x90cm Portobello (Piso)</option>
                  <option value="Piso Vinílico Amadeirado Acetinado Durafloor">Piso Vinílico Amadeirado Acetinado Durafloor</option>
                  <option value="Janela de Alumínio Branco 120x120cm Sasazaki">Janela de Alumínio Branco 120x120cm Sasazaki</option>
                  <option value="Revestimento de Parede Tijolo Ecológico Rústico">Revestimento de Parede Tijolo Rústico</option>
                  <option value="Telha Termoacústica Sanduíche Brasilit">Telha Termoacústica Sanduíche Brasilit</option>
                  <option value="Torneira Monocomando Gourmet Docol Chrome">Torneira Monocomando Gourmet Docol Chrome</option>
                  <option value="Refletor LED 100W Iluminação Externa">Refletor LED 100W Iluminação Externa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Instrução Adicional para a IA (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ex: Aplique no piso com iluminação de final de tarde e reflexo no espelho..."
                  value={customMaterialPrompt}
                  onChange={(e) => setCustomMaterialPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              onClick={handleSimulateMaterial}
              disabled={simulateLoading || !environmentImageBase64}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Gerar Projeto 3D com IA (Iluminação & Efeito Premium)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
