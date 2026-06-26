import StarRating from "../common/StarRating";

interface Review {
  _id: string;
  title?: string;
  comment: string;
  rating: number;
  user: { name: string };
  createdAt: string;
}

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <StarRating rating={review.rating} size="sm" />
      {review.title && (
        <h4 className="font-medium text-gray-800 mt-2">{review.title}</h4>
      )}
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span className="font-medium text-gray-500">{review.user?.name || "Anonymous"}</span>
        <span>•</span>
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
