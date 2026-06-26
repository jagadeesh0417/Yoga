import { useCart } from "../../contexts/CartContext";
import QuantitySelector from "../common/QuantitySelector";
import { HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";

interface CartItemData {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

interface Props {
  item: CartItemData;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-ivory-100 flex-shrink-0">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-wine-500 transition-colors line-clamp-1">
          {item.name}
        </Link>
        <p className="text-sm text-wine-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-4 mt-2">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.stock}
            onChange={(q) => updateQuantity(item._id, q)}
          />
          <button
            onClick={() => removeItem(item._id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}
