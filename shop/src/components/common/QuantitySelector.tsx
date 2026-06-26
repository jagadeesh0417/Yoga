import { HiMinus, HiPlus } from "react-icons/hi";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

export default function QuantitySelector({ value, min = 1, max = 999, onChange }: Props) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        className="px-3 py-2 text-gray-500 hover:bg-ivory-100 disabled:opacity-40 transition-colors"
      >
        <HiMinus className="text-xs" />
      </button>
      <span className="px-4 py-2 text-sm font-medium text-gray-800 min-w-[3rem] text-center border-x border-gray-200">
        {value}
      </span>
      <button
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className="px-3 py-2 text-gray-500 hover:bg-ivory-100 disabled:opacity-40 transition-colors"
      >
        <HiPlus className="text-xs" />
      </button>
    </div>
  );
}
