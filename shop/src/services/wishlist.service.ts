import api from "./api";
export const wishlistService = {
  get: () => api.get("/wishlist"),
  toggle: (productId: string) => api.post("/wishlist", { productId }),
};
