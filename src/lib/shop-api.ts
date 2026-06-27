const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || "http://localhost:4000/api";

const DEMO_PRODUCTS = [
  {
    id: "9", name: "Quantum Cure™", slug: "quantum-cure",
    description: "Premium concentrated black water crafted for individuals who seek elevated living, vitality, and sophistication.",
    price: 399, compareAtPrice: 499, currency: "HKD",
    images: ["/images/product1.png"],
    category: "Wellness", rating: 5.0, reviewCount: 12,
    stock: 100, tags: ["premium", "new"],
    benefits: ["Premium Concentrated Formula", "Elegant Matte Black Packaging", "Convenient Dropper Application", "Luxury Wellness Experience", "Scientifically Inspired Design", "Compact 50ml Premium Bottle"],
    specifications: [
      { label: "Product Name", value: "Quantum Cure™" },
      { label: "Category", value: "Premium Wellness" },
      { label: "Volume", value: "50ml" },
      { label: "Type", value: "Concentrated Black Water" },
      { label: "Packaging", value: "Frosted Black Glass Bottle" },
      { label: "Cap", value: "Gold Premium Dropper" },
      { label: "Shelf Life", value: "24 Months" },
    ],
    isNew: true, createdAt: "2025-06-27",
  },
  {
    id: "10", name: "Quantum Health™", slug: "quantum-health",
    description: "Premium wellness formula for individuals seeking balance, confidence, and radiant living. Purify, sculpt, and glow.",
    price: 599, compareAtPrice: 0, currency: "HKD",
    images: ["/images/product2.png"],
    category: "Wellness", rating: 5.0, reviewCount: 8,
    stock: 100, tags: ["premium", "new"],
    benefits: ["Premium Quality Formula", "Supports Healthy Lifestyle Goals", "Natural Ingredient Inspired", "Beauty & Wellness Focused", "Elegant Luxury Packaging", "Daily Wellness Support", "Designed for Modern Living", "Advanced Wellness Experience"],
    specifications: [
      { label: "Product Name", value: "Quantum Health™" },
      { label: "Tagline", value: "Purify • Sculpt • Glow" },
      { label: "Category", value: "Premium Wellness" },
      { label: "Packaging", value: "Luxury Matte Black Jar" },
      { label: "Formula", value: "Advanced Wellness Blend" },
      { label: "Quality", value: "Premium Grade" },
      { label: "Price", value: "HKD 599" },
    ],
    isNew: true, createdAt: "2025-06-27",
  },
];

const DEMO_CATEGORIES = [
  { id: "1", name: "All Products", slug: "all" },
  { id: "2", name: "Wellness", slug: "wellness" },
];

const DEMO_ORDERS: {
  id: string; orderId: string;
  items: { productId: string; name: string; price: number; quantity: number; image: string }[];
  subtotal: number; discount: number; shipping: number; total: number;
  status: string; paymentStatus: string; paymentMethod: string;
  shippingAddress: { name: string; phone: string; line1: string; city: string; state: string; pincode: string };
  createdAt: string; deliveredAt: string | null;
  coupon: { code: string; discount: number } | null;
}[] = [];

const DEMO_USER = {
  id: "user_1", name: "John Doe", email: "john@example.com", phone: "+1234567890",
  addresses: [
    { id: "addr_1", name: "John Doe", phone: "+1234567890", line1: "123 Wellness St", city: "Mumbai", state: "Maharashtra", pincode: "400001", isDefault: true },
    { id: "addr_2", name: "John Doe", phone: "+1234567890", line1: "456 Yoga Ave", city: "Pune", state: "Maharashtra", pincode: "411001", isDefault: false },
  ],
};

async function fetchApi(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("shop_token") : null;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      signal: controller.signal,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  } catch {
    clearTimeout(timeoutId);
    throw new Error("NETWORK_ERROR");
  }
}

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getDemoCart() {
  return {
    items: [
      { id: "ci_1", productId: "9", name: "Quantum Cure™", price: 399, quantity: 1, image: "/images/product1.png", slug: "quantum-cure", stock: 100 },
    ],
    subtotal: 399, discount: 0, shipping: 0, total: 399, coupon: null,
  };
}

function getDemoWishlist() {
  return DEMO_PRODUCTS.map((p) => ({ ...p, inWishlist: true }));
}

function simulateNetwork<T>(data: T): Promise<T> {
  return delay(500).then(() => data);
}

