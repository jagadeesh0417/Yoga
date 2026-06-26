const API_BASE = process.env.NEXT_PUBLIC_SHOP_API_URL || "http://localhost:4000/api";

const DEMO_PRODUCTS = [
  {
    id: "1", name: "Premium Yoga Mat", slug: "premium-yoga-mat",
    description: "Extra thick, eco-friendly premium yoga mat with alignment lines. Made from natural tree rubber with a microfiber top layer for superior grip in all conditions.",
    price: 89, compareAtPrice: 120, currency: "USD",
    images: ["/images/shop/mat-1.jpg", "/images/shop/mat-2.jpg"],
    category: "Equipment", rating: 4.8, reviewCount: 124,
    stock: 50, tags: ["bestseller", "featured"],
    benefits: ["Superior cushioning for joints", "Non-slip surface for all yoga styles", "Eco-friendly materials"],
    specifications: [{ label: "Material", value: "Natural Tree Rubber + Microfiber" }, { label: "Thickness", value: "6mm" }, { label: "Weight", value: "2.5 kg" }],
    isNew: false, createdAt: "2025-01-15",
  },
  {
    id: "2", name: "Meditation Cushion Set", slug: "meditation-cushion-set",
    description: "Luxurious meditation cushion set with supportive buckwheat filling. Elevate your meditation practice with proper spinal alignment.",
    price: 65, compareAtPrice: 85, currency: "USD",
    images: ["/images/shop/cushion-1.jpg"], category: "Meditation",
    rating: 4.9, reviewCount: 89, stock: 35,
    tags: ["featured", "new"], benefits: ["Promotes proper posture", "Handcrafted premium fabric", "Removable cover for easy washing"],
    specifications: [{ label: "Material", value: "Cotton + Buckwheat Hulls" }, { label: "Dimensions", value: "15 x 15 x 6 inches" }],
    isNew: true, createdAt: "2025-06-01",
  },
  {
    id: "3", name: "Aromatherapy Oil Set", slug: "aromatherapy-oil-set",
    description: "Collection of 5 pure essential oils for your yoga and meditation practice. Includes lavender, eucalyptus, peppermint, frankincense, and tea tree.",
    price: 45, compareAtPrice: 0, currency: "USD",
    images: ["/images/shop/oils-1.jpg"], category: "Wellness",
    rating: 4.7, reviewCount: 56, stock: 100,
    tags: ["new"], benefits: ["100% pure essential oils", "Therapeutic grade", "Beautiful gift packaging"],
    specifications: [{ label: "Volume", value: "10ml each" }, { label: "Origin", value: "India" }],
    isNew: true, createdAt: "2025-05-20",
  },
  {
    id: "4", name: "Yoga Block Set", slug: "yoga-block-set",
    description: "Set of 2 high-density foam yoga blocks for support and alignment. Perfect for beginners and advanced practitioners alike.",
    price: 25, compareAtPrice: 35, currency: "USD",
    images: ["/images/shop/blocks-1.jpg"], category: "Equipment",
    rating: 4.6, reviewCount: 210, stock: 200,
    tags: ["bestseller"], benefits: ["Lightweight and durable", "Supportive for all poses", "Comes in pairs"],
    specifications: [{ label: "Material", value: "High-density EVA Foam" }, { label: "Dimensions", value: "9 x 6 x 4 inches" }],
    isNew: false, createdAt: "2025-02-10",
  },
  {
    id: "5", name: "Yoga Strap", slug: "yoga-strap",
    description: "Cotton yoga strap with D-ring buckle for deep stretching and alignment support.",
    price: 18, compareAtPrice: 0, currency: "USD",
    images: ["/images/shop/strap-1.jpg"], category: "Equipment",
    rating: 4.5, reviewCount: 78, stock: 150,
    tags: [], benefits: ["Increases flexibility", "Durable cotton material", "Adjustable D-ring buckle"],
    specifications: [{ label: "Length", value: "8 feet" }, { label: "Material", value: "Cotton" }],
    isNew: false, createdAt: "2025-03-05",
  },
  {
    id: "6", name: "Chakra Balancing Kit", slug: "chakra-balancing-kit",
    description: "Complete chakra healing set with 7 tumbled stones, a guidebook, and a storage pouch. Harmonize your energy centers.",
    price: 55, compareAtPrice: 70, currency: "USD",
    images: ["/images/shop/chakra-1.jpg"], category: "Wellness",
    rating: 4.8, reviewCount: 43, stock: 0,
    tags: [], benefits: ["7 genuine gemstones", "Includes guidebook", "Beautiful gift box"],
    specifications: [{ label: "Stones", value: "7 chakra stones" }, { label: "Pouch", value: "Velvet storage pouch" }],
    isNew: false, createdAt: "2025-04-12",
  },
  {
    id: "7", name: "Organic Cotton Yoga Wear Set", slug: "organic-yoga-wear-set",
    description: "Sustainable organic cotton yoga outfit. Breathable, moisture-wicking fabric for maximum comfort during practice.",
    price: 79, compareAtPrice: 110, currency: "USD",
    images: ["/images/shop/wear-1.jpg"], category: "Apparel",
    rating: 4.7, reviewCount: 167, stock: 25,
    tags: ["bestseller", "featured"], benefits: ["GOTS certified organic cotton", "Four-way stretch", "Eco-friendly dyes"],
    specifications: [{ label: "Material", value: "95% Organic Cotton, 5% Elastane" }, { label: "Sizes", value: "XS-XL" }],
    isNew: false, createdAt: "2025-01-28",
  },
  {
    id: "8", name: "Incense Stick Collection", slug: "incense-stick-collection",
    description: "Hand-rolled natural incense sticks in 6 calming fragrances. Perfect for creating a serene meditation space.",
    price: 22, compareAtPrice: 0, currency: "USD",
    images: ["/images/shop/incense-1.jpg"], category: "Wellness",
    rating: 4.4, reviewCount: 92, stock: 300,
    tags: ["new"], benefits: ["Natural plant-based ingredients", "Long-lasting fragrance", "Hand-rolled in India"],
    specifications: [{ label: "Fragrances", value: "6 varieties" }, { label: "Stick count", value: "120 sticks" }],
    isNew: true, createdAt: "2025-06-10",
  },
];

