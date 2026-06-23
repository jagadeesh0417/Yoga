"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import ResponsiveImage from "@/components/ResponsiveImage";
import { cn } from "@/lib/utils";
import Newsletter from "@/components/Newsletter";

const placeholderDates = [
  "June 15, 2026",
  "June 10, 2026",
  "June 5, 2026",
  "May 28, 2026",
  "May 20, 2026",
  "May 12, 2026",
];

const categoryColors: Record<string, string> = {
  Wellness: "bg-wine/80 text-white border-wine/20",
  Yoga: "bg-purple/80 text-white border-purple/20",
  Meditation: "bg-wine/80 text-white border-wine/20",
  Mindfulness: "bg-wine/80 text-white border-wine/20",
  Health: "bg-purple/80 text-white border-purple/20",
};

const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

const POSTS_PER_PAGE = 3;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #D4A373 1px, transparent 1px), radial-gradient(circle at 80% 70%, #F8F5F0 1px, transparent 1px)",
              backgroundSize: "60px 60px, 80px 80px",
            }}
          />
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory/10 border border-ivory/20 text-ivory/80 text-xs font-medium tracking-wider uppercase mb-6">
              <Sparkles size={14} />
              Mystic Yoga Journal
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight">
              Wellness Insights
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-ivory/70 text-base md:text-lg leading-relaxed">
              Explore thoughtfully crafted articles on yoga, meditation,
              mindfulness, and holistic wellness â€” written to inspire your
              journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="relative -mt-10 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl shadow-black/5 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border",
                  activeCategory === cat
                    ? "bg-gradient-to-r from-wine to-purple text-white border-wine shadow-md shadow-wine/20"
                    : "bg-ivory text-wine/60 border-wine/10 hover:border-wine/30 hover:text-wine"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ivory border border-wine/10 text-wine text-sm placeholder:text-wine/30 focus:outline-none focus:border-wine/30 focus:ring-2 focus:ring-wine/10 transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedPosts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  variants={cardVariants}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-wine/10 transition-all duration-500"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative overflow-hidden">
                      <ResponsiveImage
                        src={post.image}
                        alt={post.title}
                        containerClassName="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span
                        className={cn(
                          "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border backdrop-blur-sm",
                          categoryColors[post.category] ||
                            "bg-wine/80 text-white border-wine/20"
                        )}
                      >
                        {post.category}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-wine/40 text-xs font-medium mb-3">
                        <Calendar size={14} />
                        <span>
                          {placeholderDates[
                            blogPosts.findIndex((bp) => bp.slug === post.slug)
                          ] || "June 2026"}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg md:text-xl font-bold text-wine group-hover:text-wine transition-colors duration-300 leading-snug mb-3">
                        {post.title}
                      </h3>

                      <p className="text-wine/60 text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-2 text-wine font-semibold text-sm group/link">
                        Read More
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover/link:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-wine mb-2">
                No articles found
              </h3>
              <p className="text-wine/50 text-sm">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-3"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300",
                  currentPage === 1
                    ? "border-wine/10 text-wine/30 cursor-not-allowed"
                    : "border-wine/10 text-wine hover:border-wine/30 hover:text-wine hover:bg-wine/5"
                )}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300",
                      currentPage === page
                        ? "bg-gradient-to-r from-wine to-purple text-white shadow-md shadow-wine/20"
                        : "border border-wine/10 text-wine/60 hover:border-wine/30 hover:text-wine"
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300",
                  currentPage === totalPages
                    ? "border-wine/10 text-wine/30 cursor-not-allowed"
                    : "border-wine/10 text-wine hover:border-wine/30 hover:text-wine hover:bg-wine/5"
                )}
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
