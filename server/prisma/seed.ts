import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const adminHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@mysticyoga.global",
      password: adminHash,
      role: "admin",
      phone: "+919999999999",
    },
  });

  // Categories
  const categoryData = [
    { name: "Yoga Mats", slug: "yoga-mats", description: "Premium yoga mats for every practice", order: 1 },
    { name: "Yoga Blocks", slug: "yoga-blocks", description: "Supportive blocks to deepen your poses", order: 2 },
    { name: "Meditation Accessories", slug: "meditation-accessories", description: "Enhance your meditation practice", order: 3 },
    { name: "Apparel", slug: "apparel", description: "Comfortable yoga and wellness clothing", order: 4 },
    { name: "Wellness Products", slug: "wellness-products", description: "Natural wellness and self-care products", order: 5 },
    { name: "Ayurvedic Products", slug: "ayurvedic-products", description: "Traditional Ayurvedic formulations", order: 6 },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.create({ data: cat })
    )
  );

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // Products
  const products = [
    // Yoga Mats
    { name: "Premium Non-Slip Yoga Mat", slug: "premium-non-slip-yoga-mat", description: "High-density TPE mat with excellent grip and cushioning. 6mm thickness provides comfort on any floor.", price: 2499, comparePrice: 3499, stock: 100, sku: "MAT-001", tags: ["mat", "non-slip", "eco-friendly"], categorySlug: "yoga-mats", isFeatured: true, isBestSeller: true, images: ["/uploads/yoga-mat-1.jpg"] },
    { name: "Travel Yoga Mat", slug: "travel-yoga-mat", description: "Ultra-lightweight foldable mat perfect for travel. Only 1.5mm thick yet durable.", price: 1499, comparePrice: 1999, stock: 75, sku: "MAT-002", tags: ["mat", "travel", "lightweight"], categorySlug: "yoga-mats", images: ["/uploads/yoga-mat-2.jpg"] },
    { name: "Extra Thick Yoga Mat", slug: "extra-thick-yoga-mat", description: "10mm cushioned mat for joint protection during floor poses. Made from recycled materials.", price: 3499, comparePrice: 4499, stock: 50, sku: "MAT-003", tags: ["mat", "thick", "cushioned"], categorySlug: "yoga-mats", isNewArrival: true, images: ["/uploads/yoga-mat-3.jpg"] },

    // Yoga Blocks
    { name: "Cork Yoga Block Set", slug: "cork-yoga-block-set", description: "Set of 2 natural cork blocks. Eco-friendly, firm support with beveled edges for comfortable grip.", price: 1799, comparePrice: 2299, stock: 60, sku: "BLK-001", tags: ["block", "cork", "eco-friendly"], categorySlug: "yoga-blocks", isBestSeller: true, images: ["/uploads/block-1.jpg"] },
    { name: "EVA Foam Yoga Blocks", slug: "eva-foam-yoga-blocks", description: "Lightweight foam blocks in assorted colors. Perfect for beginners.", price: 899, comparePrice: 1299, stock: 120, sku: "BLK-002", tags: ["block", "foam", "lightweight"], categorySlug: "yoga-blocks", images: ["/uploads/block-2.jpg"] },
    { name: "Bamboo Yoga Block", slug: "bamboo-yoga-block", description: "Single solid bamboo block with smooth finish. Durable and sustainable.", price: 999, stock: 45, sku: "BLK-003", tags: ["block", "bamboo", "sustainable"], categorySlug: "yoga-blocks", isNewArrival: true, images: ["/uploads/block-3.jpg"] },

    // Meditation Accessories
    { name: "Meditation Cushion (Zafu)", slug: "meditation-cushion-zafu", description: "Round buckwheat-filled meditation cushion with removable cotton cover.", price: 2499, comparePrice: 2999, stock: 40, sku: "MED-001", tags: ["meditation", "cushion", "zafu"], categorySlug: "meditation-accessories", isFeatured: true, images: ["/uploads/med-1.jpg"] },
    { name: "Singing Bowl Set", slug: "singing-bowl-set", description: "Hand-hammered Tibetan singing bowl with striker and cushion. 7-inch diameter.", price: 3999, comparePrice: 4999, stock: 25, sku: "MED-002", tags: ["meditation", "singing-bowl", "tibetan"], categorySlug: "meditation-accessories", images: ["/uploads/med-2.jpg"] },
    { name: "Aromatherapy Essential Oil Diffuser", slug: "aromatherapy-oil-diffuser", description: "Ultrasonic cool mist diffuser with LED lights. Holds 200ml water.", price: 1799, stock: 35, sku: "MED-003", tags: ["meditation", "aromatherapy", "diffuser"], categorySlug: "meditation-accessories", isNewArrival: true, images: ["/uploads/med-3.jpg"] },

    // Apparel
    { name: "Women's High-Waist Yoga Leggings", slug: "womens-high-waist-yoga-leggings", description: "Squat-proof, moisture-wicking fabric with hidden waistband pocket.", price: 1999, comparePrice: 2799, stock: 80, sku: "APP-001", tags: ["apparel", "leggings", "women"], categorySlug: "apparel", isBestSeller: true, images: ["/uploads/app-1.jpg"] },
    { name: "Men's Quick-Dry Yoga Tee", slug: "mens-quick-dry-yoga-tee", description: "Lightweight, breathable athletic shirt with flatlock seams.", price: 1299, comparePrice: 1699, stock: 65, sku: "APP-002", tags: ["apparel", "tee", "men"], categorySlug: "apparel", images: ["/uploads/app-2.jpg"] },
    { name: "Unisex Yoga Hoodie", slug: "unisex-yoga-hoodie", description: "Oversized organic cotton hoodie with thumbhole cuffs. Pre-shrunk.", price: 2999, stock: 40, sku: "APP-003", tags: ["apparel", "hoodie", "unisex"], categorySlug: "apparel", isNewArrival: true, images: ["/uploads/app-3.jpg"] },

    // Wellness Products
    { name: "Organic Ashwagandha Capsules", slug: "organic-ashwagandha-capsules", description: "60 capsules of 500mg organic ashwagandha root extract. Supports stress relief.", price: 899, comparePrice: 1199, stock: 100, sku: "WEL-001", tags: ["wellness", "ashwagandha", "organic"], categorySlug: "wellness-products", isFeatured: true, images: ["/uploads/wel-1.jpg"] },
    { name: "Herbal Sleep Tea", slug: "herbal-sleep-tea", description: "Caffeine-free blend of chamomile, lavender, and valerian root. 30 bags.", price: 499, comparePrice: 699, stock: 150, sku: "WEL-002", tags: ["wellness", "tea", "sleep"], categorySlug: "wellness-products", isBestSeller: true, images: ["/uploads/wel-2.jpg"] },
    { name: "Foam Roller for Muscle Recovery", slug: "foam-roller-muscle-recovery", description: "High-density foam roller with textured surface. 12 inches long.", price: 1599, stock: 55, sku: "WEL-003", tags: ["wellness", "foam-roller", "recovery"], categorySlug: "wellness-products", images: ["/uploads/wel-3.jpg"] },

    // Ayurvedic Products
    { name: "Triphala Powder", slug: "triphala-powder", description: "Traditional Ayurvedic blend of three fruits. Supports digestion and detox. 200g.", price: 399, comparePrice: 549, stock: 90, sku: "AYU-001", tags: ["ayurveda", "triphala", "detox"], categorySlug: "ayurvedic-products", images: ["/uploads/ayu-1.jpg"] },
    { name: "Chyawanprash Traditional Jam", slug: "chyawanprash-traditional-jam", description: "Classic Ayurvedic nutritive jam made with amla and 40+ herbs. 500g.", price: 599, comparePrice: 799, stock: 70, sku: "AYU-002", tags: ["ayurveda", "chyawanprash", "immunity"], categorySlug: "ayurvedic-products", isFeatured: true, images: ["/uploads/ayu-2.jpg"] },
    { name: "Sesame Oil for Abhyanga", slug: "sesame-oil-for-abhyanga", description: "Cold-pressed organic sesame oil for Ayurvedic self-massage. 500ml.", price: 799, stock: 60, sku: "AYU-003", tags: ["ayurveda", "oil", "abhyanga"], categorySlug: "ayurvedic-products", isNewArrival: true, images: ["/uploads/ayu-3.jpg"] },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice || null,
        images: p.images,
        categoryId: catMap[p.categorySlug],
        tags: p.tags,
        sku: p.sku,
        stock: p.stock,
        isFeatured: p.isFeatured || false,
        isBestSeller: p.isBestSeller || false,
        isNewArrival: p.isNewArrival || false,
      },
    });
  }

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Summer Yoga Sale",
        subtitle: "Up to 40% off on mats, blocks, and apparel",
        image: "/uploads/banner-summer.jpg",
        link: "/products",
        order: 1,
      },
      {
        title: "New Arrivals: Ayurvedic Collection",
        subtitle: "Traditional wellness, modern living",
        image: "/uploads/banner-ayurveda.jpg",
        link: "/products?category=ayurvedic-products",
        order: 2,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
