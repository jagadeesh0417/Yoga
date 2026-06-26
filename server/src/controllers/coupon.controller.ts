import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listCoupons(_req: Request, res: Response): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    res.json(coupons);
  } catch (err) {
    console.error("listCoupons error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function verifyCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.params;
    const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } });
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found", valid: false });
      return;
    }
    if (!coupon.isActive) {
      res.status(400).json({ error: "Coupon is inactive", valid: false });
      return;
    }
    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      res.status(400).json({ error: "Coupon is not yet valid", valid: false });
      return;
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      res.status(400).json({ error: "Coupon has expired", valid: false });
      return;
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ error: "Coupon usage limit reached", valid: false });
      return;
    }
    if (req.user) {
      const userOrderCount = await prisma.order.count({
        where: { userId: req.user.userId, couponId: coupon.id },
      });
      if (userOrderCount >= coupon.perUserLimit) {
        res.status(400).json({ error: "You have already used this coupon the maximum number of times", valid: false });
        return;
      }
    }
    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (err) {
    console.error("verifyCoupon error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const {
      code, description, discountType, discountValue,
      minOrderAmount, maxDiscount, usageLimit, perUserLimit,
      isActive, startsAt, expiresAt,
    } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        usageLimit,
        perUserLimit: perUserLimit ?? 1,
        isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.status(201).json(coupon);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Coupon code already exists" });
      return;
    }
    console.error("createCoupon error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const allowed = [
      "code", "description", "discountType", "discountValue",
      "minOrderAmount", "maxDiscount", "usageLimit", "perUserLimit",
      "isActive", "startsAt", "expiresAt",
    ];
    const data: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.code) data.code = data.code.toUpperCase();
    if (data.startsAt) data.startsAt = new Date(data.startsAt);
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
    const coupon = await prisma.coupon.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(coupon);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Coupon code already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    console.error("updateCoupon error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteCoupon(req: Request, res: Response): Promise<void> {
  try {
    await prisma.coupon.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    console.error("deleteCoupon error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
