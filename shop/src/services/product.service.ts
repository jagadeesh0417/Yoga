import api from "./api";

export const productService = {
  list: (params?: Record<string, string>) =>
    api.get("/products", { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: FormData) =>
    api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};
