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
  paymentMethod: string;
  shippingMethod: string;
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

export interface Activity {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  kind: "order" | "stock" | "customer" | "product" | "system";
}
