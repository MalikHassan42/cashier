export enum View {
  POS = 'POS',
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  ORDERS = 'ORDERS',
  PURCHASING = 'PURCHASING',
  REPORTS = 'REPORTS'
}

export type DeviceType = 'MOBILE' | 'TABLET' | 'LAPTOP';

export type PaymentMethod = 'CASH' | 'CARD' | 'SPLIT' | 'DELIVERY_APP';

export type DeliveryProvider = 'NONE' | 'HUNGERSTATION' | 'MRSOOL' | 'JAHEZ' | 'TOYOU';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
  expiryDate?: string;
  unit: 'PCS' | 'BOX' | 'KG';
}

export interface CartItem extends Product {
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  date: string; // Changed to string for easier mock handling
  status: 'COMPLETED' | 'HOLD' | 'REFUNDED' | 'CANCELLED';
  paymentMethod: PaymentMethod;
  deliveryProvider?: DeliveryProvider;
  orderRefId?: string; // For delivery app reference
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  type: 'LOW_STOCK' | 'EXPIRING_SOON' | 'DEAD_STOCK';
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  balance: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDate: string;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  totalCost: number;
  itemsCount: number;
}