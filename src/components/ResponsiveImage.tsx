import Image from "next/image";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  containerClassName,
  imageClassName,
  aspectRatio = "aspect-[4/3]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ResponsiveImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-wine/30",
        aspectRatio,
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover object-center", imageClassName)}
      />
    </div>
  );
}
