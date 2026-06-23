import Image from "next/image";
import { cn } from "@/lib/utils";

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
        className={cn("object-contain object-center", imageClassName)}
      />
    </div>
  );
}
