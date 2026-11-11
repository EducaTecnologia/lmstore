export interface BrandItem {
  id: string;
  name: string;
  subText: string;
  category: string;
  bgBadge: string;
  accentColor: string;
  textColor: string;
  borderClass: string;
  svgIcon: string; // Brand emblem / SVG path
}

export const TOP_ROW_BRANDS: BrandItem[] = [
  {
    id: 'b-votoran',
    name: 'Votoran',
    subText: 'Votorantim Cimentos',
    category: 'Estrutura e Alvenaria',
    bgBadge: 'bg-white',
    accentColor: '#C4161C',
    textColor: '#1e293b',
    borderClass: 'border-red-200 hover:border-red-500',
    svgIcon: 'votoran'
  },
  {
    id: 'b-tigre',
    name: 'Tigre',
    subText: 'Tubos & Conexões',
    category: 'Hidráulica e Encanamento',
    bgBadge: 'bg-white',
    accentColor: '#005CA9',
    textColor: '#005CA9',
    borderClass: 'border-blue-200 hover:border-blue-600',
    svgIcon: 'tigre'
  },
  {
    id: 'b-bosch',
    name: 'BOSCH',
    subText: 'Tecnologia Profissional',
    category: 'Ferramentas & EPIs',
    bgBadge: 'bg-white',
    accentColor: '#EA1D25',
    textColor: '#0f172a',
    borderClass: 'border-red-200 hover:border-red-600',
    svgIcon: 'bosch'
  },
  {
    id: 'b-suvinil',
    name: 'Suvinil',
    subText: 'Tintas & Cores',
    category: 'Tintas e Pintura',
    bgBadge: 'bg-white',
    accentColor: '#FF6A00',
    textColor: '#ea580c',
    borderClass: 'border-orange-200 hover:border-orange-500',
    svgIcon: 'suvinil'
  },
  {
    id: 'b-gerdau',
    name: 'Gerdau',
    subText: 'Aço CA-50 / CA-60',
    category: 'Estrutura e Alvenaria',
    bgBadge: 'bg-white',
    accentColor: '#004B87',
    textColor: '#004B87',
    borderClass: 'border-blue-200 hover:border-blue-600',
    svgIcon: 'gerdau'
  },
  {
    id: 'b-portobello',
    name: 'Portobello',
    subText: 'Pisos & Porcelanatos',
    category: 'Acabamentos',
    bgBadge: 'bg-white',
    accentColor: '#1e293b',
    textColor: '#0f172a',
    borderClass: 'border-stone-300 hover:border-stone-800',
    svgIcon: 'portobello'
  },
  {
    id: 'b-sil',
    name: 'SIL',
    subText: 'Fios e Cabos Elétricos',
    category: 'Elétrica e Iluminação',
    bgBadge: 'bg-white',
    accentColor: '#00833E',
    textColor: '#00833E',
    borderClass: 'border-emerald-200 hover:border-emerald-600',
    svgIcon: 'sil'
  },
  {
    id: 'b-brasilit',
    name: 'Brasilit',
    subText: 'Coberturas & Telhas',
    category: 'Coberturas e Telhados',
    bgBadge: 'bg-white',
    accentColor: '#00843D',
    textColor: '#00843D',
    borderClass: 'border-emerald-200 hover:border-emerald-600',
    svgIcon: 'brasilit'
  },
  {
    id: 'b-quartzolit',
    name: 'Quartzolit',
    subText: 'Argamassas & Rejuntes',
    category: 'Estrutura e Alvenaria',
    bgBadge: 'bg-white',
    accentColor: '#F5A623',
    textColor: '#b45309',
    borderClass: 'border-amber-200 hover:border-amber-500',
    svgIcon: 'quartzolit'
  },
  {
    id: 'b-deca',
    name: 'Deca',
    subText: 'Louças & Metais',
    category: 'Hidráulica e Encanamento',
    bgBadge: 'bg-white',
    accentColor: '#1e293b',
    textColor: '#0f172a',
    borderClass: 'border-stone-300 hover:border-stone-800',
    svgIcon: 'deca'
  },
  {
    id: 'b-dewalt',
    name: 'DeWALT',
    subText: 'Guaranteed Tough',
    category: 'Ferramentas & EPIs',
    bgBadge: 'bg-[#FEBD17]',
    accentColor: '#000000',
    textColor: '#000000',
    borderClass: 'border-amber-400 hover:border-amber-600',
    svgIcon: 'dewalt'
  },
  {
    id: 'b-coral',
    name: 'Coral',
    subText: 'Tintas AkzoNobel',
    category: 'Tintas e Pintura',
    bgBadge: 'bg-white',
    accentColor: '#0033A0',
    textColor: '#0033A0',
    borderClass: 'border-blue-200 hover:border-blue-500',
    svgIcon: 'coral'
  }
];