export const shopApi = {
  getProducts: async (params?: string) => {
    try {
      const res = await fetchApi(`/products${params ? `?${params}` : ""}`);
      return res;
    } catch {
      let filtered = [...DEMO_PRODUCTS];
      if (params) {
        const searchParams = new URLSearchParams(params);
        const category = searchParams.get("category");
        const tag = searchParams.get("tag");
        if (category && category !== "all") filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        if (tag) filtered = filtered.filter((p) => p.tags.includes(tag));
      }
      return simulateNetwork({ products: filtered, total: filtered.length });
    }
  },

  getProduct: async (idOrSlug: string) => {
    try {
      const res = await fetchApi(`/products/${idOrSlug}`);
      return res;
    } catch {
      const product = DEMO_PRODUCTS.find((p) => p.slug === idOrSlug || p.id === idOrSlug);
      if (!product) throw new Error("Product not found");
      const related = DEMO_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
      return simulateNetwork({ product, related });
    }
  },

  getCategories: async () => {
    try {
      return await fetchApi("/categories");
    } catch {
      return simulateNetwork({ categories: DEMO_CATEGORIES });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await fetchApi("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      return res;
    } catch {
      return simulateNetwork({ token: "demo_token_" + Date.now(), user: DEMO_USER });
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      return await fetchApi("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    } catch {
      return simulateNetwork({ token: "demo_token_" + Date.now(), user: { ...DEMO_USER, name, email } });
    }
  },

  getMe: async () => {
    try {
      return await fetchApi("/auth/me");
    } catch {
      const token = typeof window !== "undefined" ? localStorage.getItem("shop_token") : null;
      if (!token) throw new Error("Not authenticated");
      return simulateNetwork({ user: DEMO_USER });
    }
  },

  getCart: async () => {
    try {
      return await fetchApi("/cart");
    } catch {
      return simulateNetwork(getDemoCart());
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    try {
      return await fetchApi("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) });
    } catch {
      return simulateNetwork({ success: true, cart: getDemoCart() });
    }
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    try {
      return await fetchApi(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) });
    } catch {
      return simulateNetwork({ success: true, cart: getDemoCart() });
    }
  },

  removeCartItem: async (itemId: string) => {
    try {
      return await fetchApi(`/cart/${itemId}`, { method: "DELETE" });
    } catch {
      return simulateNetwork({ success: true, cart: { ...getDemoCart(), items: getDemoCart().items.filter((i) => i.id !== itemId) } });
    }
  },

  clearCart: async () => {
    try {
      return await fetchApi("/cart", { method: "DELETE" });
    } catch {
      return simulateNetwork({ success: true });
    }
  },

  createOrder: async (data: Record<string, unknown>) => {
    try {
      return await fetchApi("/orders", { method: "POST", body: JSON.stringify(data) });
    } catch {
      return simulateNetwork({
        success: true,
        order: { ...DEMO_ORDERS[1], id: "ord_" + Date.now(), orderId: "MYSTIC-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"), ...data, createdAt: new Date().toISOString() },
        razorpay_order_id: "order_" + Date.now(),
      });
    }
  },

  verifyPayment: async (data: Record<string, unknown>) => {
    try {
      return await fetchApi("/orders/verify-payment", { method: "POST", body: JSON.stringify(data) });
    } catch {
      return simulateNetwork({ success: true, order: DEMO_ORDERS[0] });
    }
  },

  getMyOrders: async () => {
    try {
      return await fetchApi("/orders");
    } catch {
      return simulateNetwork(DEMO_ORDERS);
    }
  },

  getOrder: async (id: string) => {
    try {
      return await fetchApi(`/orders/${id}`);
    } catch {
      const order = DEMO_ORDERS.find((o) => o.id === id || o.orderId === id);
      if (!order) throw new Error("Order not found");
      return simulateNetwork({ order });
    }
  },

  getWishlist: async () => {
    try {
      return await fetchApi("/wishlist");
    } catch {
      return simulateNetwork({ items: getDemoWishlist() });
    }
  },

  toggleWishlist: async (productId: string) => {
    try {
      return await fetchApi("/wishlist", { method: "POST", body: JSON.stringify({ productId }) });
    } catch {
      return simulateNetwork({ success: true, inWishlist: true });
    }
  },

  verifyCoupon: async (code: string) => {
    try {
      return await fetchApi(`/coupons/verify/${code}`);
    } catch {
      const validCodes: Record<string, { discount: number; type: string }> = {
        WELCOME10: { discount: 10, type: "percentage" },
        YOGA20: { discount: 20, type: "percentage" },
        FREESHIP: { discount: 0, type: "free_shipping" },
      };
      const upper = code.toUpperCase();
      if (validCodes[upper]) {
        return simulateNetwork({ valid: true, code: upper, ...validCodes[upper], expiresAt: "2025-12-31" });
      }
      throw new Error("Invalid coupon code");
    }
  },

  getAddresses: async () => {
    try {
      return await fetchApi("/addresses");
    } catch {
      return simulateNetwork({ addresses: DEMO_USER.addresses });
    }
  },

  createAddress: async (data: Record<string, unknown>) => {
    try {
      return await fetchApi("/addresses", { method: "POST", body: JSON.stringify(data) });
    } catch {
      return simulateNetwork({ success: true, address: { id: "addr_" + Date.now(), ...data, isDefault: false } });
    }
  },

  updateAddress: async (id: string, data: Record<string, unknown>) => {
    try {
      return await fetchApi(`/addresses/${id}`, { method: "PUT", body: JSON.stringify(data) });
    } catch {
      return simulateNetwork({ success: true });
    }
  },

  deleteAddress: async (id: string) => {
    try {
      return await fetchApi(`/addresses/${id}`, { method: "DELETE" });
    } catch {
      return simulateNetwork({ success: true });
    }
  },

  createBuyNowOrder: async (data: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/orders/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      return await res.json();
    } catch {
      return simulateNetwork({
        success: true,
        order: { id: "ORD_" + Date.now(), orderId: "ORD_" + Date.now(), ...data, createdAt: new Date().toISOString() },
        razorpay_order_id: "order_" + Date.now(),
        amount: 100,
        currency: "INR",
      });
    }
  },

  verifyBuyNowPayment: async (data: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/orders/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      return await res.json();
    } catch {
      return simulateNetwork({ success: true });
    }
  },

  getAdminOrders: async (params?: string) => {
    try {
      const res = await fetch(`/api/admin/orders${params ? `?${params}` : ""}`);
      return await res.json();
    } catch {
      return simulateNetwork({ orders: [], total: 0 });
    }
  },

  updateAdminOrder: async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      return await res.json();
    } catch {
      return simulateNetwork({ success: true });
    }
  },
};
