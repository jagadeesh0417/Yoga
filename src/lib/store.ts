const g = globalThis as Record<string, unknown>;

export interface StoredService {
  id: string;
  title: string;
  slug: string;
  description: string;
  price?: number;
  duration?: string;
  published?: boolean;
  order?: number;
  [key: string]: unknown;
}

export interface StoredEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string;
  createdAt: string;
}

export interface StoredPayment {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  plan: string;
  paymentMethod: string;
  reference: string;
  message?: string | null;
  screenshot?: string | null;
  status: string;
  createdAt: string;
}

export interface StoredContact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  createdAt: string;
}

export interface StoredBooking {
  id: string;
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes?: string | null;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

export interface StoredBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: string;
  createdAt: string;
}

export interface StoredGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  featured: boolean;
  order: number;
}

export interface StoredTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

export interface StoredMembership {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular: boolean;
  published: boolean;
  stripePriceId: string;
}

function initStore() {
  if (!g.__store) {
    g.__store = {
      services: [
        { id: "1", title: "Personal Yoga Training", slug: "personal-yoga-training", description: "One-on-one personalized yoga sessions tailored to your body, goals, and schedule.", price: 150, duration: "60 min", published: true, order: 1 },
        { id: "2", title: "Meditation & Mindfulness", slug: "meditation-mindfulness", description: "Guided meditation sessions to reduce stress, improve focus, and cultivate inner peace.", price: 120, duration: "45 min", published: true, order: 2 },
        { id: "3", title: "Corporate Wellness Program", slug: "corporate-wellness", description: "Comprehensive wellness programs for organizations.", price: 500, duration: "90 min", published: true, order: 3 },
        { id: "4", title: "Women's Wellness Retreat", slug: "womens-wellness", description: "Holistic wellness retreats designed exclusively for women.", price: 300, duration: "Half Day", published: true, order: 4 },
        { id: "5", title: "Online Classes", slug: "online-classes", description: "Live interactive yoga and meditation classes from the comfort of your home.", price: 80, duration: "45 min", published: true, order: 5 },
        { id: "6", title: "Luxury Wellness Retreat", slug: "luxury-retreat", description: "Premium transformative retreat experiences in breathtaking locations.", price: 1500, duration: "3 Days", published: true, order: 6 },
      ] as StoredService[],
      servicesNextId: 7,
      enquiries: [] as StoredEnquiry[],
      enquiriesNextId: 1,
      payments: [] as StoredPayment[],
      paymentsNextId: 1,
      contacts: [] as StoredContact[],
      contactsNextId: 1,
      bookings: [] as StoredBooking[],
      bookingsNextId: 1,
      blogs: [] as StoredBlog[],
      blogsNextId: 1,
      gallery: [] as StoredGalleryItem[],
      galleryNextId: 1,
      testimonials: [
        { id: "1", name: "Priya Sharma", location: "Mumbai, India", rating: 5, text: "MYSTIC YOGA transformed my life. Sunita's guidance helped me find balance and inner peace I never knew existed.", image: "", featured: true, createdAt: new Date().toISOString() },
        { id: "2", name: "Arun Mehta", location: "Delhi, India", rating: 5, text: "The corporate wellness program was incredible. Our team's productivity and morale improved significantly.", image: "", featured: true, createdAt: new Date().toISOString() },
      ] as StoredTestimonial[],
      testimonialsNextId: 3,
      orders: [] as Record<string, unknown>[],
      memberships: [
        { id: "1", name: "Starter", price: 29, interval: "month", features: ["Weekly yoga classes", "Basic meditation guides", "Community access"], popular: false, published: true, stripePriceId: "" },
        { id: "2", name: "Wellness", price: 59, interval: "month", features: ["Unlimited yoga classes", "Personalized meditation", "Nutrition guidance", "Priority support"], popular: true, published: true, stripePriceId: "" },
        { id: "3", name: "Premium", price: 99, interval: "month", features: ["Everything in Wellness", "1-on-1 coaching", "Retreat discounts", "VIP community", "Exclusive workshops"], popular: false, published: true, stripePriceId: "" },
      ] as StoredMembership[],
      membershipsNextId: 4,
    };
  }
  return g.__store as {
    services: StoredService[];
    servicesNextId: number;
    enquiries: StoredEnquiry[];
    enquiriesNextId: number;
    payments: StoredPayment[];
    paymentsNextId: number;
    contacts: StoredContact[];
    contactsNextId: number;
    bookings: StoredBooking[];
    bookingsNextId: number;
    blogs: StoredBlog[];
    blogsNextId: number;
    gallery: StoredGalleryItem[];
    galleryNextId: number;
    testimonials: StoredTestimonial[];
    testimonialsNextId: number;
    memberships: StoredMembership[];
    membershipsNextId: number;
    orders: Record<string, unknown>[];
  };
}

export const store = initStore();
