import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import { prisma } from "../config/prisma";
import { config } from "../config";

const razorpayInstance = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MYSTIC-${timestamp}${random}`;
}

function getTransporter() {
  if (!config.smtp.user || !config.smtp.pass) return null;
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
}

async function sendOrderConfirmation(order: any): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: order.email,
      subject: `Order Confirmed - ${order.orderId}`,
      html: `<h1>Thank you for your order!</h1>
<p>Your order <strong>${order.orderId}</strong> has been confirmed.</p>
<p>Total: ₹${Number(order.total).toFixed(2)}</p>
<p>Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})</p>
<p>We'll notify you once it ships.</p>`,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export async function calculateOrder(req: Request, res: Response): Promise<void> {
  try {
    const { items, couponCode, shippingPincode } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "At least one item is required" });
      return;
    }
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const lineItems: any[] = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        return;
      }
      const price = Number(product.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      lineItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || null,
        itemTotal,
      });
    }
    let discount = 0;
    let coupon: any = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon || !coupon.isActive) {
        res.status(400).json({ error: "Invalid or inactive coupon" });
        return;
      }
      const now = new Date();
      if (coupon.startsAt && coupon.startsAt > now) {
        res.status(400).json({ error: "Coupon is not yet valid" });
        return;
      }
      if (coupon.expiresAt && coupon.expiresAt < now) {
        res.status(400).json({ error: "Coupon has expired" });
        return;
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        res.status(400).json({ error: "Coupon usage limit reached" });
        return;
      }
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        res.status(400).json({ error: `Minimum order amount of ₹${Number(coupon.minOrderAmount).toFixed(2)} required` });
        return;
      }
      if (coupon.discountType === "percentage") {
        discount = (subtotal * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
          discount = Number(coupon.maxDiscount);
        }
      } else {
        discount = Number(coupon.discountValue);
      }
    }
    const afterDiscount = subtotal - discount;
    const shippingCost = afterDiscount >= 500 ? 0 : 49;
    const tax = Math.round(afterDiscount * 0.05 * 100) / 100;
    const total = afterDiscount + shippingCost + tax;
    res.json({
      items: lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      couponCode: coupon?.code || null,
      shippingCost,
      tax,
      total: Math.round(total * 100) / 100,
    });
  } catch (err) {
    console.error("calculateOrder error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const {
      items, shippingAddress, billingAddress, paymentMethod,
      couponCode, notes,
    } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "At least one item is required" });
      return;
    }
    if (!shippingAddress) {
      res.status(400).json({ error: "Shipping address is required" });
      return;
    }
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const orderItemsData: any[] = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        return;
      }
      const price = Number(product.price);
      subtotal += price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || null,
      });
    }
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        couponId = coupon.id;
        if (coupon.discountType === "percentage") {
          discount = (subtotal * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
            discount = Number(coupon.maxDiscount);
          }
        } else {
          discount = Number(coupon.discountValue);
        }
      }
    }
    const afterDiscount = subtotal - discount;
    const shippingCost = afterDiscount >= 500 ? 0 : 49;
    const tax = Math.round(afterDiscount * 0.05 * 100) / 100;
    const total = Math.round((afterDiscount + shippingCost + tax) * 100) / 100;

    let shippingAddressId: string | undefined;
    if (req.user && shippingAddress.id) {
      const addr = await prisma.address.findFirst({
        where: { id: shippingAddress.id, userId: req.user.userId },
      });
      if (addr) shippingAddressId = addr.id;
    }
    const orderId = generateOrderId();
    const order = await prisma.order.create({
      data: {
        orderId,
        userId: req.user?.userId || null,
        email: shippingAddress.email || req.user?.email || "",
        phone: shippingAddress.phone || "",
        shippingAddressId: shippingAddressId || null,
        billingAddress: billingAddress || shippingAddress,
        items: { create: orderItemsData },
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        couponId: couponId || null,
        shippingCost,
        tax,
        total,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        orderStatus: "confirmed",
        notes: notes || null,
      },
      include: { items: true },
    });
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    let razorpayOrder: any = null;
    if (paymentMethod === "razorpay") {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: orderId,
        notes: { orderId: order.id },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });
    }
    await sendOrderConfirmation(order);
    res.status(201).json({
      order,
      razorpayOrderId: razorpayOrder?.id || null,
      razorpayKey: paymentMethod === "razorpay" ? config.razorpay.keyId : null,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const expectedSign = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    if (expectedSign !== razorpaySignature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }
    const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        razorpayPaymentId,
        razorpaySignature,
      },
    });
    await sendOrderConfirmation(updated);
    res.json({ message: "Payment verified successfully", order: updated });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserOrders(req: Request, res: Response): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("getUserOrders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: String(req.params.id) },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true, slug: true } } } },
        shippingAddress: true,
      },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (order.userId !== req.user!.userId && req.user!.role !== "admin") {
      res.status(403).json({ error: "Not authorized" });
      return;
    }
    res.json(order);
  } catch (err) {
    console.error("getOrder error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { orderStatus } = req.body;
    const order = await prisma.order.findUnique({ where: { id: String(req.params.id) } });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { orderStatus },
      include: { items: true },
    });
    res.json(updated);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function adminListOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status, paymentStatus, search, page = "1", limit = "20" } = req.query as Record<string, string>;
    const where: any = {};
    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);
    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("adminListOrders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
