import type {
  Activity,
  Customer,
  Order,
  OrderStatus,
  Product,
  ProductCategory,
} from "./types";

// -------------------- PRODUCTS --------------------

const productCatalog: Array<Omit<Product, "id" | "status" | "createdAt">> = [
  { name: "Hybrid Maize Seeds — Zea AX-500", sku: "SEED-MAZ-500", category: "seeds", price: 85, cost: 52, stock: 1240, reorderPoint: 300, unit: "kg", supplier: "AgriGen Co." },
  { name: "NPK 20-10-10 Fertilizer", sku: "FERT-NPK-201010", category: "fertilizer", price: 42, cost: 28, stock: 860, reorderPoint: 200, unit: "bag", supplier: "GreenField Chem" },
  { name: "Organic Compost Premium", sku: "FERT-ORG-PREM", category: "fertilizer", price: 28, cost: 14, stock: 1520, reorderPoint: 400, unit: "bag", supplier: "EarthRoot Ltd." },
  { name: "Urea 46% Nitrogen", sku: "FERT-URE-46", category: "fertilizer", price: 38, cost: 24, stock: 420, reorderPoint: 250, unit: "bag", supplier: "GreenField Chem" },
  { name: "Cassava Stem Cuttings — TME-7", sku: "SEED-CAS-TME7", category: "seeds", price: 12, cost: 6, stock: 4800, reorderPoint: 1000, unit: "bundle", supplier: "Cassava Coop" },
  { name: "Rice Paddy Seeds — Basmati 370", sku: "SEED-RIC-B370", category: "seeds", price: 64, cost: 38, stock: 320, reorderPoint: 400, unit: "kg", supplier: "PaddyPro" },
  { name: "Tomato Seeds — Roma VF", sku: "SEED-TOM-RVF", category: "seeds", price: 110, cost: 72, stock: 180, reorderPoint: 60, unit: "pack", supplier: "HortiSeeds" },
  { name: "Glyphosate 48% Herbicide", sku: "PEST-GLY-48", category: "pesticide", price: 55, cost: 36, stock: 640, reorderPoint: 200, unit: "L", supplier: "CropGuard" },
  { name: "Neem Oil Bio-Pesticide", sku: "PEST-NEEM-05", category: "pesticide", price: 32, cost: 18, stock: 520, reorderPoint: 150, unit: "L", supplier: "BioFarm" },
  { name: "Broad Spectrum Fungicide", sku: "PEST-FUNG-BS", category: "pesticide", price: 48, cost: 30, stock: 95, reorderPoint: 150, unit: "L", supplier: "CropGuard" },
  { name: "Hand-Held Seed Drill", sku: "EQP-DRILL-HH", category: "equipment", price: 145, cost: 92, stock: 48, reorderPoint: 20, unit: "unit", supplier: "FarmTools Inc." },
  { name: "Backpack Sprayer 16L", sku: "EQP-SPR-16L", category: "equipment", price: 75, cost: 48, stock: 132, reorderPoint: 50, unit: "unit", supplier: "FarmTools Inc." },
  { name: "Drip Irrigation Kit (100m)", sku: "EQP-DRIP-100", category: "equipment", price: 220, cost: 142, stock: 64, reorderPoint: 25, unit: "kit", supplier: "AquaFlow" },
  { name: "Solar Water Pump 2HP", sku: "EQP-PUMP-2HP", category: "equipment", price: 1850, cost: 1240, stock: 14, reorderPoint: 10, unit: "unit", supplier: "SunAgri" },
  { name: "Layer Chicken Feed — Grower", sku: "FEED-CHK-GRW", category: "feed", price: 34, cost: 22, stock: 780, reorderPoint: 300, unit: "bag", supplier: "NutriFeed" },
  { name: "Dairy Cattle Concentrate", sku: "FEED-CAT-CON", category: "feed", price: 58, cost: 38, stock: 0, reorderPoint: 200, unit: "bag", supplier: "NutriFeed" },
  { name: "Tilapia Fish Feed 3mm", sku: "FEED-FSH-03", category: "feed", price: 72, cost: 48, stock: 340, reorderPoint: 150, unit: "bag", supplier: "AquaFeed" },
  { name: "Dried Cocoa Beans — Grade A", sku: "HRV-COC-GA", category: "harvest", price: 285, cost: 210, stock: 240, reorderPoint: 80, unit: "bag", supplier: "Cocoa Farmers Union" },
  { name: "Shea Nuts — Sorted", sku: "HRV-SHE-ST", category: "harvest", price: 145, cost: 95, stock: 180, reorderPoint: 60, unit: "bag", supplier: "Shea Collectors" },
  { name: "Cashew Raw Nuts Export", sku: "HRV-CSH-EX", category: "harvest", price: 320, cost: 245, stock: 96, reorderPoint: 80, unit: "bag", supplier: "Cashew Growers" },
];

