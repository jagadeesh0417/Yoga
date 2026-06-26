import api from "./api";
export const orderService = {
  calculate: (data: { items: { productId: string; quantity: number }[]; couponCode?: string }) =>
    api.post("/orders/calculate", data),
  create: (data: any) => api.post("/orders", data),
  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post("/orders/verify-payment", data),
  getMyOrders: () => api.get("/orders"),
  getById: (id: string) => api.get(`/orders/${id}`),
};
