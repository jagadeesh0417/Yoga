"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BannerSection() {
  return (
    <section className="relative w-full overflow-hidden bg-wine">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full aspect-[4/1]"
      >
        <Image
          src="/images/gallery-2.png"
          alt="MYSTIC YOGA"
          fill
          className="object-contain mx-auto"
          priority
        />
      </motion.div>
    </section>
  );
}
