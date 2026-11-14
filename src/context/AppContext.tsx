import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  UserPaymentMethod,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Banner,
  DeliveryZone,
  FinancialTransaction,
  ChatMessage,
  PushNotification,
  Address,
  InventoryLot,
  ProductReview,
  ShoppingList,
  ContextChatMessage,
  GoogleMapsRoute,
  UserCoupon,
  LoyaltyTransaction,
  LoyaltyRewardOption,
  StockAlertSubscription
} from '../types';
import { Language, TranslationDictionary, translations } from '../data/translations';
import {
  INITIAL_USERS,
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  DELIVERY_ZONES,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT,
  INITIAL_REVIEWS,
  INITIAL_SHOPPING_LISTS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  postLoginRedirect: string | null;
  setPostLoginRedirect: (view: string | null) => void;
  updateUserProfile: (data: Partial<User>) => void;
  addSavedAddress: (address: Address) => void;
  deleteSavedAddress: (addressId: string) => void;
  addPaymentMethod: (method: UserPaymentMethod) => void;
  deletePaymentMethod: (methodId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (emailOrPhone: string, role?: UserRole) => void;
  logout: () => void;
  
  // Internationalization (i18n)
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  
  // Catalog & Products CRUD
  products: Product[];
  categories: Category[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addInventoryLot: (productId: string, lotData: Omit<InventoryLot, 'id' | 'receivedAt'>) => void;
  deleteInventoryLot: (productId: string, lotId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartCount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    paymentMethod: 'pix' | 'credit_card' | 'money';
    address: Address;
    notes?: string;
    scheduledDate?: string;
    scheduledShift?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierId?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // Views & Navigation
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  activeInstitutionalSlug: string | null;
  openInstitutional: (slug: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Delivery & Address & Zones CRUD
  currentAddress: Address;
  setCurrentAddress: (address: Address) => void;
  deliveryZones: DeliveryZone[];
  addZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  updateZone: (zone: DeliveryZone) => void;
  deleteZone: (id: string) => void;

  // Banners & CMS
  banners: Banner[];
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;

  // Finance & Transactions CRUD
  financialTransactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'date'>) => void;
  cancelTransaction: (id: string) => void;

  // Real-time Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, orderId?: string) => void;

  // Notifications
  notifications: PushNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;

  // Reviews System
  reviews: ProductReview[];
  addReview: (review: { productId: string; rating: number; comment: string }) => void;
  getProductReviews: (productId: string) => ProductReview[];

  // Shopping Lists System ("Listas de Compras")
  shoppingLists: ShoppingList[];
  createShoppingList: (title: string, icon?: string, color?: string) => ShoppingList;
  deleteShoppingList: (id: string) => void;
  addItemToShoppingList: (listId: string, productId: string, quantity?: number) => void;
  removeItemFromShoppingList: (listId: string, productId: string) => void;
  addListToCart: (listId: string) => void;

  // Wishlist ("Lista de Desejos")
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveAllWishlistToCart: () => void;

  // Programa de Fidelidade LM
  loyaltyPoints: number;
  loyaltyHistory: LoyaltyTransaction[];
  loyaltyRewardsCatalog: LoyaltyRewardOption[];
  redeemedCoupons: UserCoupon[];
  earnLoyaltyPoints: (points: number, source: LoyaltyTransaction['source'], description: string) => void;
  redeemLoyaltyReward: (rewardId: string) => { success: boolean; coupon?: UserCoupon; message: string };

  // Avise-me quando chegar (Stock Alerts)
  stockAlerts: StockAlertSubscription[];
  subscribeStockAlert: (product: Product, email: string, channel?: 'push' | 'email' | 'both') => void;
  isSubscribedToStockAlert: (productId: string) => boolean;

  // Collapsible Admin Sidebar
  adminSidebarCollapsed: boolean;
  setAdminSidebarCollapsed: (collapsed: boolean) => void;
  toggleAdminSidebar: () => void;

  // Context-Aware Chatbot
  botOpen: boolean;
  setBotOpen: (open: boolean) => void;
  botLoading: boolean;
  botMessages: ContextChatMessage[];
  sendBotMessage: (
    text: string,
    options?: boolean | {
      forceThinking?: boolean;
      images?: { dataUrl: string; label?: string }[];
      measurements?: {
        width?: number;
        length?: number;
        height?: number;
        roomType?: string;
        colorName?: string;
      };
    }
  ) => Promise<void>;

  // Google Maps Route & Places Agent
  mapsModalOpen: boolean;
  setMapsModalOpen: (open: boolean) => void;
  activeRoute: GoogleMapsRoute | null;
  calculateRoute: (destinationAddress: string) => void;

  // PDF Reports Modal
  activeReportModal: { title: string; subtitle: string; profile: string; data: any } | null;
  openReportModal: (title: string, subtitle: string, profile: string, data: any) => void;
  closeReportModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe localStorage helper
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`lmstore_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`lmstore_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorage write error for ${key}:`, e);
    }
  };

  const [currentUser, setCurrentUser] = useState<User>(() => getStored('user', INITIAL_USERS[0]));
  // Always default isLoggedIn to false on application access as requested
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    try {
      localStorage.removeItem('lmstore_is_logged_in');
      const sessionAuth = sessionStorage.getItem('lmstore_is_logged_in');
      return sessionAuth === 'true';
    } catch {
      return false;
    }
  });

  const setIsLoggedIn = (logged: boolean) => {
    setIsLoggedInState(logged);
    try {
      if (logged) {
        sessionStorage.setItem('lmstore_is_logged_in', 'true');
      } else {
        sessionStorage.removeItem('lmstore_is_logged_in');
        localStorage.removeItem('lmstore_is_logged_in');
      }
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  };
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);
  const [language, setLanguageState] = useState<Language>(() => getStored('lang', 'pt'));

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStored('lang', lang);
  };

  const t = translations[language] || translations.pt;
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = getStored<Product[]>('products', INITIAL_PRODUCTS);
    let needsOutOfStockSeed = false;
    try {
      if (!localStorage.getItem('lmstore_stock_v2_seeded')) {
        needsOutOfStockSeed = true;
        localStorage.setItem('lmstore_stock_v2_seeded', 'true');
      }
    } catch {
      // Ignore storage error
    }
    return stored.map((p) => {
      const init = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
      if (needsOutOfStockSeed && (p.id === 'prod-hid-3' || p.id === 'prod-cob-2')) {
        return { ...p, image: init ? init.image : p.image, stock: 0, lots: [] };
      }
      return init ? { ...p, image: init.image } : p;
    });
  });
  const [categories] = useState<Category[]>(CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = getStored<Order[]>('orders', INITIAL_ORDERS);
    return stored.map((o) => ({
      ...o,
      items: o.items.map((item) => {
        const prod = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
        if ((!item.productImage || item.productImage.startsWith('/src/assets')) && prod) {
          return { ...item, productImage: prod.image };
        }
        return item;
      })
    }));
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [activeView, setActiveView] = useState<string>('ecommerce');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeInstitutionalSlug, setActiveInstitutionalSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentAddress, setCurrentAddress] = useState<Address>(INITIAL_USERS[0].address!);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => getStored('zones', DELIVERY_ZONES));
  const [banners, setBanners] = useState<Banner[]>(() => {
    const stored = getStored<Banner[]>('banners', INITIAL_BANNERS);
    return stored.map((b) => {
      const init = INITIAL_BANNERS.find((ib) => ib.id === b.id);
      return init ? { ...b, image: init.image } : b;
    });
  });
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => getStored('transactions', INITIAL_TRANSACTIONS));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getStored('chat', INITIAL_CHAT));
  const [notifications, setNotifications] = useState<PushNotification[]>(() => getStored('notifications', INITIAL_NOTIFICATIONS));
  const [reviews, setReviews] = useState<ProductReview[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(() => getStored('lists', INITIAL_SHOPPING_LISTS));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => getStored<string[]>('wishlist', []));

  // Loyalty Program ("Programa de Fidelidade LM")
  const loyaltyRewardsCatalog: LoyaltyRewardOption[] = [
    {
      id: 'rew-20',
      title: 'Cupom R$ 20,00 OFF',
      description: 'Desconto direto válido em compras acima de R$ 150,00 na LM Store.',
      pointsCost: 100,
      discountType: 'fixed',
      discountValue: 20,
      minOrder: 150,
      codePrefix: 'LMFID20',
    },
    {
      id: 'rew-frete',
      title: 'Frete Grátis Obra Express',
      description: 'Isenção da taxa de entrega para envio prioritário ou agendado.',
      pointsCost: 180,
      discountType: 'shipping',
      discountValue: 100,
      minOrder: 80,
      codePrefix: 'LMFRETE',
    },
    {
      id: 'rew-50',
      title: 'Cupom R$ 50,00 OFF',
      description: 'Desconto para materiais estruturais, pisos ou tintas acima de R$ 300,00.',
      pointsCost: 220,
      discountType: 'fixed',
      discountValue: 50,
      minOrder: 300,
      codePrefix: 'LMFID50',
    },
    {
      id: 'rew-10pct',
      title: 'Cupom 10% OFF Total',
      description: '10% de desconto em todo o carrinho de materiais sem limite de itens.',
      pointsCost: 300,
      discountType: 'percent',
      discountValue: 10,
      minOrder: 100,
      codePrefix: 'LMFID10P',
    },
  ];

  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() =>
    getStored<number>('loyalty_points', INITIAL_USERS[0].kmPoints || 250)
  );
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyTransaction[]>(() =>
    getStored<LoyaltyTransaction[]>('loyalty_history', [
      {
        id: 'loy-init-1',
        type: 'earn',
        source: 'boas_vindas',
        points: 250,
        description: 'Bônus de cadastro no Programa de Fidelidade LM',
        date: '14/11/2026',
      },
    ])
  );
  const [redeemedCoupons, setRedeemedCoupons] = useState<UserCoupon[]>(() =>
    getStored<UserCoupon[]>('redeemed_coupons', [])
  );
  const [stockAlerts, setStockAlerts] = useState<StockAlertSubscription[]>(() =>
    getStored<StockAlertSubscription[]>('stock_alerts', [])
  );

  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState<boolean>(() => getStored('sidebar_collapsed', false));
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Bot states
  const [botOpen, setBotOpen] = useState(false);
  const [botLoading, setBotLoading] = useState(false);
  const [botMessages, setBotMessages] = useState<ContextChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Olá! Sou o Assistente Técnico LM Store com Gemini IA. Anexe fotos de materiais para gerar sua lista com promoções, informe medidas ou foto de sala/garagem + piso para simular e calcular cimento/argamassa, ou envie foto de uma parede + cor (nome ou imagem) para orçar tinta, demãos, secagem e ver o resultado!',
      timestamp: 'Agora',
      suggestedActions: [
        { label: 'Orçar lista por foto', action: 'photo_materials' },
        { label: 'Calcular sala/garagem + piso', action: 'room_floor' },
        { label: 'Simular pintura de parede', action: 'wall_paint' },
        { label: 'Onde está meu pedido?', action: 'track_order' },
      ],
    },
  ]);

  // Google Maps state
  const [mapsModalOpen, setMapsModalOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<GoogleMapsRoute | null>({
    origin: 'Centro Logístico LM Store - Santo André, SP',
    destination: 'Av. Brigadeiro Faria Lima, 2232 - Jardim Paulistano, São Paulo, SP',
    distanceKm: 18.2,
    durationMinutes: 28,
    trafficStatus: 'leve',
    ecoFriendly: true,
    co2SavedKg: 0.85,
    steps: [
      'Saia da Av. Jaguaré em direção à Marginal Pinheiros',
      'Siga pela pista expressa da Marginal Pinheiros por 2.8 km',
      'Pegue a saída 14B para a Av. Rebouças / Faria Lima',
      'Vire à direita na Av. Brigadeiro Faria Lima até o número 2232',
      'Destino à direita (Portaria e Interfone apto 84)',
    ],
  });

  // PDF Report Modal state
  const [activeReportModal, setActiveReportModal] = useState<{ title: string; subtitle: string; profile: string; data: any } | null>(null);

  const openReportModal = (title: string, subtitle: string, profile: string, data: any) => {
    setActiveReportModal({ title, subtitle, profile, data });
  };

  const closeReportModal = () => {
    setActiveReportModal(null);
  };

  // Sync to localStorage
  useEffect(() => { setStored('products', products); }, [products]);
  useEffect(() => { setStored('cart', cart); }, [cart]);
  useEffect(() => { setStored('orders', orders); }, [orders]);
  useEffect(() => { setStored('reviews', reviews); }, [reviews]);
  useEffect(() => { setStored('lists', shoppingLists); }, [shoppingLists]);
  useEffect(() => { setStored('wishlist', wishlistIds); }, [wishlistIds]);
  useEffect(() => { setStored('loyalty_points', loyaltyPoints); }, [loyaltyPoints]);
  useEffect(() => { setStored('loyalty_history', loyaltyHistory); }, [loyaltyHistory]);
  useEffect(() => { setStored('redeemed_coupons', redeemedCoupons); }, [redeemedCoupons]);
  useEffect(() => { setStored('stock_alerts', stockAlerts); }, [stockAlerts]);
  useEffect(() => { setStored('zones', deliveryZones); }, [deliveryZones]);
  useEffect(() => { setStored('banners', banners); }, [banners]);
  useEffect(() => { setStored('transactions', financialTransactions); }, [financialTransactions]);
  useEffect(() => { setStored('sidebar_collapsed', adminSidebarCollapsed); }, [adminSidebarCollapsed]);

  // Open product automatically when arriving via shared link (?produto=slug)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const productParam = params.get('produto') || params.get('p');
      if (productParam) {
        const matched = products.find(
          (p) => p.slug === productParam || p.id === productParam
        );
        if (matched) {
          setSelectedProduct(matched);
        }
      }
    } catch {
      // Ignore URL parse error
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleAdminSidebar = () => {
    setAdminSidebarCollapsed((prev) => !prev);
  };

  const switchRole = (role: UserRole) => {
    const userMatch = INITIAL_USERS.find(u => u.role === role) || {
      id: `user-${role}-test`,
      name: `Usuário ${role.toUpperCase()}`,
      email: `${role}@lmstore.com.br`,
      phone: '(11) 99999-0000',
      role,
    };
    setCurrentUser(userMatch);
    setStored('user', userMatch);

    switch (role) {
      case 'customer':
        setActiveView('ecommerce');
        break;
      case 'admin':
        setActiveView('admin_dashboard');
        break;
      case 'operator':
        setActiveView('operator_orders');
        break;
      case 'stock':
        setActiveView('stock_management');
        break;
      case 'finance':
        setActiveView('finance_dashboard');
        break;
      case 'delivery':
        setActiveView('delivery_logistics');
        break;
      case 'courier':
        setActiveView('courier_panel');
        break;
      default:
        setActiveView('ecommerce');
    }

    showToast(`Perfil alterado para: ${role.toUpperCase()}`, 'info');
  };

  const login = (emailOrPhone: string, role?: UserRole) => {
    const clean = emailOrPhone.trim().toLowerCase();
    let targetUser: User | undefined;

    if (clean.includes('paulo') || clean.includes('placide') || clean.includes('plácide')) {
      targetUser = INITIAL_USERS.find(u => u.id === 'user-paulo') || INITIAL_USERS[0];
    } else if (clean) {
      targetUser = INITIAL_USERS.find(u => u.email.toLowerCase() === clean || u.phone.includes(clean));
    }

    if (!targetUser) {
      const targetRole = role || 'customer';
      targetUser = INITIAL_USERS.find(u => u.role === targetRole) || {
        id: `user-${targetRole}-${Date.now()}`,
        name: clean ? clean.split('@')[0] : 'Paulo Silva',
        fullName: clean ? clean.split('@')[0] : 'Paulo Roberto Silva',
        email: clean || 'paulo.silva@lmstore.com.br',
        phone: '(11) 98123-4567',
        role: targetRole,
      };
    }

    setCurrentUser(targetUser);
    setStored('user', targetUser);
    setIsLoggedIn(true);

    if (targetUser.address) {
      setCurrentAddress(targetUser.address);
    }

    if (postLoginRedirect) {
      const next = postLoginRedirect;
      setPostLoginRedirect(null);
      setActiveView(next);
    } else if (targetUser.role === 'customer') {
      setActiveView('profile');
    } else {
      switchRole(targetUser.role);
    }

    showToast(`Bem-vindo(a), ${targetUser.name}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveView('ecommerce');
    showToast('Você saiu da sua conta. Para realizar compras ou ver seus pedidos, faça login.', 'info');
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...data };
      setStored('user', updated);
      return updated;
    });
    showToast('Dados cadastrais atualizados com sucesso!', 'success');
  };

  const addSavedAddress = (newAddr: Address) => {
    setCurrentUser(prev => {
      const currentList = prev.savedAddresses || (prev.address ? [prev.address] : []);
      const updatedList = [newAddr, ...currentList.filter(a => a.id !== newAddr.id)];
      const updated = {
        ...prev,
        savedAddresses: updatedList,
        address: newAddr.isDefault ? newAddr : prev.address
      };
      setStored('user', updated);
      if (newAddr.isDefault) {
        setCurrentAddress(newAddr);
      }
      return updated;
    });
    showToast('Novo endereço adicionado com sucesso!', 'success');
  };

  const deleteSavedAddress = (addressId: string) => {
    setCurrentUser(prev => {
      const currentList = prev.savedAddresses || [];
      const updatedList = currentList.filter(a => a.id !== addressId);
      const updated = { ...prev, savedAddresses: updatedList };
      setStored('user', updated);
      return updated;
    });
    showToast('Endereço removido com sucesso!', 'info');
  };

  const addPaymentMethod = (newMethod: UserPaymentMethod) => {
    setCurrentUser(prev => {
      const currentList = prev.paymentMethods || [];
      const updatedList = [newMethod, ...currentList.filter(p => p.id !== newMethod.id)];
      const updated = { ...prev, paymentMethods: updatedList };
      setStored('user', updated);
      return updated;
    });
    showToast('Forma de pagamento adicionada com sucesso!', 'success');
  };

  const deletePaymentMethod = (methodId: string) => {
    setCurrentUser(prev => {
      const currentList = prev.paymentMethods || [];
      const updatedList = currentList.filter(p => p.id !== methodId);
      const updated = { ...prev, paymentMethods: updatedList };
      setStored('user', updated);
      return updated;
    });
    showToast('Forma de pagamento removida com sucesso!', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const findActiveCoupon = (code: string | null): UserCoupon | undefined => {
    if (!code) return undefined;
    const clean = code.trim().toUpperCase();
    const allAvailable: UserCoupon[] = [
      ...redeemedCoupons,
      ...(currentUser.coupons || []),
      {
        id: 'sys-bemvindo',
        code: 'BEMVINDO15',
        discount: 15,
        type: 'percent',
        description: '15% OFF boas-vindas',
        minOrder: 0,
        validUntil: '31/12/2026',
      },
      {
        id: 'sys-frete',
        code: 'KMFRETEGRATIS',
        discount: 100,
        type: 'shipping',
        description: 'Frete grátis',
        minOrder: 0,
        validUntil: '31/12/2026',
      },
      {
        id: 'sys-lmobra',
        code: 'LMOBRA10',
        discount: 10,
        type: 'percent',
        description: '10% OFF cimento e argamassa',
        minOrder: 150,
        validUntil: '31/12/2026',
      },
      {
        id: 'sys-provip',
        code: 'PROVIP50',
        discount: 50,
        type: 'fixed',
        description: 'R$ 50 OFF Clube Pro',
        minOrder: 400,
        validUntil: '31/12/2026',
      },
    ];
    return allAvailable.find((c) => c.code.toUpperCase() === clean);
  };

  const activeCouponObj = findActiveCoupon(appliedCoupon);

  const baseShippingFee = cartSubtotal >= 120 ? 0 : 7.90;
  const isFreeShippingCoupon =
    activeCouponObj?.type === 'shipping' ||
    appliedCoupon === 'KMFRETEGRATIS' ||
    appliedCoupon === 'FRETECAMPANHA';

  const cartDeliveryFee = isFreeShippingCoupon ? 0 : baseShippingFee;

  const cartDiscount = (() => {
    if (!activeCouponObj) return 0;
    if (activeCouponObj.type === 'shipping') return 0;
    if (activeCouponObj.type === 'percent') {
      return Math.round(cartSubtotal * (activeCouponObj.discount / 100) * 100) / 100;
    }
    return Math.min(cartSubtotal, activeCouponObj.discount);
  })();

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const matched = findActiveCoupon(clean);
    if (!matched) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (matched.minOrder > 0 && cartSubtotal < matched.minOrder) {
      return {
        success: false,
        message: `Pedido mínimo de R$ ${matched.minOrder.toFixed(2).replace('.', ',')} para ativar ${clean}.`,
      };
    }
    setAppliedCoupon(matched.code);
    showToast(`Cupom ${matched.code} aplicado com sucesso!`, 'success');
    return { success: true, message: `Cupom ${matched.code} ativado!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido');
  };

  // Loyalty Points Helpers
  const earnLoyaltyPoints = (
    points: number,
    source: LoyaltyTransaction['source'],
    description: string
  ) => {
    if (points <= 0) return;
    setLoyaltyPoints((prev) => {
      const next = prev + points;
      setCurrentUser((u) => ({ ...u, kmPoints: next }));
      return next;
    });
    const entry: LoyaltyTransaction = {
      id: `loy-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      type: 'earn',
      source,
      points,
      description,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setLoyaltyHistory((prev) => [entry, ...prev]);
  };

  const redeemLoyaltyReward = (rewardId: string) => {
    const reward = loyaltyRewardsCatalog.find((r) => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Recompensa não encontrada.' };
    }
    if (loyaltyPoints < reward.pointsCost) {
      return {
        success: false,
        message: `Faltam ${reward.pointsCost - loyaltyPoints} pontos para resgatar este cupom.`,
      };
    }

    const generatedCode = `${reward.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCoupon: UserCoupon = {
      id: `coup-fid-${Date.now()}`,
      code: generatedCode,
      discount: reward.discountValue,
      type: reward.discountType,
      description: `${reward.title} (Fidelidade LM)`,
      minOrder: reward.minOrder,
      validUntil: '31/12/2026',
    };

    setLoyaltyPoints((prev) => {
      const next = Math.max(0, prev - reward.pointsCost);
      setCurrentUser((u) => ({ ...u, kmPoints: next }));
      return next;
    });

    const redeemTx: LoyaltyTransaction = {
      id: `loy-red-${Date.now()}`,
      type: 'redeem',
      source: 'resgate',
      points: -reward.pointsCost,
      description: `Resgate: ${reward.title}`,
      date: new Date().toLocaleDateString('pt-BR'),
      couponCode: generatedCode,
    };
    setLoyaltyHistory((prev) => [redeemTx, ...prev]);
    setRedeemedCoupons((prev) => [newCoupon, ...prev]);
    setCurrentUser((u) => ({
      ...u,
      coupons: [newCoupon, ...(u.coupons || [])],
    }));

    showToast(`Cupom ${generatedCode} resgatado no Programa de Fidelidade LM!`, 'success');
    return {
      success: true,
      coupon: newCoupon,
      message: `Cupom ${generatedCode} adicionado à sua carteira!`,
    };
  };

  // Back-in-Stock Alert Helpers ("Avise-me quando chegar")
  const dispatchRestockAlerts = (product: Product, replenishedQty: number) => {
    const pending = stockAlerts.filter((a) => a.productId === product.id && !a.notified);
    if (pending.length === 0) return;

    const nowStr = new Date().toLocaleString('pt-BR');
    const recipientEmails = Array.from(new Set(pending.map((p) => p.email))).join(', ');

    setStockAlerts((prev) =>
      prev.map((a) =>
        a.productId === product.id && !a.notified
          ? { ...a, notified: true, notifiedAt: nowStr }
          : a
      )
    );

    const restockNotif: PushNotification = {
      id: `notif-stock-${Date.now()}`,
      title: `Chegou! ${product.name}`,
      message: `Estoque reposto (+${replenishedQty} ${product.unit}). Alerta Push e e-mail automático enviados para: ${recipientEmails}.`,
      type: 'stock',
      timestamp: 'Agora mesmo',
      read: false,
      link: `#produto:${product.id}`,
    };
    setNotifications((prev) => [restockNotif, ...prev]);

    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(`LM Store · Produto disponível!`, {
          body: `${product.name} voltou ao estoque (${replenishedQty} ${product.unit}). Garanta o seu!`,
        });
      } catch {
        // Ignore browser notification restrictions
      }
    }

    showToast(
      `Estoque reposto! Notificação Push e e-mail enviados para ${pending.length} aviso(s) de "${product.name}".`,
      'success'
    );
  };

  const subscribeStockAlert = (
    product: Product,
    email: string,
    channel: 'push' | 'email' | 'both' = 'both'
  ) => {
    const cleanEmail = (email || currentUser.email || 'cliente@lmstore.com.br').trim();
    if (
      (channel === 'push' || channel === 'both') &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      window.Notification.permission === 'default'
    ) {
      window.Notification.requestPermission().catch(() => {});
    }

    setStockAlerts((prev) => {
      const existingIdx = prev.findIndex(
        (a) => a.productId === product.id && !a.notified && a.email.toLowerCase() === cleanEmail.toLowerCase()
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], channel };
        return updated;
      }
      const newAlert: StockAlertSubscription = {
        id: `alert-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        email: cleanEmail,
        channel,
        createdAt: new Date().toLocaleString('pt-BR'),
        notified: false,
      };
      return [newAlert, ...prev];
    });

    const channelLabel =
      channel === 'both' ? 'Push e E-mail' : channel === 'push' ? 'Push' : 'E-mail';

    const confirmNotif: PushNotification = {
      id: `notif-alert-${Date.now()}`,
      title: `Aviso ativado: ${product.name}`,
      message: `Você receberá alerta automático via ${channelLabel} (${cleanEmail}) assim que este material retornar ao CD.`,
      type: 'stock',
      timestamp: 'Agora mesmo',
      read: false,
    };
    setNotifications((prev) => [confirmNotif, ...prev]);

    showToast(`Alerta ativado! Avisaremos via ${channelLabel} quando "${product.name}" chegar.`, 'success');
  };

  const isSubscribedToStockAlert = (productId: string) =>
    stockAlerts.some((a) => a.productId === productId && !a.notified);

  // Orders creation
  const createOrder = ({
    paymentMethod,
    address,
    notes,
    scheduledDate,
    scheduledShift,
  }: {
    paymentMethod: 'pix' | 'credit_card' | 'money';
    address: Address;
    notes?: string;
    scheduledDate?: string;
    scheduledShift?: string;
  }) => {
    const newCode = `LM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;

    // FEFO Stock deduction
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (!cartItem) return p;

        let needed = cartItem.quantity;
        const updatedLots = p.lots.map(lot => {
          if (needed <= 0) return lot;
          const take = Math.min(lot.quantity, needed);
          needed -= take;
          return { ...lot, quantity: lot.quantity - take };
        });

        const newTotalStock = Math.max(0, p.stock - cartItem.quantity);
        return {
          ...p,
          stock: newTotalStock,
          lots: updatedLots,
        };
      })
    );

    const newOrder: Order = {
      id: newOrderId,
      code: newCode,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      address,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        unit: item.product.unit,
        unitPrice: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        total: (item.product.salePrice ?? item.product.price) * item.quantity,
        lotNumber: item.product.lots[0]?.lotNumber || 'LT-PADRAO',
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      status: 'pago',
      paymentMethod,
      paymentStatus: 'paid',
      couponCode: appliedCoupon || undefined,
      distanceKm: 3.2,
      estimatedDeliveryMinutes: 35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
      scheduledDate,
      scheduledShift,
      timeline: [
        {
          status: 'novo',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: 'Pedido Realizado',
          description: scheduledDate && scheduledShift
            ? `Pedido registrado · Entrega agendada para ${scheduledDate} (${scheduledShift}).`
            : 'Seu pedido foi registrado no sistema LM Store.',
        },
        {
          status: 'pago',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: paymentMethod === 'pix' ? 'Pagamento Pix Aprovado' : 'Pagamento Aprovado',
          description: 'Transação confirmada. Iniciando separação dos materiais no CD.',
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    const earnedPoints = Math.max(10, Math.round(cartTotal / 10));
    earnLoyaltyPoints(earnedPoints, 'compra', `Compra Pedido #${newCode} (R$ ${cartTotal.toFixed(2).replace('.', ',')})`);

    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      orderId: newOrderId,
      type: 'receita_venda',
      description: `Venda Pedido #${newCode} (${paymentMethod})`,
      amount: cartTotal,
      fee: paymentMethod === 'pix' ? Math.round(cartTotal * 0.0099 * 100) / 100 : Math.round(cartTotal * 0.0299 * 100) / 100,
      netAmount: cartTotal - (paymentMethod === 'pix' ? Math.round(cartTotal * 0.0099 * 100) / 100 : Math.round(cartTotal * 0.0299 * 100) / 100),
      paymentMethod,
      status: 'concluido',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setFinancialTransactions(prev => [newTx, ...prev]);

    const scheduleText = scheduledDate && scheduledShift
      ? ` Entrega programada: ${scheduledDate} · ${scheduledShift}.`
      : '';

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: `Pedido ${newCode} Aprovado! (+${earnedPoints} pts)`,
      message: `Materiais em preparação no CD LM Store.${scheduleText} Você acumulou +${earnedPoints} pts no Programa de Fidelidade LM.`,
      type: 'order',
      timestamp: 'Agora mesmo',
      read: false,
      link: '#rastreio',
    };
    setNotifications(prev => [newNotif, ...prev]);

    clearCart();
    setActiveView('order_tracking');
    showToast(`Pedido ${newCode} confirmado! +${earnedPoints} pontos acumulados na Fidelidade LM.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, courierId?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let label = 'Status Atualizado';
        let description = 'O status do seu pedido mudou.';

        if (status === 'separacao') {
          label = 'Em Separação no CD Agro';
          description = 'Itens frescos colhidos e embalados para despacho térmico.';
        } else if (status === 'em_entrega') {
          label = 'Saiu para Entrega';
          description = 'Entregador parceiro a caminho do seu endereço.';
        } else if (status === 'entregue') {
          label = 'Pedido Entregue';
          description = 'Entrega concluída com sucesso. Bom apetite!';
        } else if (status === 'cancelado') {
          label = 'Pedido Cancelado';
          description = 'O pedido foi cancelado e o estorno processado.';
        }

        const newTimeline = [
          ...ord.timeline,
          { status, timestamp: timeStr, label, description },
        ];

        return {
          ...ord,
          status,
          courierId: courierId || ord.courierId,
          courierName: courierId ? 'Tiago Santos (Honda CG Cargo)' : ord.courierName,
          timeline: newTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    showToast(`Status do pedido atualizado para: ${status.toUpperCase()}`, 'info');
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'cancelado');
    showToast(`Pedido cancelado: ${reason}`, 'warning');
  };

  // Products CRUD
  const updateProduct = (updated: Product) => {
    const previous = products.find((p) => p.id === updated.id);
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast(`Produto "${updated.name}" atualizado.`);
    if (previous && previous.stock <= 0 && updated.stock > 0) {
      dispatchRestockAlerts(updated, updated.stock);
    }
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const prod: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [prod, ...prev]);
    showToast(`Novo produto "${prod.name}" cadastrado!`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produto excluído com sucesso.');
  };

  const addInventoryLot = (productId: string, lotData: Omit<InventoryLot, 'id' | 'receivedAt'>) => {
    const newLot: InventoryLot = {
      ...lotData,
      id: `lot-${Date.now()}`,
      receivedAt: new Date().toISOString().slice(0, 10),
    };

    const targetProduct = products.find((p) => p.id === productId);
    const wasOutOfStock = Boolean(targetProduct && targetProduct.stock <= 0);

    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const newLots = [...p.lots, newLot];
        const newStock = p.stock + lotData.quantity;
        return {
          ...p,
          stock: newStock,
          lots: newLots,
        };
      })
    );

    showToast(`Lote ${lotData.lotNumber} recebido (+${lotData.quantity} unidades)!`);
    if (wasOutOfStock && targetProduct && lotData.quantity > 0) {
      dispatchRestockAlerts(targetProduct, lotData.quantity);
    }
  };

  const deleteInventoryLot = (productId: string, lotId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const removedLot = p.lots.find(l => l.id === lotId);
        const qtyToReduce = removedLot ? removedLot.quantity : 0;
        return {
          ...p,
          stock: Math.max(0, p.stock - qtyToReduce),
          lots: p.lots.filter(l => l.id !== lotId),
        };
      })
    );
    showToast('Lote removido com sucesso.', 'info');
  };

  // Delivery Zones CRUD
  const addZone = (zoneData: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = {
      ...zoneData,
      id: `zone-${Date.now()}`,
    };
    setDeliveryZones(prev => [...prev, newZone]);
    showToast(`Zona "${newZone.name}" cadastrada!`);
  };

  const updateZone = (updated: DeliveryZone) => {
    setDeliveryZones(prev => prev.map(z => (z.id === updated.id ? updated : z)));
    showToast(`Zona "${updated.name}" atualizada.`);
  };

  const deleteZone = (id: string) => {
    setDeliveryZones(prev => prev.filter(z => z.id !== id));
    showToast('Zona de entrega excluída.');
  };

  // Banners CRUD
  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
    };
    setBanners(prev => [...prev, newBanner]);
    showToast('Novo banner cadastrado!');
  };

  const updateBanner = (updated: Banner) => {
    setBanners(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    showToast('Banner promocional atualizado com sucesso.');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner excluído.');
  };

  // Financial Transactions CRUD
  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'date'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setFinancialTransactions(prev => [newTx, ...prev]);
    showToast('Lançamento financeiro registrado!');
  };

  const cancelTransaction = (id: string) => {
    setFinancialTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'cancelado' } : t))
    );
    showToast('Lançamento cancelado.');
  };

  // Chat
  const sendChatMessage = (text: string, orderId?: string) => {
    if (!text.trim()) return;
    const isCustomer = currentUser.role === 'customer';
    const msg: ChatMessage = {
      id: `chat-${Date.now()}`,
      orderId: orderId || activeOrder?.id,
      sender: isCustomer ? 'customer' : 'operator',
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setChatMessages(prev => [...prev, msg]);

    if (isCustomer) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `chat-${Date.now() + 1}`,
          orderId: orderId || activeOrder?.id,
          sender: 'operator',
          senderName: 'Lucas (Atendente LM Store)',
          text: 'Entendido! Nossa equipe do centro de distribuição já registrou sua mensagem e está priorizando sua solicitação.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };
        setChatMessages(prev => [...prev, reply]);
        showToast('Nova mensagem do suporte LM Store', 'info');
      }, 1500);
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todas as notificações foram marcadas como lidas.');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Reviews System
  const addReview = ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      userId: currentUser.id,
      userName: currentUser.fullName || currentUser.name,
      rating,
      comment,
      verifiedPurchase: true,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    setStored('reviews', updated);

    // Update product rating and reviewsCount
    const prodReviews = updated.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    setProducts(prev => {
      const newProds = prev.map(p =>
        p.id === productId
          ? { ...p, rating: Math.round(avg * 10) / 10, reviewsCount: prodReviews.length }
          : p
      );
      setStored('products', newProds);
      return newProds;
    });

    const prodObj = products.find((p) => p.id === productId);
    earnLoyaltyPoints(
      35,
      'avaliacao',
      `Avaliação publicada em "${prodObj?.name || 'Material de Construção'}"`
    );

    showToast('Avaliação publicada! Você ganhou +35 pontos no Programa de Fidelidade LM.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId);
  };

  // Shopping Lists System
  const createShoppingList = (title: string, icon = 'ShoppingCart', color = '#047857') => {
    const newList: ShoppingList = {
      id: `list-${Date.now()}`,
      userId: currentUser.id,
      title,
      icon,
      color,
      items: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setShoppingLists(prev => [newList, ...prev]);
    showToast(`Lista "${title}" criada com sucesso!`);
    return newList;
  };

  const deleteShoppingList = (id: string) => {
    setShoppingLists(prev => prev.filter(l => l.id !== id));
    showToast('Lista de compras excluída.');
  };

  const addItemToShoppingList = (listId: string, productId: string, quantity = 1) => {
    setShoppingLists(prev =>
      prev.map(l => {
        if (l.id !== listId) return l;
        const existing = l.items.find(i => i.productId === productId);
        let newItems;
        if (existing) {
          newItems = l.items.map(i =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          newItems = [...l.items, { productId, quantity }];
        }
        return {
          ...l,
          items: newItems,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );
    showToast('Item adicionado à lista de compras!');
  };

  const removeItemFromShoppingList = (listId: string, productId: string) => {
    setShoppingLists(prev =>
      prev.map(l => {
        if (l.id !== listId) return l;
        return {
          ...l,
          items: l.items.filter(i => i.productId !== productId),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );
    showToast('Item removido da lista.');
  };

  const addListToCart = (listId: string) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) return;

    list.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    showToast(`Todos os itens da lista "${list.title}" foram adicionados à cesta!`);
  };

  // Wishlist Handlers
  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`"${product.name}" removido da sua Lista de Desejos.`, 'info');
        return prev.filter((id) => id !== product.id);
      }
      showToast(`"${product.name}" salvo na sua Lista de Desejos!`, 'success');
      return [product.id, ...prev];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Produto removido da Lista de Desejos.', 'info');
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('Lista de Desejos esvaziada.', 'info');
  };

  const moveAllWishlistToCart = () => {
    let addedCount = 0;
    let skippedOutOfStock = 0;
    wishlistIds.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod) {
        if (prod.stock > 0) {
          addToCart(prod, 1);
          addedCount++;
        } else {
          skippedOutOfStock++;
        }
      }
    });
    if (addedCount > 0) {
      showToast(
        skippedOutOfStock > 0
          ? `${addedCount} produto(s) disponíveis adicionados (${skippedOutOfStock} esgotado(s) mantido(s)).`
          : `${addedCount} produto(s) da Lista de Desejos adicionados ao carrinho!`,
        'success'
      );
    } else if (skippedOutOfStock > 0) {
      showToast('Os itens salvos estão temporariamente esgotados. Ative o "Avise-me quando chegar"!', 'warning');
    }
  };

  // Context Chatbot (Integrated with Gemini API via /api/ai/assistant-chat)
  const sendBotMessage = async (
    text: string,
    options?:
      | boolean
      | {
          forceThinking?: boolean;
          images?: { dataUrl: string; label?: string }[];
          measurements?: {
            width?: number;
            length?: number;
            height?: number;
            roomType?: string;
            colorName?: string;
          };
        }
  ) => {
    const opts = typeof options === 'boolean' ? { forceThinking: options } : options || {};
    const images = opts.images || [];
    const measurements = opts.measurements;
    const forceThinking = Boolean(opts.forceThinking);

    if (!text.trim() && images.length === 0) return;

    const userMsg: ContextChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'user',
      content: text.trim() || 'Análise dos anexos enviados.',
      attachments: images.length > 0 ? images : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = [...botMessages, userMsg];
    setBotMessages(currentHistory);
    setBotLoading(true);

    try {
      const catalogSummary = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryName: p.categoryName,
        subcategory: p.subcategory,
        brand: p.brand,
        unit: p.unit,
        weightValue: p.weightValue,
        price: p.price,
        salePrice: p.salePrice,
        isPromo: Boolean(p.isPromo || (p.salePrice && p.salePrice < p.price)),
      }));

      const latestOrder = orders[0];
      const orderContext = {
        cartCount: cart.length,
        latestOrderCode: latestOrder?.code || 'LM-2026',
        latestOrderStatus: latestOrder?.status || 'em_entrega',
        customerCity: currentAddress?.city || 'São Paulo',
      };

      const res = await fetch('/api/ai/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          images,
          measurements,
          thinkingMode: forceThinking,
          catalogSummary,
          orderContext,
          history: currentHistory.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errMsg: ContextChatMessage = {
          id: `bot-${Date.now() + 1}`,
          role: 'assistant',
          content: data.error || 'Não foi possível conectar ao Assistente Gemini neste momento.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Gemini API',
        };
        setBotMessages((prev) => [...prev, errMsg]);
        showToast(data.error || 'Erro ao consultar Gemini AI.', 'warning');
        return;
      }

      const replyMsg: ContextChatMessage = {
        id: `bot-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinkingProcess: data.thinkingProcess,
        materialsList: data.materialsList,
        paintEstimate: data.paintEstimate,
        roomEstimate: data.roomEstimate,
        generatedImage: data.generatedImage,
        generatedImageWarning: data.generatedImageWarning,
        modelUsed: data.modelUsed || 'gemini-4-hydrogen',
      };

      setBotMessages((prev) => [...prev, replyMsg]);
      earnLoyaltyPoints(15, 'ia', 'Consultoria / Orçamento no Assistente Técnico IA');
      showToast('+15 pontos acumulados pela interação com a IA LM Store!', 'info');
    } catch (err: any) {
      const errMsg: ContextChatMessage = {
        id: `bot-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Falha de comunicação com o servidor do Assistente Gemini. Verifique sua conexão e tente novamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBotMessages((prev) => [...prev, errMsg]);
      showToast('Erro de rede ao consultar Gemini.', 'warning');
    } finally {
      setBotLoading(false);
    }
  };

  // Google Maps calculate route
  const calculateRoute = (destination: string) => {
    setActiveRoute({
      origin: 'Centro Logístico LM Store - Av. dos Estados, Santo André, SP',
      destination,
      distanceKm: 18.2,
      durationMinutes: 40,
      trafficStatus: 'moderado',
      ecoFriendly: true,
      co2SavedKg: 2.4,
      steps: [
        'Saída do Centro de Distribuição LM Store na Av. dos Estados',
        'Acesso ao Rodoanel Mário Covas sentido canteiro da obra',
        'Descarregamento programado com braço articulado Munck',
        `Chegada prevista ao destino: ${destination}`,
      ],
    });
    showToast(`Rota do caminhão munck calculada para: ${destination}`);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('produto', product.slug);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history API error
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('produto');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history API error
    }
  };

  const openInstitutional = (slug: string) => {
    setActiveInstitutionalSlug(slug);
    setActiveView('institutional');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        postLoginRedirect,
        setPostLoginRedirect,
        updateUserProfile,
        addSavedAddress,
        deleteSavedAddress,
        addPaymentMethod,
        deletePaymentMethod,
        switchRole,
        login,
        logout,
        language,
        setLanguage,
        t,
        products,
        categories,
        updateProduct,
        addProduct,
        deleteProduct,
        addInventoryLot,
        deleteInventoryLot,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        cartCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        activeOrder,
        setActiveOrder,
        activeView,
        setActiveView,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        activeInstitutionalSlug,
        openInstitutional,
        searchQuery,
        setSearchQuery,
        currentAddress,
        setCurrentAddress,
        deliveryZones,
        addZone,
        updateZone,
        deleteZone,
        banners,
        updateBanner,
        addBanner,
        deleteBanner,
        financialTransactions,
        addTransaction,
        cancelTransaction,
        chatMessages,
        sendChatMessage,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        showToast,
        toastMessage,
        reviews,
        addReview,
        getProductReviews,
        shoppingLists,
        createShoppingList,
        deleteShoppingList,
        addItemToShoppingList,
        removeItemFromShoppingList,
        addListToCart,
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveAllWishlistToCart,
        loyaltyPoints,
        loyaltyHistory,
        loyaltyRewardsCatalog,
        redeemedCoupons,
        earnLoyaltyPoints,
        redeemLoyaltyReward,
        stockAlerts,
        subscribeStockAlert,
        isSubscribedToStockAlert,
        adminSidebarCollapsed,
        setAdminSidebarCollapsed,
        toggleAdminSidebar,
        botOpen,
        setBotOpen,
        botLoading,
        botMessages,
        sendBotMessage,
        mapsModalOpen,
        setMapsModalOpen,
        activeRoute,
        calculateRoute,
        activeReportModal,
        openReportModal,
        closeReportModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
