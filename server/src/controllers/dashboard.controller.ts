import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      totalProducts,
      totalOrders,
      totalRevenueAgg,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      revenueByMonth,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "paid" },
      }),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.order.count({ where: { orderStatus: { not: "delivered" } } }),
      prisma.product.count({ where: { stock: { lte: prisma.product.fields.lowStockAlert }, isActive: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true, user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.$queryRawUnsafe<Array<{ month: string; revenue: number }>>(
        `SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COALESCE(SUM(total), 0) as revenue
         FROM "Order"
         WHERE "paymentStatus" = 'paid' AND "createdAt" >= $1
         GROUP BY month ORDER BY month ASC`,
        twelveMonthsAgo
      ),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenueAgg._sum.total || 0,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      revenueByMonth,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRevenue(_req: Request, res: Response): Promise<void> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const revenueData = await prisma.$queryRawUnsafe<Array<{ date: string; revenue: number }>>(
      `SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') as date, COALESCE(SUM(total), 0) as revenue
       FROM "Order"
       WHERE "paymentStatus" = 'paid' AND "createdAt" >= $1
       GROUP BY date ORDER BY date ASC`,
      thirtyDaysAgo
    );
    res.json(revenueData);
  } catch (err) {
    console.error("getRevenue error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTopProducts(_req: Request, res: Response): Promise<void> {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });
    const enriched = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { slug: true, images: true, price: true },
        });
        return {
          productId: item.productId,
          name: item.name,
          totalSold: item._sum.quantity || 0,
          slug: product?.slug || "",
          image: product?.images?.[0] || null,
          price: product?.price || 0,
        };
      })
    );
    res.json(enriched);
  } catch (err) {
    console.error("getTopProducts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
