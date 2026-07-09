"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  height?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  containerClassName,
  imageClassName,
  height = "h-[280px]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ResponsiveImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "relative w-full bg-wine/5 flex items-center justify-center overflow-hidden",
          height,
          containerClassName
        )}
      >
        <div className="text-center">
          <ImageOff size={24} className="text-wine/30 mx-auto mb-1" />
          <p className="text-wine/20 text-xs">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full bg-white flex items-center justify-center overflow-hidden",
        height,
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onError={() => setError(true)}
        className={cn("object-contain object-center", imageClassName)}
      />
    </div>
  );
}
