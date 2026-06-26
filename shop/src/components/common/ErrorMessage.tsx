interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message = "Something went wrong", onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-wine-500 text-5xl mb-4">!</div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-wine-500 text-white rounded-lg hover:bg-wine-600 transition-colors font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
