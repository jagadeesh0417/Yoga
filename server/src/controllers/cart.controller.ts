import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getCart(req: Request, res: Response): Promise<void> {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, comparePrice: true,
            images: true, stock: true, isActive: true, unit: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(items);
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const existing = await prisma.cartItem.findFirst({
      where: { userId: req.user!.userId, productId },
    });
    if (existing) {
      const item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: { select: { id: true, name: true, slug: true, price: true, images: true, stock: true, unit: true } } },
      });
      res.json(item);
    } else {
      const item = await prisma.cartItem.create({
        data: { userId: req.user!.userId, productId, quantity },
        include: { product: { select: { id: true, name: true, slug: true, price: true, images: true, stock: true, unit: true } } },
      });
      res.status(201).json(item);
    }
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCartItem(req: Request, res: Response): Promise<void> {
  try {
    const { quantity } = req.body;
    const item = await prisma.cartItem.findFirst({
      where: { id: String(req.params.itemId), userId: req.user!.userId },
    });
    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
      res.json({ message: "Item removed from cart" });
    } else {
      const updated = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
        include: { product: { select: { id: true, name: true, slug: true, price: true, images: true, stock: true, unit: true } } },
      });
      res.json(updated);
    }
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeCartItem(req: Request, res: Response): Promise<void> {
  try {
    const item = await prisma.cartItem.findFirst({
      where: { id: String(req.params.itemId), userId: req.user!.userId },
    });
    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }
    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("removeCartItem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function clearCart(req: Request, res: Response): Promise<void> {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user!.userId } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
