import { Request, Response } from "express";
import { prisma } from "../config/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function listCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { children: true } } },
      orderBy: { order: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCategory(req: Request, res: Response): Promise<void> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: String(req.params.id) },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    console.error("getCategory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, image, parentId, order } = req.body;
    const slug = slugify(name);
    const category = await prisma.category.create({
      data: { name, slug, description, image, parentId, order: order ?? 0 },
    });
    res.status(201).json(category);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Category with this name or slug already exists" });
      return;
    }
    console.error("createCategory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, image, parentId, isActive, order } = req.body;
    const data: Record<string, any> = {};
    if (name !== undefined) { data.name = name; data.slug = slugify(name); }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (parentId !== undefined) data.parentId = parentId;
    if (isActive !== undefined) data.isActive = isActive;
    if (order !== undefined) data.order = order;
    const category = await prisma.category.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(category);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Category with this name or slug already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    console.error("updateCategory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    await prisma.category.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Category deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    console.error("deleteCategory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
