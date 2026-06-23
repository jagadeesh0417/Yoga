'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageReveal({ src, alt, className = '' }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-10 bg-wine"
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.18, 1] as const }}
        style={{ transformOrigin: 'right' }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.2 }}
      />
    </div>
  );
}
