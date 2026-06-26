import { Router } from "express";
import { authenticate, optionalAuth, requireAdmin } from "../middleware/auth";
import * as authController from "../controllers/auth.controller";
import * as categoryController from "../controllers/category.controller";
import * as productController from "../controllers/product.controller";
import * as cartController from "../controllers/cart.controller";
import * as wishlistController from "../controllers/wishlist.controller";
import * as reviewController from "../controllers/review.controller";
import * as couponController from "../controllers/coupon.controller";
import * as orderController from "../controllers/order.controller";
import * as addressController from "../controllers/address.controller";
import * as bannerController from "../controllers/banner.controller";
import * as dashboardController from "../controllers/dashboard.controller";
import { uploadMiddleware, uploadFile } from "../controllers/upload.controller";

const router = Router();

// Auth - public
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authenticate, authController.getMe);
router.put("/auth/profile", authenticate, authController.updateProfile);
router.put("/auth/password", authenticate, authController.updatePassword);

// Categories - public read, admin write
router.get("/categories", categoryController.listCategories);
router.get("/categories/:id", categoryController.getCategory);
router.post("/categories", authenticate, requireAdmin, categoryController.createCategory);
router.put("/categories/:id", authenticate, requireAdmin, categoryController.updateCategory);
router.delete("/categories/:id", authenticate, requireAdmin, categoryController.deleteCategory);

// Products - public read, admin write
router.get("/products", productController.listProducts);
router.get("/products/:slug", productController.getProduct);
router.post("/products", authenticate, requireAdmin, productController.createProduct);
router.put("/products/:id", authenticate, requireAdmin, productController.updateProduct);
router.delete("/products/:id", authenticate, requireAdmin, productController.deleteProduct);

// Cart - authenticated
router.get("/cart", authenticate, cartController.getCart);
router.post("/cart", authenticate, cartController.addToCart);
router.put("/cart/:itemId", authenticate, cartController.updateCartItem);
router.delete("/cart/:itemId", authenticate, cartController.removeCartItem);
router.delete("/cart", authenticate, cartController.clearCart);

// Wishlist - authenticated
router.get("/wishlist", authenticate, wishlistController.getWishlist);
router.post("/wishlist", authenticate, wishlistController.toggleWishlist);

// Reviews - public read, authenticated write
router.get("/reviews/product/:productId", reviewController.getProductReviews);
router.post("/reviews", authenticate, reviewController.createReview);
router.delete("/reviews/:id", authenticate, reviewController.deleteReview);

// Coupons - admin CRUD, public verify
router.get("/coupons", authenticate, requireAdmin, couponController.listCoupons);
router.get("/coupons/verify/:code", optionalAuth, couponController.verifyCoupon);
router.post("/coupons", authenticate, requireAdmin, couponController.createCoupon);
router.put("/coupons/:id", authenticate, requireAdmin, couponController.updateCoupon);
router.delete("/coupons/:id", authenticate, requireAdmin, couponController.deleteCoupon);

// Orders - public (with optionalAuth), authenticated, admin
router.post("/orders/calculate", orderController.calculateOrder);
router.post("/orders", orderController.createOrder);
router.post("/orders/verify-payment", orderController.verifyPayment);
router.get("/orders", authenticate, orderController.getUserOrders);
router.get("/orders/admin", authenticate, requireAdmin, orderController.adminListOrders);
router.get("/orders/:id", authenticate, orderController.getOrder);
router.put("/orders/:id/status", authenticate, requireAdmin, orderController.updateOrderStatus);

// Addresses - authenticated
router.get("/addresses", authenticate, addressController.listAddresses);
router.post("/addresses", authenticate, addressController.createAddress);
router.put("/addresses/:id", authenticate, addressController.updateAddress);
router.delete("/addresses/:id", authenticate, addressController.deleteAddress);
router.put("/addresses/:id/default", authenticate, addressController.setDefaultAddress);

// Banners - public read, admin write
router.get("/banners", bannerController.listBanners);
router.post("/banners", authenticate, requireAdmin, bannerController.createBanner);
router.put("/banners/:id", authenticate, requireAdmin, bannerController.updateBanner);
router.delete("/banners/:id", authenticate, requireAdmin, bannerController.deleteBanner);

// Dashboard - admin only
router.get("/dashboard/stats", authenticate, requireAdmin, dashboardController.getStats);
router.get("/dashboard/revenue", authenticate, requireAdmin, dashboardController.getRevenue);
router.get("/dashboard/top-products", authenticate, requireAdmin, dashboardController.getTopProducts);

// Upload
router.post("/upload", authenticate, requireAdmin, uploadMiddleware, uploadFile);

export default router;
