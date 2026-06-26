import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getWishlist(req: Request, res: Response): Promise<void> {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, comparePrice: true,
            images: true, stock: true, isActive: true, unit: true,
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function toggleWishlist(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.body;
    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: req.user!.userId, productId },
    });
    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      res.json({ message: "Removed from wishlist", wishlisted: false });
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await prisma.wishlistItem.create({
        data: { userId: req.user!.userId, productId },
      });
      res.status(201).json({ message: "Added to wishlist", wishlisted: true });
    }
  } catch (err) {
    console.error("toggleWishlist error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
