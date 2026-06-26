import ProductCard, { ProductCardSkeleton } from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
  averageRating: number;
  isNewArrival?: boolean;
  stock?: number;
}

interface Props {
  products: Product[];
  isLoading?: boolean;
  wishlistIds?: string[];
  onWishlistToggle?: () => void;
}

export default function ProductGrid({ products, isLoading, wishlistIds, onWishlistToggle }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          inWishlist={wishlistIds?.includes(product._id)}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
