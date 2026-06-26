import api from "./api";

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put("/auth/profile", data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/password", data),
};
