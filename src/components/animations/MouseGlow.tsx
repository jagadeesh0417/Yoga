"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const checkTouch = () => setIsTouch(true);
    window.addEventListener("touchstart", checkTouch, { once: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("touchstart", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  if (isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(212, 163, 115, 0.06), transparent 80%)`,
      }}
    />
  );
}