const DEMO_CATEGORIES = [
  { id: "1", name: "All Products", slug: "all" },
  { id: "2", name: "Equipment", slug: "equipment" },
  { id: "3", name: "Meditation", slug: "meditation" },
  { id: "4", name: "Wellness", slug: "wellness" },
  { id: "5", name: "Apparel", slug: "apparel" },
];

const DEMO_ORDERS = [
  {
    id: "ord_001", orderId: "MYSTIC-20250601-001",
    items: [{ productId: "1", name: "Premium Yoga Mat", price: 89, quantity: 1, image: "/images/shop/mat-1.jpg" }],
    subtotal: 89, discount: 0, shipping: 10, total: 99,
    status: "delivered", paymentStatus: "paid", paymentMethod: "razorpay",
    shippingAddress: { name: "John Doe", phone: "+1234567890", line1: "123 Wellness St", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    createdAt: "2025-06-01T10:00:00Z", deliveredAt: "2025-06-05T14:00:00Z",
    coupon: null,
  },
  {
    id: "ord_002", orderId: "MYSTIC-20250615-002",
    items: [{ productId: "2", name: "Meditation Cushion Set", price: 65, quantity: 1, image: "/images/shop/cushion-1.jpg" }],
    subtotal: 65, discount: 5, shipping: 0, total: 60,
    status: "processing", paymentStatus: "paid", paymentMethod: "razorpay",
    shippingAddress: { name: "John Doe", phone: "+1234567890", line1: "123 Wellness St", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    createdAt: "2025-06-15T10:00:00Z", deliveredAt: null,
    coupon: { code: "WELCOME5", discount: 5 },
  },
];

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
      { id: "ci_1", productId: "1", name: "Premium Yoga Mat", price: 89, quantity: 1, image: "/images/shop/mat-1.jpg", slug: "premium-yoga-mat", stock: 50 },
      { id: "ci_2", productId: "2", name: "Meditation Cushion Set", price: 65, quantity: 2, image: "/images/shop/cushion-1.jpg", slug: "meditation-cushion-set", stock: 35 },
    ],
    subtotal: 219, discount: 0, shipping: 10, total: 229, coupon: null,
  };
}

function getDemoWishlist() {
  return DEMO_PRODUCTS.filter((p) => ["1", "4", "7"].includes(p.id)).map((p) => ({ ...p, inWishlist: true }));
}

function simulateNetwork<T>(data: T): Promise<T> {
  return delay(500).then(() => {
    if (Math.random() < 0.05) throw new Error("Simulated server error");
    return data;
  });
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

  getProduct: async (slug: string) => {
    try {
      const res = await fetchApi(`/products/${slug}`);
      return res;
    } catch {
      const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
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
};
