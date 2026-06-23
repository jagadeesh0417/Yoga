'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 60px rgba(122, 48, 69, 0.15)',
        borderColor: 'rgba(212, 163, 115, 0.3)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      {children}
    </motion.div>
  );
}
