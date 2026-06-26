import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listBanners(_req: Request, res: Response): Promise<void> {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    res.json(banners);
  } catch (err) {
    console.error("listBanners error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createBanner(req: Request, res: Response): Promise<void> {
  try {
    const { title, subtitle, image, link, order } = req.body;
    const banner = await prisma.banner.create({
      data: { title, subtitle, image, link, order: order ?? 0 },
    });
    res.status(201).json(banner);
  } catch (err) {
    console.error("createBanner error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateBanner(req: Request, res: Response): Promise<void> {
  try {
    const allowed = ["title", "subtitle", "image", "link", "isActive", "order"];
    const data: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    const banner = await prisma.banner.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(banner);
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    console.error("updateBanner error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteBanner(req: Request, res: Response): Promise<void> {
  try {
    await prisma.banner.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Banner deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    console.error("deleteBanner error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
