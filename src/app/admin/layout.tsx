'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Star,
  Image,
  Briefcase,
  DollarSign,
  Users,
  Phone,
  HelpCircle,
  Palmtree,
  LogOut,
  Menu,
  X,
  Wallet,
  MessageSquare,
  ShoppingBag,
  Package,
  Truck,
  Tags,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Blogs', href: '/admin/blogs', icon: FileText },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { label: 'Memberships', href: '/admin/memberships', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: Wallet },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Contact', href: '/admin/contact', icon: HelpCircle },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Retreats', href: '/admin/retreats', icon: Palmtree },
  { label: 'Shop Overview', href: '/admin/shop', icon: ShoppingBag },
  { label: 'Products', href: '/admin/shop/products', icon: Package },
  { label: 'Orders', href: '/admin/shop/orders', icon: Truck },
  { label: 'Coupons', href: '/admin/shop/coupons', icon: Tags },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!authenticated && pathname !== '/admin') {
      router.replace('/admin');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.replace('/admin');
  };

  if (!checked && pathname !== '/admin') return null;

  const pageTitle = navItems.find((item) => item.href === pathname)?.label ?? 'Admin';

  return (
    <div className="flex h-screen bg-ivory">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col gradient-primary transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="text-white font-serif text-lg tracking-wider">
            MYSTIC YOGA<sup className="text-gold text-xs">™</sup>
            <span className="block text-xs text-gold font-sans tracking-widest uppercase">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-ivory/60 hover:text-ivory lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-ivory/60 hover:text-ivory hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-ivory/60 hover:text-gold hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-ivory/80 backdrop-blur-md border-b border-beige">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-wine/60 hover:text-wine lg:hidden"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-serif text-gradient-wine-purple">{pageTitle}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
