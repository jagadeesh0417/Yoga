interface Props {
  minPrice: string;
  maxPrice: string;
  onMinChange: (val: string) => void;
  onMaxChange: (val: string) => void;
}

export default function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange }: Props) {
  return (
    <div>
      <h4 className="font-serif text-lg text-wine-700 mb-3">Price Range</h4>
      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
        />
      </div>
    </div>
  );
}