function statusFromStock(stock: number, reorder: number): Product["status"] {
  if (stock === 0) return "out_of_stock";
  if (stock <= reorder) return "low_stock";
  return "in_stock";
}

export const products: Product[] = productCatalog.map((p, i) => ({
  id: `p_${String(i + 1).padStart(3, "0")}`,
  ...p,
  status: statusFromStock(p.stock, p.reorderPoint),
  createdAt: new Date(2026, 0, 4 + i * 2).toISOString(),
}));

// -------------------- CUSTOMERS --------------------

const customerSeed: Array<Omit<Customer, "id" | "totalOrders" | "totalSpent" | "joinedAt">> = [
  { name: "Kwame Mensah", email: "kwame.mensah@farmgh.com", phone: "+233 24 555 0123", tier: "farmer", location: "Kumasi", country: "Ghana", farmSize: "12 ha", primaryCrop: "Cocoa" },
  { name: "Amara Diallo", email: "amara@sahelcoop.sn", phone: "+221 77 234 8812", tier: "cooperative", location: "Dakar", country: "Senegal", farmSize: "340 ha (coop)", primaryCrop: "Peanut" },
  { name: "GreenLeaf Distributors", email: "orders@greenleaf.co.ke", phone: "+254 711 998 450", tier: "distributor", location: "Nairobi", country: "Kenya" },
  { name: "Chidi Okonkwo", email: "chidi.o@nigerianfarms.ng", phone: "+234 803 221 6633", tier: "farmer", location: "Enugu", country: "Nigeria", farmSize: "8 ha", primaryCrop: "Cassava" },
  { name: "Harvest Hub Retail", email: "buy@harvesthub.tz", phone: "+255 754 678 920", tier: "retailer", location: "Arusha", country: "Tanzania" },
  { name: "Fatoumata Traoré", email: "fatou.t@malifarms.ml", phone: "+223 65 102 334", tier: "farmer", location: "Sikasso", country: "Mali", farmSize: "5 ha", primaryCrop: "Cotton" },
  { name: "AgriCorp Uganda", email: "sales@agricorp.ug", phone: "+256 752 445 001", tier: "distributor", location: "Kampala", country: "Uganda" },
  { name: "Mmabatho Nkosi", email: "m.nkosi@karoofarm.co.za", phone: "+27 82 334 1208", tier: "farmer", location: "Free State", country: "South Africa", farmSize: "220 ha", primaryCrop: "Maize" },
  { name: "Savana Harvest Coop", email: "info@savanacoop.bf", phone: "+226 70 885 220", tier: "cooperative", location: "Bobo-Dioulasso", country: "Burkina Faso", farmSize: "180 ha (coop)", primaryCrop: "Sorghum" },
  { name: "Farmline Retail", email: "contact@farmline.rw", phone: "+250 788 330 114", tier: "retailer", location: "Kigali", country: "Rwanda" },
  { name: "Ibrahim Njie", email: "ibrahim.njie@gambia.gm", phone: "+220 770 1244", tier: "farmer", location: "Banjul", country: "Gambia", farmSize: "3 ha", primaryCrop: "Rice" },
  { name: "Zipline Agri Supplies", email: "orders@ziplineagri.ci", phone: "+225 07 998 6611", tier: "distributor", location: "Abidjan", country: "Côte d'Ivoire" },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const customers: Customer[] = customerSeed.map((c, i) => {
  const rand = seededRandom(i + 7);
  const orders = Math.floor(rand() * 40) + 3;
  const spent = Math.floor(rand() * 80000) + 1200;
  return {
    id: `c_${String(i + 1).padStart(3, "0")}`,
    ...c,
    totalOrders: orders,
    totalSpent: spent,
    joinedAt: new Date(
      2024 + Math.floor(rand() * 2),
      Math.floor(rand() * 12),
      Math.floor(rand() * 27) + 1
    ).toISOString(),
  };
});

// -------------------- ORDERS --------------------

// Stable anchor so SSR + client produce identical dates — prevents hydration drift.
const NOW = new Date("2026-04-20T10:00:00.000Z").getTime();

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "delivered", "delivered", "cancelled"];

