import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-6xl text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-xl font-serif text-gray-700 mb-2">{title}</h3>
      {message && <p className="text-gray-500 mb-6 max-w-md">{message}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-wine-500 text-white rounded-lg hover:bg-wine-600 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
