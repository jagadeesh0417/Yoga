'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Star,
  Image as ImageIcon,
  Briefcase,
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  Plus,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

interface Stat {
  label: string;
  count: number;
  icon: ReactNode;
  href: string;
  color: string;
}

interface IBooking {
  id: string;
  title: string;
  user: { id: string; name: string | null; email: string | null } | null;
}

interface IMessage {
  id: string;
  name: string;
  message: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
  const [recentMessages, setRecentMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, blogsRes, testimonialsRes, galleryRes, servicesRes] =
          await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/blog'),
            fetch('/api/testimonials'),
            fetch('/api/gallery'),
            fetch('/api/services'),
          ]);

        if (!statsRes.ok && statsRes.status === 401) {
          router.replace('/admin');
          return;
        }

        const statsData = await statsRes.json();
        const blogs = await blogsRes.json();
        const testimonials = await testimonialsRes.json();
        const gallery = await galleryRes.json();
        const services = await servicesRes.json();

        setStats([
          { label: 'Total Users', count: statsData.totalUsers, icon: <Users className="text-wine" size={24} />, href: '#', color: 'text-wine' },
          { label: 'Total Bookings', count: statsData.totalBookings, icon: <Calendar className="text-gold" size={24} />, href: '#', color: 'text-gold' },
          { label: 'Total Courses', count: statsData.totalCourses, icon: <BookOpen className="text-wine" size={24} />, href: '#', color: 'text-wine' },
          { label: 'Revenue', count: statsData.totalRevenue, icon: <DollarSign className="text-gold" size={24} />, href: '#', color: 'text-gold' },
          { label: 'Blog Posts', count: Array.isArray(blogs) ? blogs.length : 0, icon: <FileText className="text-wine" size={24} />, href: '/admin/blogs', color: 'text-wine' },
          { label: 'Testimonials', count: Array.isArray(testimonials) ? testimonials.length : 0, icon: <Star className="text-gold" size={24} />, href: '/admin/testimonials', color: 'text-gold' },
          { label: 'Gallery Images', count: Array.isArray(gallery) ? gallery.length : 0, icon: <ImageIcon className="text-wine" size={24} />, href: '/admin/gallery', color: 'text-wine' },
          { label: 'Services', count: Array.isArray(services) ? services.length : 0, icon: <Briefcase className="text-gold" size={24} />, href: '/admin/services', color: 'text-gold' },
        ]);

        setRecentBookings(statsData.recentBookings || []);
        setRecentMessages(statsData.recentMessages || []);
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-gradient-wine-purple">
          Welcome to MYSTIC YOGA<sup className="text-gold text-sm">â„¢</sup> Admin
        </h2>
        <p className="text-wine/50 text-sm mt-1">
          Manage your luxury yoga brand from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {stat.icon}
                      <span className="text-2xl font-bold text-gradient-wine-purple">{stat.count}</span>
                    </div>
                    <p className="text-sm text-wine/60">{stat.label}</p>
                  </Link>
                ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/blogs"
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-beige hover:shadow-luxury transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center">
              <Plus className="text-wine" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-wine">Add New Blog</p>
              <p className="text-xs text-wine/50">Create a new blog post</p>
            </div>
          </div>
          <ArrowRight className="text-wine/30 group-hover:text-wine transition-colors" size={18} />
        </Link>

        <Link
          href="/admin/testimonials"
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-beige hover:shadow-luxury transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Plus className="text-gold" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-wine">Add Testimonial</p>
              <p className="text-xs text-wine/50">Share client feedback</p>
            </div>
          </div>
          <ArrowRight className="text-wine/30 group-hover:text-gold transition-colors" size={18} />
        </Link>

        <Link
          href="/admin/gallery"
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-beige hover:shadow-luxury transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center">
              <Plus className="text-wine" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-wine">Add Gallery Image</p>
              <p className="text-xs text-wine/50">Upload new photos</p>
            </div>
          </div>
          <ArrowRight className="text-wine/30 group-hover:text-wine transition-colors" size={18} />
        </Link>

        <Link
          href="/admin/services"
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-beige hover:shadow-luxury transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Plus className="text-gold" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-wine">Add Service</p>
              <p className="text-xs text-wine/50">Add a new offering</p>
            </div>
          </div>
          <ArrowRight className="text-wine/30 group-hover:text-gold transition-colors" size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-beige p-6">
          <h3 className="text-lg font-serif text-wine mb-4">Recent Bookings</h3>
          {recentBookings.length > 0 ? (
            <ul className="space-y-3">
              {recentBookings.map((booking) => (
                <li key={booking.id} className="flex items-center gap-3 pb-3 border-b border-beige/50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-wine/10 flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="text-wine" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-wine truncate">{booking.title}</p>
                    <p className="text-xs text-wine/50">{booking.user?.name || booking.user?.email || 'Unknown'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-wine/20 mb-3" size={36} />
              <p className="text-sm text-wine/40">No bookings yet.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-beige p-6">
          <h3 className="text-lg font-serif text-wine mb-4">Recent Messages</h3>
          {recentMessages.length > 0 ? (
            <ul className="space-y-3">
              {recentMessages.map((msg) => (
                <li key={msg.id} className="flex items-center gap-3 pb-3 border-b border-beige/50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-wine truncate">{msg.name}</p>
                    <p className="text-xs text-wine/50 line-clamp-1">{msg.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto text-wine/20 mb-3" size={36} />
              <p className="text-sm text-wine/40">No messages yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
