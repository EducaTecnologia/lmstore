export type UserRole =
  | 'customer'
  | 'admin'
  | 'operator'
  | 'stock'
  | 'finance'
  | 'delivery'
  | 'courier';

export interface UserPaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'pix' | 'wallet';
  brand?: string;
  last4?: string;
  label: string;
}

export interface UserCoupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed' | 'shipping';
  description: string;
  minOrder: number;
  validUntil: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem';
  source: 'compra' | 'avaliacao' | 'ia' | 'resgate' | 'boas_vindas';
  points: number;
  description: string;
  date: string;
  couponCode?: string;
}

export interface LoyaltyRewardOption {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountType: 'percent' | 'fixed' | 'shipping';
  discountValue: number;
  minOrder: number;
  codePrefix: string;
}

export interface StockAlertSubscription {
  id: string;
  productId: string;
  productName: string;
  email: string;
  channel: 'push' | 'email' | 'both';
  createdAt: string;
  notified: boolean;
  notifiedAt?: string;
}

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  cpf?: string;
  vipStatus?: string;
  walletBalance?: number;
  cashback?: number;
  kmPoints?: number;
  address?: Address;
  savedAddresses?: Address[];
  paymentMethods?: UserPaymentMethod[];
  coupons?: UserCoupon[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  isDefault?: boolean;
  lat?: number;
  lng?: number;
}

export interface InventoryLot {
  id: string;
  lotNumber: string;
  quantity: number;
  unitCost: number;
  expirationDate: string; // YYYY-MM-DD
  receivedAt: string;
  supplier: string;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  accentColor?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  brand?: string;
  sku: string;
  barcode: string;
  description: string;
  unit: 'un' | 'kg' | 'g' | 'lt' | 'ml' | 'cx' | 'fd' | 'pc' | 'sc' | 'm2' | 'br' | 'm' | 'par' | 'rolo';
  weightValue: string;
  price: number;
  salePrice?: number;
  isPromo?: boolean;
  isNew?: boolean;
  isOrganic?: boolean;
  isPerishable: boolean;
  expirationDays?: number;
  minStock: number;
  maxStock: number;
  stock: number;
  lots: InventoryLot[];
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewsCount: number;
  originLocation: string; // e.g. "Fábrica Votoran - Salto de Pirapora / SP"
  producer: string; // Fabricante / Fornecedor
  nutritionalNotes?: string;
  technicalSpecs?: { label: string; value: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  subcategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedLotId?: string;
}

export type OrderStatus =
  | 'novo'
  | 'pago'
  | 'separacao'
  | 'em_entrega'
  | 'entregue'
  | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
  lotNumber?: string;
}

export interface OrderStatusTimeline {
  status: OrderStatus;
  timestamp: string;
  label: string;
  description: string;
}

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'credit_card' | 'money';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  couponCode?: string;
  distanceKm: number;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  deliveryProofUrl?: string;
  timeline: OrderStatusTimeline[];
  notes?: string;
  scheduledDate?: string;
  scheduledShift?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  radiusKm: number;
  baseFee: number;
  perKmFee: number;
  minOrder: number;
  estimatedMinutes: number;
  active: boolean;
}

export interface FinancialTransaction {
  id: string;
  orderId?: string;
  type: 'receita_venda' | 'estorno' | 'repasse_entregador' | 'taxa_gateway';
  description: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: 'pix' | 'credit_card' | 'money';
  status: 'concluido' | 'pendente' | 'cancelado';
  date: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  sender: 'customer' | 'operator' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'stock' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  image: string;
  badge?: string;
  backgroundColor: string;
  active: boolean;
  order: number;
}

export interface CareerJob {
  id: string;
  title: string;
  area: string;
  location: string;
  modality: 'Presencial' | 'Híbrido' | 'Remoto';
  description: string;
  requirements: string[];
}

export interface CourierApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  vehicleType: 'Moto' | 'Bicicleta' | 'Carro / Fiorino';
  cnh: string;
  status: 'received' | 'reviewing' | 'approved';
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ShoppingListItem {
  productId: string;
  quantity: number;
}

export interface ShoppingList {
  id: string;
  userId: string;
  title: string;
  icon?: string;
  color?: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMaterialRecommendation {
  name: string;
  quantity: string;
  notes: string;
  matchedProductId?: string;
  isPromoOption?: boolean;
}

export interface ChatPaintEstimate {
  surfaceAreaM2: number;
  litersNeeded: string;
  cansRecommended: string;
  coats: string;
  dryingTime: string;
  estimatedCostBRL: number;
}

export interface ChatRoomEstimate {
  floorAreaM2: number;
  floorWithMarginM2: string;
  cementBags: string;
  mortarBags: string;
  groutKg: string;
  estimatedCostBRL: number;
}

export interface ContextChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: { dataUrl: string; label?: string }[];
  generatedImage?: string;
  generatedImageWarning?: string;
  materialsList?: ChatMaterialRecommendation[];
  paintEstimate?: ChatPaintEstimate;
  roomEstimate?: ChatRoomEstimate;
  suggestedActions?: { label: string; action: string }[];
  thinkingProcess?: string[];
  modelUsed?: string;
}

export interface GoogleMapsRoute {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  trafficStatus: 'leve' | 'moderado' | 'intenso';
  ecoFriendly: boolean;
  co2SavedKg: number;
  steps: string[];
}