export const BOTTOM_ROW_BRANDS: BrandItem[] = [
  {
    id: 'b-makita',
    name: 'Makita',
    subText: 'Ferramentas a Bateria',
    category: 'Ferramentas & EPIs',
    bgBadge: 'bg-white',
    accentColor: '#008C99',
    textColor: '#008C99',
    borderClass: 'border-teal-200 hover:border-teal-600',
    svgIcon: 'makita'
  },
  {
    id: 'b-vedacit',
    name: 'Vedacit',
    subText: 'Impermeabilizantes',
    category: 'Estrutura e Alvenaria',
    bgBadge: 'bg-white',
    accentColor: '#F26522',
    textColor: '#c2410c',
    borderClass: 'border-orange-200 hover:border-orange-500',
    svgIcon: 'vedacit'
  },
  {
    id: 'b-amanco',
    name: 'Amanco Wavin',
    subText: 'Soluções Hidráulicas',
    category: 'Hidráulica e Encanamento',
    bgBadge: 'bg-white',
    accentColor: '#00A651',
    textColor: '#15803d',
    borderClass: 'border-green-200 hover:border-green-600',
    svgIcon: 'amanco'
  },
  {
    id: 'b-schneider',
    name: 'Schneider Electric',
    subText: 'Disjuntores & Quadros',
    category: 'Elétrica e Iluminação',
    bgBadge: 'bg-white',
    accentColor: '#3DCD58',
    textColor: '#166534',
    borderClass: 'border-emerald-200 hover:border-emerald-600',
    svgIcon: 'schneider'
  },
  {
    id: 'b-vonder',
    name: 'Vonder',
    subText: 'Ferramentas Robustas',
    category: 'Ferramentas & EPIs',
    bgBadge: 'bg-white',
    accentColor: '#F5B324',
    textColor: '#854d0e',
    borderClass: 'border-yellow-300 hover:border-yellow-500',
    svgIcon: 'vonder'
  },
  {
    id: 'b-eliane',
    name: 'Eliane Revestimentos',
    subText: 'Design em Porcelanatos',
    category: 'Acabamentos',
    bgBadge: 'bg-white',
    accentColor: '#1e293b',
    textColor: '#0f172a',
    borderClass: 'border-stone-300 hover:border-stone-800',
    svgIcon: 'eliane'
  },
  {
    id: 'b-fortlev',
    name: 'Fortlev',
    subText: 'Caixas d’Água & Cisternas',
    category: 'Hidráulica e Encanamento',
    bgBadge: 'bg-white',
    accentColor: '#0065B3',
    textColor: '#0065B3',
    borderClass: 'border-blue-200 hover:border-blue-600',
    svgIcon: 'fortlev'
  },
  {
    id: 'b-arcelormittal',
    name: 'ArcelorMittal',
    subText: 'Aços Longos & Treliças',
    category: 'Estrutura e Alvenaria',
    bgBadge: 'bg-white',
    accentColor: '#FF5E00',
    textColor: '#c2410c',
    borderClass: 'border-orange-200 hover:border-orange-600',
    svgIcon: 'arcelor'
  },
  {
    id: 'b-lorenzetti',
    name: 'Lorenzetti',
    subText: 'Duchas & Metais',
    category: 'Hidráulica e Encanamento',
    bgBadge: 'bg-white',
    accentColor: '#005BA6',
    textColor: '#005BA6',
    borderClass: 'border-blue-200 hover:border-blue-600',
    svgIcon: 'lorenzetti'
  },
  {
    id: 'b-tekbond',
    name: 'Tekbond',
    subText: 'Silicones, PU40 & Colas',
    category: 'Tintas e Químicos',
    bgBadge: 'bg-white',
    accentColor: '#004F9F',
    textColor: '#004F9F',
    borderClass: 'border-blue-200 hover:border-blue-600',
    svgIcon: 'tekbond'
  },
  {
    id: 'b-sasazaki',
    name: 'Sasazaki',
    subText: 'Portas & Janelas Alumínio',
    category: 'Coberturas e Esquadrias',
    bgBadge: 'bg-white',
    accentColor: '#B82025',
    textColor: '#991b1b',
    borderClass: 'border-red-200 hover:border-red-600',
    svgIcon: 'sasazaki'
  },
  {
    id: 'b-3m',
    name: '3M',
    subText: 'EPIs & Fitas Profissionais',
    category: 'Ferramentas & EPIs',
    bgBadge: 'bg-white',
    accentColor: '#EE0000',
    textColor: '#b91c1c',
    borderClass: 'border-red-200 hover:border-red-600',
    svgIcon: '3m'
  }
];
