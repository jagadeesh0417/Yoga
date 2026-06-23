"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import ResponsiveImage from "@/components/ResponsiveImage";
import { blogPosts } from "@/lib/data";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Wellness: "bg-wine/80 text-white",
  Yoga: "bg-purple/80 text-white",
  Meditation: "bg-wine/80 text-white",
  Mindfulness: "bg-wine/80 text-white",
  Health: "bg-purple/80 text-white",
};

const placeholderDates = [
  "June 15, 2026",
  "June 10, 2026",
  "June 5, 2026",
  "May 28, 2026",
  "May 20, 2026",
  "May 12, 2026",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function BlogSection() {
  return (
    <section
      id="blog"
      className="relative py-20 md:py-28 overflow-hidden bg-rose-light"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #7A3045 1px, transparent 1px), radial-gradient(circle at 70% 80%, #D4A373 1px, transparent 1px)",
          backgroundSize: "50px 50px, 70px 70px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Wellness Insights"
          subtitle="Explore our collection of wellness articles, tips, and guides"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              variants={cardVariants}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-wine/5 hover:shadow-xl hover:shadow-wine/10 transition-all duration-500"
            >
              <div className="relative overflow-hidden">
                <ResponsiveImage
                  src={post.image}
                  alt={post.title}
                  containerClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span
                  className={cn(
                    "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
                    categoryColors[post.category] || "bg-wine/10 text-wine"
                  )}
                >
                  {post.category}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-wine/40 text-xs font-medium mb-3">
                  <Calendar size={14} />
                  <span>{placeholderDates[index]}</span>
                </div>

                <h3 className="font-serif text-lg md:text-xl font-bold text-wine transition-colors duration-300 leading-snug mb-3">
                  {post.title}
                </h3>

                <p className="text-wine/60 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-wine font-semibold text-sm group/link"
                >
                  Read More
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-wine hover:bg-wine/90 text-ivory text-sm font-semibold transition-all duration-300 shadow-lg shadow-wine/20 hover:shadow-wine/30 hover:-translate-y-0.5"
          >
            View All Articles
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