export const orders: Order[] = Array.from({ length: 28 }).map((_, i) => {
  const rand = seededRandom(i + 13);
  const customer = customers[Math.floor(rand() * customers.length)];
  const itemCount = Math.floor(rand() * 4) + 1;
  const items = Array.from({ length: itemCount }).map(() => {
    const p = products[Math.floor(rand() * products.length)];
    const qty = Math.floor(rand() * 8) + 1;
    return { productId: p.id, name: p.name, qty, price: p.price };
  });
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const status = statuses[Math.floor(rand() * statuses.length)];
  const placedAt = new Date(
    NOW - Math.floor(rand() * 40) * 24 * 60 * 60 * 1000
  ).toISOString();
  return {
    id: `o_${String(i + 1).padStart(4, "0")}`,
    reference: `ADX-${2040 + i}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    status,
    total,
    items,
    placedAt,
    deliveryAddress: `${customer.location}, ${customer.country}`,
    paymentMethod: ["Mobile Money", "Bank Transfer", "Card", "Cash on Delivery"][Math.floor(rand() * 4)],
    shippingMethod: ["Standard Truck", "Express Courier", "Regional Depot Pickup"][Math.floor(rand() * 3)],
    notes: rand() > 0.7 ? "Deliver before 10 AM. Call on arrival." : undefined,
  };
});

// -------------------- ACTIVITY --------------------

export const activities: Activity[] = [
  { id: "a1", actor: "Kwame Mensah", action: "placed an order for", target: "NPK 20-10-10 × 20 bags", timestamp: new Date(NOW - 2 * 60 * 1000).toISOString(), kind: "order" },
  { id: "a2", actor: "System", action: "flagged low stock on", target: "Rice Paddy Seeds — Basmati 370", timestamp: new Date(NOW - 38 * 60 * 1000).toISOString(), kind: "stock" },
  { id: "a3", actor: "Amara Diallo", action: "registered as new", target: "Cooperative customer", timestamp: new Date(NOW - 3 * 60 * 60 * 1000).toISOString(), kind: "customer" },
  { id: "a4", actor: "Mmabatho Nkosi", action: "completed payment for", target: "Order ADX-2047", timestamp: new Date(NOW - 5 * 60 * 60 * 1000).toISOString(), kind: "order" },
  { id: "a5", actor: "Warehouse", action: "restocked", target: "Hybrid Maize Seeds +600kg", timestamp: new Date(NOW - 9 * 60 * 60 * 1000).toISOString(), kind: "stock" },
  { id: "a6", actor: "Chidi Okonkwo", action: "reviewed", target: "Cassava Stem Cuttings", timestamp: new Date(NOW - 22 * 60 * 60 * 1000).toISOString(), kind: "product" },
  { id: "a7", actor: "System", action: "generated weekly", target: "sales report", timestamp: new Date(NOW - 26 * 60 * 60 * 1000).toISOString(), kind: "system" },
];

// -------------------- CHART DATA --------------------

export const salesSeries = [
  { month: "Jan", revenue: 42000, orders: 320 },
  { month: "Feb", revenue: 48500, orders: 362 },
  { month: "Mar", revenue: 53200, orders: 410 },
  { month: "Apr", revenue: 61000, orders: 455 },
  { month: "May", revenue: 74800, orders: 540 },
  { month: "Jun", revenue: 82400, orders: 598 },
  { month: "Jul", revenue: 79600, orders: 572 },
  { month: "Aug", revenue: 88200, orders: 634 },
  { month: "Sep", revenue: 96100, orders: 702 },
  { month: "Oct", revenue: 104300, orders: 768 },
  { month: "Nov", revenue: 118500, orders: 845 },
  { month: "Dec", revenue: 132800, orders: 948 },
];

export const categoryBreakdown: Array<{
  name: string;
  value: number;
  category: ProductCategory;
}> = [
  { name: "Seeds", value: 28, category: "seeds" },
  { name: "Fertilizer", value: 34, category: "fertilizer" },
  { name: "Pesticide", value: 12, category: "pesticide" },
  { name: "Equipment", value: 11, category: "equipment" },
  { name: "Animal Feed", value: 9, category: "feed" },
  { name: "Harvest", value: 6, category: "harvest" },
];

export const stockLevels = [
  { name: "Seeds", current: 6540, target: 8000 },
  { name: "Fertilizer", current: 2800, target: 3500 },
  { name: "Pesticide", current: 1255, target: 2000 },
  { name: "Equipment", current: 258, target: 300 },
  { name: "Feed", current: 1120, target: 1800 },
  { name: "Harvest", current: 516, target: 700 },
];

export const regionPerformance = [
  { region: "West Africa", revenue: 342000, growth: 18.2 },
  { region: "East Africa", revenue: 281500, growth: 12.4 },
  { region: "Southern Africa", revenue: 198400, growth: 9.1 },
  { region: "Central Africa", revenue: 124900, growth: 22.6 },
  { region: "North Africa", revenue: 96200, growth: 6.8 },
];

export const weeklyOperations = [
  { day: "Mon", orders: 82, deliveries: 68, returns: 3 },
  { day: "Tue", orders: 95, deliveries: 74, returns: 2 },
  { day: "Wed", orders: 102, deliveries: 88, returns: 5 },
  { day: "Thu", orders: 118, deliveries: 96, returns: 4 },
  { day: "Fri", orders: 134, deliveries: 112, returns: 6 },
  { day: "Sat", orders: 98, deliveries: 84, returns: 2 },
  { day: "Sun", orders: 54, deliveries: 46, returns: 1 },
];
