import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const {
      search, category, minPrice, maxPrice, sort, featured, bestSeller, newArrival, tags,
      page = "1", limit = "12",
    } = req.query as Record<string, string>;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.categoryId = category;
    if (minPrice) where.price = { ...(where.price as any || {}), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price as any || {}), lte: parseFloat(maxPrice) };
    if (featured === "true") where.isFeatured = true;
    if (bestSeller === "true") where.isBestSeller = true;
    if (newArrival === "true") where.isNewArrival = true;
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      where.tags = { hasSome: tagList };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "popular") orderBy = { reviews: { _count: "desc" } };
    else if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const result = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : null;
      const { reviews, ...rest } = p;
      return { ...rest, averageRating: avgRating, reviewCount: p._count.reviews };
    });

    res.json({
      products: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: String(req.params.slug), isActive: true },
      include: {
        category: true,
        reviews: {
          where: { isActive: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 6,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    res.json({ ...product, relatedProducts: related });
  } catch (err) {
    console.error("getProduct error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const {
      name, description, benefits, specifications,
      price, comparePrice, costPrice, images,
      categoryId, tags, sku, barcode, stock, lowStockAlert,
      isFeatured, isBestSeller, isNewArrival, weight, unit,
    } = req.body;
    const slug = slugify(name);
    const product = await prisma.product.create({
      data: {
        name, slug, description, benefits, specifications,
        price, comparePrice, costPrice, images: images || [],
        categoryId, tags: tags || [], sku, barcode,
        stock: stock ?? 0, lowStockAlert: lowStockAlert ?? 5,
        isFeatured: isFeatured ?? false, isBestSeller: isBestSeller ?? false,
        isNewArrival: isNewArrival ?? false, weight, unit: unit ?? "pcs",
      },
    });
    res.status(201).json(product);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Product with this slug or sku already exists" });
      return;
    }
    console.error("createProduct error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const allowed = [
      "name", "description", "benefits", "specifications",
      "price", "comparePrice", "costPrice", "images",
      "categoryId", "tags", "sku", "barcode", "stock", "lowStockAlert",
      "isActive", "isFeatured", "isBestSeller", "isNewArrival", "weight", "unit",
    ];
    const data: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.name) data.slug = slugify(data.name);
    const product = await prisma.product.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(product);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Product with this slug or sku already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    await prisma.product.update({
      where: { id: String(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    console.error("deleteProduct error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
