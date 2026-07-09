"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Expand,
} from "lucide-react";
import Image from "next/image";
import ResponsiveImage from "@/components/ResponsiveImage";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  { id: "7", title: "About Sunita Singh", category: "Events", image: "/images/about-sunita.jpg" },
  { id: "9", title: "Gallery Collection 2", category: "Meditation", image: "/images/gallery-2.png" },
  { id: "11", title: "Hero Collection", category: "Yoga", image: "/images/hero-main.jpg" },
  { id: "12", title: "Gallery Collection 4", category: "Retreats", image: "/images/gallery-4.jpg" },
];

const categories = ["All", ...Array.from(new Set(galleryItems.map((i) => i.category)))];

function GalleryCard({
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <ResponsiveImage
        src={item.image}
        alt={item.title}
        containerClassName="transition-transform duration-700 group-hover:scale-110 rounded-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 p-6">
        <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 mb-3 transform group-hover:scale-110 transition-transform duration-500">
          <Expand size={18} className="text-ivory" />
        </div>
        <h3 className="text-ivory font-serif text-lg font-bold text-center leading-snug">
          {item.title}
        </h3>
        <span className="text-ivory/60 text-xs font-medium mt-1.5 uppercase tracking-wider">
          {item.category}
        </span>
      </div>
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-ivory text-xs font-semibold tracking-wide uppercase">
          {item.category}
        </span>
      </div>
    </motion.div>
  );
}

function Lightbox({
  item,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  items: GalleryItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentIndex = items.findIndex((i) => i.id === item.id);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-ivory/50 text-xs font-medium">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-ivory transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden bg-wine"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-20">
            <h2 className="text-ivory font-serif text-2xl md:text-3xl font-bold">
              {item.title}
            </h2>
            <span className="text-ivory/60 text-sm font-medium mt-2 uppercase tracking-wider">
              {item.category}
            </span>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={cn(
              "p-3 rounded-full transition-all",
              currentIndex === 0
                ? "text-ivory/20 cursor-not-allowed"
                : "text-ivory hover:bg-white/10"
            )}
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-ivory/70 text-sm font-medium text-center max-w-md line-clamp-1">
            {item.title}
          </span>

          <button
            onClick={onNext}
            disabled={currentIndex === items.length - 1}
            className={cn(
              "p-3 rounded-full transition-all",
              currentIndex === items.length - 1
                ? "text-ivory/20 cursor-not-allowed"
                : "text-ivory hover:bg-white/10"
            )}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  const handlePrev = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = filtered.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(filtered[currentIndex - 1]);
    }
  }, [selectedItem, filtered]);

  const handleNext = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = filtered.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex < filtered.length - 1) {
      setSelectedItem(filtered[currentIndex + 1]);
    }
  }, [selectedItem, filtered]);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden gradient-gold">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 20%, #7A3045 1px, transparent 1px), radial-gradient(circle at 30% 80%, #F8F5F0 1px, transparent 1px)",
              backgroundSize: "60px 60px, 80px 80px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-wine/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine/10 border border-wine/10 text-gradient-wine-purple text-xs font-medium tracking-wider uppercase mb-6">
              <Sparkles size={14} />
              Visual Journey
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-wine-purple leading-tight">
              Gallery
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-wine/60 text-base md:text-lg leading-relaxed">
              A visual journey through our yoga sessions, meditation retreats,
              wellness events, and transformative moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative -mt-10 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl shadow-black/5 p-3 sm:p-4 flex flex-wrap items-center justify-center gap-2"
        >
          <Filter size={14} className="text-wine/30 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border",
                activeCategory === cat
                  ? "bg-wine text-ivory border-wine shadow-md shadow-wine/20"
                  : "bg-ivory text-wine/60 border-wine/10 hover:border-gold/30 hover:text-gold"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Masonry Grid */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                onSelect={setSelectedItem}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-wine mb-2">
                No images in this category
              </h3>
              <p className="text-wine/50 text-sm">
                Try selecting a different category to explore more.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox
            item={selectedItem}
            items={filtered}
            onClose={() => setSelectedItem(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="py-16 gradient-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ivory">
            Be Part of Our Story
          </h2>
          <p className="mt-3 text-ivory/60 text-sm max-w-md mx-auto">
            Join our global community and create your own transformative
            experiences with MYSTIC YOGA&trade;.
          </p>
          <a
            href="https://instagram.com/mysticyoga"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ivory text-gradient-wine-purple text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-ivory/20 hover:-translate-y-0.5"
          >
            Follow on Instagram
            <Sparkles size={16} />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
