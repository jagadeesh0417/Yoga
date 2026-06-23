"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
          className={cn(
            "font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
            light ? "text-ivory" : "text-gradient-wine-purple"
          )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={cn(
            "mt-4 max-w-2xl text-base md:text-lg leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-ivory/70" : "text-wine/60"
          )}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 60 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={cn(
          "h-0.5 mt-6 rounded-full",
          align === "center" && "mx-auto",
          light ? "bg-gold" : "bg-wine"
        )}
      />
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 30 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className={cn(
          "h-px mt-1.5 rounded-full",
          align === "center" && "mx-auto",
          light ? "bg-gold/50" : "bg-wine/50"
        )}
      />
    </div>
  );
}
