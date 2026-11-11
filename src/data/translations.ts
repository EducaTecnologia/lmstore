export type Language = 'pt' | 'en' | 'fr';

export interface TranslationDictionary {
  // Navigation & General
  home: string;
  categories: string;
  orders: string;
  cart: string;
  account: string;
  login: string;
  logout: string;
  searchPlaceholder: string;
  allHarvests: string;
  freshProduce: string;
  meatButcher: string;
  grainsCereals: string;
  coffeeCocoa: string;
  cheeseDairy: string;
  ecoCleaning: string;
  naturalHygiene: string;
  helpSupport: string;
  deliveryTo: string;
  searchShortcutsTitle: string;
  terms: string[];
  
  // Home Shelves & Callouts
  harvestNews: string;
  recentHarvestBadge: string;
  recentHarvestSub: string;
  viewAll: string;
  highlightsTitle: string;
  highlightsSub: string;
  offersWeekTitle: string;
  offersWeekSub: string;
  upToDiscount: string;
  viewAllOffers: string;
  expressDelivery: string;
  expressDeliverySub: string;
  directFromProducer: string;
  directFromProducerSub: string;
  fefoQuality: string;
  fefoQualitySub: string;
  securePayment: string;
  securePaymentSub: string;
  fieldDepartmentsTitle: string;
  fieldDepartmentsSub: string;
  bigDepartmentsTitle: string;
  aiChefTitle: string;
  aiChefSub: string;
  openAiChef: string;
  newsletterTitle: string;
  newsletterSub: string;
  newsletterPlaceholder: string;
  subscribe: string;
  itemsCount: string;
  
  // Cart & Checkout
  shoppingCart: string;
  continueShopping: string;
  emptyCart: string;
  cartEmptyTitle: string;
  cartEmptySubtitle: string;
  exploreProduce: string;
  freeShippingProgress: string;
  freeShippingEarned: string;
  orderSummary: string;
  couponPlaceholder: string;
  apply: string;
  couponActive: string;
  productsSubtotal: string;
  couponDiscount: string;
  deliveryFee: string;
  free: string;
  totalToPay: string;
  paymentNotice: string;
  proceedToCheckout: string;
  secureEnvironment: string;
  removeProduct: string;
  
  // Checkout Details
  finishOrder: string;
  stepAddress: string;
  stepSchedule: string;
  stepPayment: string;
  stepBack: string;
  backToCart: string;
  deliveryAddress: string;
  selectDeliveryTime: string;
  express35min: string;
  scheduledTime: string;
  paymentMethod: string;
  pixInstant: string;
  creditCard: string;
  cashOnDelivery: string;
  orderNotes: string;
  placeOrder: string;
  orderPlacedSuccess: string;
  
  // Product Card & List
  addToBag: string;
  addedToBag: string;
  organic: string;
  artisan: string;
  perUnit: string;
  reviews: string;
  noReviewsYet: string;
  ratingAverage: string;
  evaluateProduct: string;
  leaveReview: string;
  sendReview: string;
  verifiedPurchase: string;
  
  // User Profile
  myAccount: string;
  walletBalance: string;
  cashbackAvailable: string;
  pointsFidelity: string;
  couponsAvailable: string;
  activeOrderTrack: string;
  trackRoute: string;
  backToStore: string;
  saveChanges: string;

  // Dashboards & Roles
  roleCustomer: string;
  roleAdmin: string;
  roleOperator: string;
  roleStock: string;
  roleFinance: string;
  roleDelivery: string;
  roleCourier: string;
  adminPanel: string;
  ordersManagement: string;
  stockManagement: string;
  financialControl: string;
  deliveryLogistics: string;
  courierApp: string;
  cmsBanners: string;
  exportPdf: string;
  filterByStatus: string;
  
  // Footer
  institutional: string;
  aboutUs: string;
  contactSac: string;
  accountSecurity: string;
  privacyTerms: string;
  organicCert: string;
  sustainableAgro: string;
  allRightsReserved: string;
  
