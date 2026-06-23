export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  width: number;
  height: number;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  popular: boolean;
  bestValue: boolean;
  type: 'classes' | 'membership';
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export interface ContactInfo {
  id: string;
  address: string;
  phone: string[];
  email: string;
  socialLinks: { platform: string; url: string }[];
  workingHours: string;
}

export interface Retreat {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  features: string[];
  published: boolean;
  createdAt: string;
}

export interface HomepageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  published: boolean;
}

export interface TeacherTraining {
  id: string;
  title: string;
  description: string;
  curriculum: string[];
  duration: string;
  price: number;
  currency: string;
  certification: string;
  features: string[];
  published: boolean;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type AdminSection = 'blogs' | 'testimonials' | 'gallery' | 'services' | 'pricing' | 'memberships' | 'contact' | 'faq' | 'retreats';
