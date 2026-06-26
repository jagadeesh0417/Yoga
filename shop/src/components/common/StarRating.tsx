import { HiStar, HiOutlineStar } from "react-icons/hi";

interface Props {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizes = { sm: "text-sm", md: "text-lg", lg: "text-xl" };

export default function StarRating({ rating, size = "md", showValue = false }: Props) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizes[size]} text-gold-400`}>
      {Array.from({ length: full }).map((_, i) => (
        <HiStar key={`full-${i}`} />
      ))}
      {half && <HiStar key="half" className="relative" style={{ clipPath: "inset(0 50% 0 0)" }} />}
      {Array.from({ length: empty }).map((_, i) => (
        <HiOutlineStar key={`empty-${i}`} />
      ))}
      {showValue && <span className="ml-1 text-sm text-gray-500 font-sans">({rating.toFixed(1)})</span>}
    </span>
  );
}
