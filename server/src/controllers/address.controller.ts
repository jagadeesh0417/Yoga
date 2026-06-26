import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listAddresses(req: Request, res: Response): Promise<void> {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    res.json(addresses);
  } catch (err) {
    console.error("listAddresses error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createAddress(req: Request, res: Response): Promise<void> {
  try {
    const { label, fullName, phone, line1, line2, city, state, pincode, country, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.userId },
        data: { isDefault: false },
      });
    }
    const count = await prisma.address.count({ where: { userId: req.user!.userId } });
    const address = await prisma.address.create({
      data: {
        userId: req.user!.userId,
        label: label || "Home",
        fullName,
        phone,
        line1,
        line2,
        city,
        state,
        pincode,
        country: country || "India",
        isDefault: count === 0 ? true : (isDefault ?? false),
      },
    });
    res.status(201).json(address);
  } catch (err) {
    console.error("createAddress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAddress(req: Request, res: Response): Promise<void> {
  try {
    const existing = await prisma.address.findFirst({
      where: { id: String(req.params.id), userId: req.user!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    const allowed = ["label", "fullName", "phone", "line1", "line2", "city", "state", "pincode", "country", "isDefault"];
    const data: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.userId, id: { not: String(req.params.id) } },
        data: { isDefault: false },
      });
    }
    const address = await prisma.address.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(address);
  } catch (err) {
    console.error("updateAddress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  try {
    const existing = await prisma.address.findFirst({
      where: { id: String(req.params.id), userId: req.user!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    await prisma.address.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("deleteAddress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function setDefaultAddress(req: Request, res: Response): Promise<void> {
  try {
    const existing = await prisma.address.findFirst({
      where: { id: String(req.params.id), userId: req.user!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    await prisma.address.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    });
    const address = await prisma.address.update({
      where: { id: String(req.params.id) },
      data: { isDefault: true },
    });
    res.json(address);
  } catch (err) {
    console.error("setDefaultAddress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
