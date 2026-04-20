export type ProductCategory =
  | "seeds"
  | "fertilizer"
  | "pesticide"
  | "equipment"
  | "feed"
  | "harvest";

export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  cost: number;
  stock: number;
  reorderPoint: number;
  unit: string;
  supplier: string;
  status: ProductStatus;
  image?: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export type PaymentMethodKey =
  | "mobileMoney"
  | "bankTransfer"
  | "card"
  | "cashOnDelivery";

export type ShippingMethodKey =
  | "standardTruck"
  | "expressCourier"
  | "depotPickup";

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  placedAt: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethodKey;
  shippingMethod: ShippingMethodKey;
  notes?: string;
}

export type CustomerTier = "farmer" | "distributor" | "retailer" | "cooperative";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  location: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  farmSize?: string;
  primaryCrop?: string;
  avatarUrl?: string;
}

export type ActivityActionKey =
  | "placedOrder"
  | "flaggedLowStock"
  | "registeredCustomer"
  | "completedPayment"
  | "restocked"
  | "reviewed"
  | "generatedReport";

export interface Activity {
  id: string;
  actor: string;
  /** Translation key — looked up as `t.dashboard.activity.actions[actionKey]` */
  actionKey: ActivityActionKey;
  target: string;
  timestamp: string;
  kind: "order" | "stock" | "customer" | "product" | "system";
}

// -------------------- INVOICES --------------------

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

export interface InvoiceLineItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string; // e.g., "INV-2026-0042"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  status: InvoiceStatus;
  issueDate: string; // ISO
  dueDate: string; // ISO
  paidAt?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number; // computed
  total: number;
  notes?: string;
  currency: string; // "USD"
}
