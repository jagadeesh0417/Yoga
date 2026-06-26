import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-wine-800 via-purple-800 to-wine-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 text-gold-300">MYSTIC YOGA</h3>
            <p className="text-sm text-ivory-200 leading-relaxed">
              Premium yoga apparel and accessories designed for your practice. Elevate your journey with mindful craftsmanship.
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold-300 mb-4 font-medium">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=mat" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">Yoga Mats</Link></li>
              <li><Link to="/shop?category=apparel" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">Apparel</Link></li>
              <li><Link to="/shop?category=accessories" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold-300 mb-4 font-medium">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-sm text-ivory-200 hover:text-gold-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold-300 mb-4 font-medium">Connect</h4>
            <p className="text-sm text-ivory-200 mb-2">hello@mysticyoga.com</p>
            <p className="text-sm text-ivory-200">1-800-MYSTIC</p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-ivory-300">&copy; {new Date().getFullYear()} MYSTIC YOGA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
