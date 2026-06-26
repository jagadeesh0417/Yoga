import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: String(req.params.productId), isActive: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    console.error("getProductReviews error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const { productId, rating, title, comment } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const existing = await prisma.review.findFirst({
      where: { userId: req.user!.userId, productId },
    });
    if (existing) {
      res.status(409).json({ error: "You have already reviewed this product" });
      return;
    }
    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user!.userId,
        rating,
        title,
        comment,
        isActive: false,
      },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteReview(req: Request, res: Response): Promise<void> {
  try {
    const review = await prisma.review.findUnique({ where: { id: String(req.params.id) } });
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (review.userId !== req.user!.userId && req.user!.role !== "admin") {
      res.status(403).json({ error: "Not authorized to delete this review" });
      return;
    }
    await prisma.review.delete({ where: { id: review.id } });
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("deleteReview error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
