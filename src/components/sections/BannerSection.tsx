"use client";

import { motion } from "framer-motion";

export default function BannerSection() {
  return (
    <section className="relative w-full overflow-hidden bg-wine">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <img
          src="/images/gallery-2.png"
          alt="MYSTIC YOGA"
          className="w-full h-auto block"
        />
      </motion.div>
    </section>
  );
}