  // Language Names
  portuguese: string;
  english: string;
  french: string;
  selectLanguage: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  pt: {
    // Navigation & General
    home: 'Início',
    categories: 'Categorias',
    orders: 'Meus Pedidos',
    cart: 'Carrinho',
    account: 'Minha Conta',
    login: 'Entrar',
    logout: 'Sair',
    searchPlaceholder: 'Buscar cimento, tubo PVC, porcelanato, fios, ferramentas...',
    allHarvests: 'Todos os Departamentos',
    freshProduce: 'Estrutura & Alvenaria',
    meatButcher: 'Hidráulica & Encanamento',
    grainsCereals: 'Elétrica & Iluminação',
    coffeeCocoa: 'Pisos & Acabamentos',
    cheeseDairy: 'Tintas & Químicos',
    ecoCleaning: 'Coberturas & Esquadrias',
    naturalHygiene: 'Ferramentas & EPIs',
    helpSupport: 'Ajuda & Atendimento',
    deliveryTo: 'Entregar no canteiro / endereço:',
    searchShortcutsTitle: 'Produtos mais buscados para obras',
    terms: ['Cimento Votoran', 'Tubo Tigre', 'Fio SIL 2,5mm', 'Porcelanato Portobello', 'Tinta Suvinil', 'Furadeira Bosch', 'Vedacit', 'Disjuntor Schneider'],

    // Home Shelves & Callouts
    harvestNews: 'Lançamentos & Novidades para sua Obra',
    recentHarvestBadge: 'Recém Chegado',
    recentHarvestSub: 'Ferramentas de alta performance, porcelanatos e materiais com garantia de fábrica',
    viewAll: 'Ver catálogo completo',
    highlightsTitle: 'Destaques LM Store & Mais Vendidos',
    highlightsSub: 'Os materiais líderes de preferência entre mestres de obras, arquitetos e engenheiros',
    offersWeekTitle: 'Ofertas da Semana para Construção',
    offersWeekSub: 'Preços especiais diretos de fábrica com economia para a sua obra',
    upToDiscount: 'Até -30% OFF',
    viewAllOffers: 'Ver todas as ofertas',
    expressDelivery: 'Entrega Rápida na Obra',
    expressDeliverySub: 'Despacho ágil com frota própria e caminhões munck para descarga pesada.',
    directFromProducer: 'Marcas Oficiais Homologadas',
    directFromProducerSub: 'Parceria direta com Votorantim, Tigre, Gerdau, Bosch, Deca e Suvinil.',
    fefoQuality: 'Garantia e Procedência',
    fefoQualitySub: 'Todos os produtos certificados pela ABNT com nota fiscal e garantia integral.',
    securePayment: 'Condições Facilitadas',
    securePaymentSub: 'Pix com desconto imediato, faturamento para PJ ou até 12x no cartão.',
    fieldDepartmentsTitle: 'Departamentos da Construção Civil',
    fieldDepartmentsSub: 'Navegue pelas 7 principais etapas da obra com materiais das melhores marcas',
    bigDepartmentsTitle: 'Grandes Departamentos da Construção',
    aiChefTitle: 'Especialista em Obras LM Store (IA & Cálculo)',
    aiChefSub: 'Calcule a quantidade exata de cimento, argamassa, pisos ou cabos para o seu projeto com 1 clique.',
    openAiChef: 'Abrir Assistente de Obra',
    newsletterTitle: 'Receba a tabela semanal de preços e ofertas exclusivas para construtores',
    newsletterSub: 'Fique informado em primeira mão sobre descontos em cimento, aço, tubos e ferramentas profissionais.',
    newsletterPlaceholder: 'Digite seu e-mail profissional...',
    subscribe: 'Cadastrar',
    itemsCount: 'produtos',
    
    // Cart & Checkout
    shoppingCart: 'Carrinho de Compras',
    continueShopping: 'Continuar Comprando',
    emptyCart: 'Esvaziar Carrinho',
    cartEmptyTitle: 'Seu carrinho está vazio',
    cartEmptySubtitle: 'Adicione cimentos, vergalhões de aço, tubos, porcelanatos e ferramentas para o seu canteiro de obras.',
    exploreProduce: 'Explorar Materiais de Construção',
    freeShippingProgress: 'Faltam R$ {value} para Frete Grátis na Obra!',
    freeShippingEarned: 'Parabéns! Você ganhou Frete Grátis nesta compra!',
    orderSummary: 'Resumo do Pedido',
    couponPlaceholder: 'Cupom de Obra (ex: LMOBRA10)',
    apply: 'Aplicar',
    couponActive: 'Cupom ativo:',
    productsSubtotal: 'Subtotal dos materiais',
    couponDiscount: 'Desconto do Cupom',
    deliveryFee: 'Frete e Descarregamento',
    free: 'Grátis',
    totalToPay: 'Total a Pagar',
    paymentNotice: 'Em até 12x no cartão ou Pix com desconto',
    proceedToCheckout: 'Avançar para o Checkout',
    secureEnvironment: 'Ambiente 100% Criptografado & Seguro',
    removeProduct: 'Remover material',
    
    // Checkout Details
    finishOrder: 'Finalizar Pedido de Materiais',
    stepAddress: 'Local da Obra',
    stepSchedule: 'Janela de Descarga',
    stepPayment: 'Pagamento',
    stepBack: 'Voltar Etapa',
    backToCart: 'Voltar ao Carrinho',
    deliveryAddress: 'Endereço da Obra / Canteiro',
    selectDeliveryTime: 'Janela de Entrega',
    express35min: 'Entrega Expressa Canteiro (Hoje)',
    scheduledTime: 'Entrega Programada / Agendada',
    paymentMethod: 'Forma de Pagamento',
    pixInstant: 'Pix Instantâneo (Aprovação Imediata com Desconto)',
    creditCard: 'Cartão de Crédito (Até 12x)',
    cashOnDelivery: 'Pagamento no Descarregamento',
    orderNotes: 'Instruções para o Caminhão / Descarregamento',
    placeOrder: 'Confirmar e Fechar Pedido',
    orderPlacedSuccess: 'Pedido Realizado com Sucesso!',
    
    // Product Card & List
    addToBag: 'Adicionar',
    addedToBag: 'No Carrinho',
    organic: 'ABNT Certificado',
    artisan: 'Linha Profissional',
    perUnit: 'por',
    reviews: 'avaliações',
    noReviewsYet: 'Sem avaliações ainda',
    ratingAverage: 'Nota Técnica',
    evaluateProduct: 'Avaliar Produto',
    leaveReview: 'Deixe seu comentário e nota',
    sendReview: 'Enviar Avaliação',
    verifiedPurchase: 'Compra Verificada',
    
    // User Profile
    myAccount: 'Minha Conta LM Store',
    walletBalance: 'Saldo em Crédito de Obra',
    cashbackAvailable: 'Cashback Acumulado',
    pointsFidelity: 'Pontos Clube Construtor',
    couponsAvailable: 'Cupons Ativos',
    activeOrderTrack: 'Pedido em Trânsito para a Obra',
    trackRoute: 'Acompanhar Caminhão de Entrega',
    backToStore: 'Voltar para a Loja',
    saveChanges: 'Salvar Alterações',

    // Dashboards & Roles
    roleCustomer: 'Cliente / Construtor',
    roleAdmin: 'Administrador Geral',
    roleOperator: 'Operador de Pedidos',
    roleStock: 'Gestor de Almoxarifado / Estoque',
    roleFinance: 'Financeiro & Faturamento PJ',
    roleDelivery: 'Logística de Caminhões & Frotas',
    roleCourier: 'Motorista / Entregador',
    adminPanel: 'Painel Administrativo',
    ordersManagement: 'Gestão de Pedidos de Obra',
    stockManagement: 'Gestão de Estoque & Lotes',
    financialControl: 'Controle Financeiro & Fluxo',
    deliveryLogistics: 'Logística de Fretes & Rotas',
    courierApp: 'Área do Motorista de Carga',
    cmsBanners: 'Gerenciador de Campanhas & Banners',
    exportPdf: 'Exportar Relatório em PDF',
    filterByStatus: 'Filtrar por status',
    
    // Footer
    institutional: 'Institucional LM Store',
    aboutUs: 'Sobre a LM Store (Quem Somos)',
    contactSac: 'Fale Conosco & Suporte Técnico',
    accountSecurity: 'Conta e Segurança de Dados',
    privacyTerms: 'Termos de Uso e Política de Privacidade',
    organicCert: 'Normas Técnicas ABNT e Certificações',
    sustainableAgro: 'LM Store - Sua Loja Online de Materiais de Construção',
    allRightsReserved: 'Todos os direitos reservados. LM Store Materiais de Construção Ltda.',
    
    // Languages
    portuguese: 'Português (Brasil)',
    english: 'English (US)',
    french: 'Français (France)',
    selectLanguage: 'Idioma / Language'
  },
  en: {
    // Navigation & General
    home: 'Home',
    categories: 'Categories',
    orders: 'My Orders',
    cart: 'Cart',
    account: 'Account',
    login: 'Log In',
    logout: 'Log Out',
    searchPlaceholder: 'Search cement, pipes, porcelain tiles, cables, power tools...',
    allHarvests: 'All Departments',
    freshProduce: 'Structure & Masonry',
    meatButcher: 'Plumbing & Pipes',
    grainsCereals: 'Electrical & Lighting',
    coffeeCocoa: 'Tiles & Finishes',
    cheeseDairy: 'Paints & Chemicals',
    ecoCleaning: 'Roofing & Windows',
    naturalHygiene: 'Tools & PPE',
    helpSupport: 'Support & Helpdesk',
    deliveryTo: 'Deliver to jobsite / address:',
    searchShortcutsTitle: 'Top construction searches',
    terms: ['Votoran Cement', 'Tigre PVC Pipe', 'SIL Cable 2.5mm', 'Portobello Tile', 'Suvinil Paint', 'Bosch Cordless Drill', 'Vedacit', 'Schneider Breaker'],
    
    // Home Shelves & Callouts
    harvestNews: 'New Arrivals & Jobsite Essentials',
    recentHarvestBadge: 'Just Arrived',
    recentHarvestSub: 'High-performance power tools, tiles and structural materials with manufacturer warranty',
    viewAll: 'View all products',
    highlightsTitle: 'LM Store Bestsellers & Contractor Favorites',
    highlightsSub: 'Top-rated materials certified by technical building standards with express dispatch',
    offersWeekTitle: 'Weekly Construction Deals',
    offersWeekSub: 'Factory-direct prices from foundation to finishing',
    upToDiscount: 'Up to 30% OFF',
    viewAllOffers: 'View all deals',
    expressDelivery: 'Express Jobsite Delivery',
    expressDeliverySub: 'Dedicated truck fleet with crane unloading straight to your jobsite.',
    directFromProducer: 'Certified National Brands',
    directFromProducerSub: 'Direct partnerships with Votorantim, Tigre, Bosch, Gerdau and Suvinil.',
    fefoQuality: 'Warranty & Origin',
    fefoQualitySub: '100% genuine products with invoice and official manufacturer warranty.',
    securePayment: 'Flexible Financing',
    securePaymentSub: 'Instant Pix discounts, B2B commercial invoicing or credit card up to 12x.',
    fieldDepartmentsTitle: 'Construction Departments',
    fieldDepartmentsSub: 'Browse the 7 core building phases with top-tier materials',
    bigDepartmentsTitle: 'Major Building Departments',
    aiChefTitle: 'LM Store Jobsite Material Calculator (AI)',
    aiChefSub: 'Calculate accurate quantities of cement, mortar, rebar, or wiring with 1 click.',
    openAiChef: 'Open Construction Assistant',
    newsletterTitle: 'Receive weekly price updates and exclusive builder offers',
    newsletterSub: 'Get notified first on bulk discounts for cement, steel, pipes and professional tools.',
    newsletterPlaceholder: 'Enter your business email...',
    subscribe: 'Subscribe',
    itemsCount: 'items',

    // Cart & Checkout
    shoppingCart: 'Shopping Cart',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Empty Cart',
    cartEmptyTitle: 'Your cart is empty',
    cartEmptySubtitle: 'Add cement, rebar, pipes, tiles, and tools for your building project.',
    exploreProduce: 'Explore Construction Supplies',
    freeShippingProgress: 'Add R$ {value} more for Free Jobsite Delivery!',
    freeShippingEarned: 'Congratulations! You unlocked Free Jobsite Delivery!',
    orderSummary: 'Order Summary',
    couponPlaceholder: 'Contractor Coupon (e.g. LMBUILD10)',
    apply: 'Apply',
    couponActive: 'Active coupon:',
    productsSubtotal: 'Materials subtotal',
    couponDiscount: 'Coupon discount',
    deliveryFee: 'Freight & Crane Delivery',
    free: 'Free',
    totalToPay: 'Total to Pay',
    paymentNotice: 'Up to 12x on card or instant Pix with discount',
    proceedToCheckout: 'Proceed to Checkout',
    secureEnvironment: '100% Encrypted & Secure Environment',
    removeProduct: 'Remove item',
    
    // Checkout Details
    finishOrder: 'Complete Building Order',
    stepAddress: 'Jobsite Location',
    stepSchedule: 'Delivery Window',
    stepPayment: 'Payment',
    stepBack: 'Previous Step',
    backToCart: 'Back to Cart',
    deliveryAddress: 'Jobsite Delivery Address',
    selectDeliveryTime: 'Delivery Window',
    express35min: 'Express Jobsite Delivery (Today)',
    scheduledTime: 'Scheduled Freight Delivery',
    paymentMethod: 'Payment Method',
    pixInstant: 'Pix Instant (Instant Confirmation with Discount)',
    creditCard: 'Credit Card (Up to 12x)',
    cashOnDelivery: 'Pay on Delivery',
    orderNotes: 'Truck Unloading Instructions',
    placeOrder: 'Confirm & Place Order',
    orderPlacedSuccess: 'Order Placed Successfully!',
    
    // Product Card & List
    addToBag: 'Add to Cart',
    addedToBag: 'In Cart',
    organic: 'Certified Spec',
    artisan: 'Pro Grade',
    perUnit: 'per',
    reviews: 'reviews',
    noReviewsYet: 'No reviews yet',
    ratingAverage: 'Technical Rating',
    evaluateProduct: 'Rate Product',
    leaveReview: 'Leave your review and rating',
    sendReview: 'Submit Review',
    verifiedPurchase: 'Verified Purchase',
    
    // User Profile
    myAccount: 'My LM Store Account',
    walletBalance: 'Building Credit Balance',
    cashbackAvailable: 'Cashback Earned',
    pointsFidelity: 'Builder Club Points',
    couponsAvailable: 'Active Coupons',
    activeOrderTrack: 'Truck in Transit to Jobsite',
    trackRoute: 'Track Delivery Fleet',
    backToStore: 'Back to Store',
    saveChanges: 'Save Changes',

    // Dashboards & Roles
    roleCustomer: 'Customer / Contractor',
    roleAdmin: 'General Administrator',
    roleOperator: 'Order Fulfillment Operator',
    roleStock: 'Warehouse & Yard Manager',
    roleFinance: 'Finance & B2B Billing',
    roleDelivery: 'Fleet Logistics',
    roleCourier: 'Freight Truck Driver',
    adminPanel: 'Admin Dashboard',
    ordersManagement: 'Building Orders Hub',
    stockManagement: 'Warehouse Inventory',
    financialControl: 'Financial Control',
    deliveryLogistics: 'Fleet Logistics',
    courierApp: 'Truck Driver App',
    cmsBanners: 'CMS Banner Manager',
    exportPdf: 'Export PDF Report',
    filterByStatus: 'Filter by status',
    
    // Footer
    institutional: 'LM Store Corporate',
    aboutUs: 'About LM Store & Facilities',
    contactSac: 'Contact Support & Helpdesk',
    accountSecurity: 'Account & Security',
    privacyTerms: 'Terms of Use & Privacy',
    organicCert: 'Building Code & ABNT Compliance',
    sustainableAgro: 'LM Store - Your Online Construction Supplies Store',
    allRightsReserved: 'All rights reserved. LM Store Materiais de Construção Ltda.',
    
    // Languages
    portuguese: 'Portuguese (Brazil)',
    english: 'English (US)',
    french: 'French (France)',
    selectLanguage: 'Language'
  },
  fr: {
    // Navigation & General
    home: 'Accueil',
    categories: 'Catégories',
    orders: 'Mes Commandes',
    cart: 'Panier',
    account: 'Mon Compte',
    login: 'Se Connecter',
    logout: 'Déconnexion',
    searchPlaceholder: 'Rechercher ciment, tuyaux, carrelage, câbles, outillage...',
    allHarvests: 'Tous les Rayons',
    freshProduce: 'Gros Œuvre & Maçonnerie',
    meatButcher: 'Plomberie & Sanitaire',
    grainsCereals: 'Électricité & Éclairage',
    coffeeCocoa: 'Carrelage & Finitions',
    cheeseDairy: 'Peintures & Chimie',
    ecoCleaning: 'Toitures & Menuiserie',
    naturalHygiene: 'Outillage & EPI',
    helpSupport: 'Aide & Support Technique',
    deliveryTo: 'Livrer sur le chantier / adresse :',
    searchShortcutsTitle: 'Recherches fréquentes pour chantiers',
    terms: ['Ciment Votoran', 'Tuyau PVC Tigre', 'Câble SIL 2,5mm', 'Carrelage Portobello', 'Peinture Suvinil', 'Perceuse Bosch', 'Vedacit', 'Disjoncteur Schneider'],
    
    // Home Shelves & Callouts
    harvestNews: 'Nouveautés & Essentiels de Chantier',
    recentHarvestBadge: 'Nouveau',
    recentHarvestSub: 'Outillage électroportatif, carrelages et matériaux garantis constructeur',
    viewAll: 'Voir tout le catalogue',
    highlightsTitle: 'Meilleures Ventes LM Store & Choix des Pros',
    highlightsSub: 'Matériaux certifiés aux normes de construction avec expédition rapide',
    offersWeekTitle: 'Offres Chantier de la Semaine',
    offersWeekSub: 'Prix directs d’usine des fondations aux finitions',
    upToDiscount: 'Jusqu’à -30% de Réduction',
    viewAllOffers: 'Voir toutes les offres',
    expressDelivery: 'Livraison Express sur Chantier',
    expressDeliverySub: 'Flotte dédiée avec camions-grues pour déchargement sécurisé sur site.',
    directFromProducer: 'Marques Officielles Agréées',
    directFromProducerSub: 'Partenariats directs avec Votorantim, Tigre, Bosch, Gerdau et Suvinil.',
    fefoQuality: 'Garantie & Origine Certifiée',
    fefoQualitySub: 'Produits 100% originaux avec facture et garantie constructeur.',
    securePayment: 'Paiement Facilité',
    securePaymentSub: 'Remise immédiate Pix, facturation pro ou carte bancaire jusqu’à 12x.',
    fieldDepartmentsTitle: 'Rayons Bâtiment & Construction',
    fieldDepartmentsSub: 'Parcourez les 7 étapes clés de votre chantier avec des marques de pointe',
    bigDepartmentsTitle: 'Grands Rayons de la Construction',
    aiChefTitle: 'Calculateur de Chantier LM Store (IA)',
    aiChefSub: 'Calculez la quantité exacte de ciment, mortier, acier ou câbles en 1 clic.',
    openAiChef: 'Ouvrir l’Assistant de Chantier',
    newsletterTitle: 'Recevez les grilles tarifaires et remises pros hebdomadaires',
    newsletterSub: 'Soyez informé en premier des remises en gros sur le ciment, acier et outillage.',
    newsletterPlaceholder: 'Entrez votre e-mail pro...',
    subscribe: 'S’inscrire',
    itemsCount: 'articles',

    // Cart & Checkout
    shoppingCart: 'Panier d’Achat',
    continueShopping: 'Continuer les Achats',
    emptyCart: 'Vider le Panier',
    cartEmptyTitle: 'Votre panier est vide',
    cartEmptySubtitle: 'Ajoutez du ciment, ferraillage, tuyauterie, carrelage et outillage pour votre chantier.',
    exploreProduce: 'Découvrir les Matériaux',
    freeShippingProgress: 'Plus que R$ {value} pour la Livraison Gratuite sur Chantier !',
    freeShippingEarned: 'Félicitations ! Livraison gratuite débloquée pour votre chantier !',
    orderSummary: 'Récapitulatif de Commande',
    couponPlaceholder: 'Code Promo Chantier (ex: LMCHAMP10)',
    apply: 'Appliquer',
    couponActive: 'Code promo actif :',
    productsSubtotal: 'Sous-total des matériaux',
    couponDiscount: 'Remise du Coupon',
    deliveryFee: 'Frais de Livraison & Déchargement',
    free: 'Gratuit',
    totalToPay: 'Total à Payer',
    paymentNotice: 'Jusqu’à 12x par carte ou remise immédiate Pix',
    proceedToCheckout: 'Passer la Commande',
    secureEnvironment: 'Environnement 100% Chiffré & Sécurisé',
    removeProduct: 'Supprimer l’article',
    
    // Checkout Details
    finishOrder: 'Finaliser la Commande Chantier',
    stepAddress: 'Chantier',
    stepSchedule: 'Créneau',
    stepPayment: 'Paiement',
    stepBack: 'Étape Précédente',
    backToCart: 'Retour au Panier',
    deliveryAddress: 'Adresse du Chantier',
    selectDeliveryTime: 'Créneau de Livraison',
    express35min: 'Livraison Express Chantier (Aujourd’hui)',
    scheduledTime: 'Livraison Programmée',
    paymentMethod: 'Mode de Paiement',
    pixInstant: 'Pix Instantané (Validation Immédiate avec Remise)',
    creditCard: 'Carte Bancaire (Jusqu’à 12x)',
    cashOnDelivery: 'Paiement au Déchargement',
    orderNotes: 'Instructions de Déchargement Grue / Camion',
    placeOrder: 'Confirmer la Commande',
    orderPlacedSuccess: 'Commande Validée avec Succès !',
    
    // Product Card & List
    addToBag: 'Ajouter',
    addedToBag: 'Au Panier',
    organic: 'Certifié ABNT',
    artisan: 'Qualité Pro',
    perUnit: 'par',
    reviews: 'avis',
    noReviewsYet: 'Aucun avis pour l’instant',
    ratingAverage: 'Note Technique',
    evaluateProduct: 'Évaluer le Produit',
    leaveReview: 'Laissez votre note et commentaire',
    sendReview: 'Publier l’Avis',
    verifiedPurchase: 'Achat Vérifié',
    
    // User Profile
    myAccount: 'Mon Compte LM Store',
    walletBalance: 'Crédit Matériaux en Compte',
    cashbackAvailable: 'Cashback Cumulé',
    pointsFidelity: 'Points Club Bâtisseur',
    couponsAvailable: 'Bons de Réduction Actifs',
    activeOrderTrack: 'Camion en Route vers le Chantier',
    trackRoute: 'Suivre le Camion de Livraison',
    backToStore: 'Retour au Catalogue',
    saveChanges: 'Enregistrer les Modifications',

    // Dashboards & Roles
    roleCustomer: 'Client / Constructeur',
    roleAdmin: 'Administrateur Général',
    roleOperator: 'Opérateur de Commandes',
    roleStock: 'Gestionnaire de Dépôt / Matériaux',
    roleFinance: 'Finances & Facturation Entreprises',
    roleDelivery: 'Logistique Flotte & Camions',
    roleCourier: 'Chauffeur Poids Lourd',
    adminPanel: 'Tableau de Bord Admin',
    ordersManagement: 'Gestion des Commandes de Chantier',
    stockManagement: 'Gestion des Stocks Dépôt',
    financialControl: 'Contrôle Financier',
    deliveryLogistics: 'Logistique de Livraison',
    courierApp: 'Espace Chauffeur Poids Lourd',
    cmsBanners: 'Gestionnaire de Bannières',
    exportPdf: 'Exporter le Rapport en PDF',
    filterByStatus: 'Filtrer par statut',
    
    // Footer
    institutional: 'Institutionnel LM Store',
    aboutUs: 'À Propos de LM Store & Dépôts',
    contactSac: 'Contact & Support Technique',
    accountSecurity: 'Compte & Sécurité des Données',
    privacyTerms: 'Conditions Générales & Confidentialité',
    organicCert: 'Normes Techniques ABNT & Conformité',
    sustainableAgro: 'LM Store - Votre Magasin en Ligne de Matériaux de Construction',
    allRightsReserved: 'Tous droits réservés. LM Store Materiais de Construção Ltda.',
    
    // Languages
    portuguese: 'Portugais (Brésil)',
    english: 'Anglais (États-Unis)',
    french: 'Français (France)',
    selectLanguage: 'Langue'
  }
};
