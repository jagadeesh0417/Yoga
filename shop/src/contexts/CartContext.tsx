import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { cartService } from "../services/cart.service";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";

function getGuestCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function setGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      try {
        const res = await cartService.get();
        setItems(res.data.items || res.data.cart?.items || []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems(getGuestCart());
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: string, quantity = 1) => {
    if (user) {
      try {
        const res = await cartService.add(productId, quantity);
        setItems(res.data.items || res.data.cart?.items || []);
        toast.success("Added to cart");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to add item");
      }
    } else {
      const guestCart = getGuestCart();
      const existing = guestCart.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({ _id: Date.now().toString(), productId, name: "", image: "", price: 0, quantity, stock: 99 });
      }
      setGuestCart(guestCart);
      setItems([...guestCart]);
      toast.success("Added to cart");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user) {
      try {
        const res = await cartService.update(itemId, quantity);
        setItems(res.data.items || res.data.cart?.items || []);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update");
      }
    } else {
      const guestCart = getGuestCart().map((i) =>
        i._id === itemId ? { ...i, quantity } : i
      );
      setGuestCart(guestCart);
      setItems(guestCart);
    }
  };

  const removeItem = async (itemId: string) => {
    if (user) {
      try {
        const res = await cartService.remove(itemId);
        setItems(res.data.items || res.data.cart?.items || []);
        toast.success("Removed from cart");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to remove");
      }
    } else {
      const guestCart = getGuestCart().filter((i) => i._id !== itemId);
      setGuestCart(guestCart);
      setItems(guestCart);
      toast.success("Removed from cart");
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clear();
        setItems([]);
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      setItems([]);
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isLoading, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
