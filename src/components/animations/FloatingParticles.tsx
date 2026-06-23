'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  opacity: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateParticles(count: number, offset = 0): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededRandom(i + 1 + offset) * 100,
    y: seededRandom(i + 100 + offset) * 100,
    size: seededRandom(i + 200 + offset) * 12 + 6,
    rotation: seededRandom(i + 300 + offset) * 360,
    duration: seededRandom(i + 400 + offset) * 10 + 15,
    delay: seededRandom(i + 500 + offset) * 5,
    opacity: seededRandom(i + 600 + offset) * 0.3 + 0.1,
  }));
}

export default function FloatingParticles({ count = 12 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [particles, setParticles] = useState<Particle[]>(() =>
    generateParticles(count)
  );

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setParticles(generateParticles(count, 9999));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [count, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((p) => (
        <div key={p.id} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            style={{
              opacity: p.opacity,
              rotate: p.rotation,
              x: useTransform(springX, [-0.5, 0.5], [-30, 30]),
              y: useTransform(springY, [-0.5, 0.5], [-30, 30]),
            }}
            animate={{
              y: [0, -8, 4, 0],
              rotate: [p.rotation, p.rotation + 10, p.rotation - 5, p.rotation],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 13.5 10 16 12 18C14 16 16 13.5 16 10C16 6 12 2 12 2Z"
              fill="url(#petalGradient)"
              stroke="url(#petalStroke)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#D4A373" />
                <stop offset="1" stopColor="#7A3045" />
              </linearGradient>
              <linearGradient id="petalStroke" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#D4A373" />
                <stop offset="1" stopColor="#7A3045" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      ))}
    </div>
  );
}
