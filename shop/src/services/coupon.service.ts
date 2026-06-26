import api from "./api";
export const couponService = {
  verify: (code: string) => api.get(`/coupons/verify/${code}`),
};
