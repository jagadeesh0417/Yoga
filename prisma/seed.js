const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const services = [
  {
    title: "Personal Yoga Training",
    slug: "personal-yoga-training",
    description: "One-on-one personalized yoga sessions tailored to your body, goals, and schedule. Includes posture alignment, flexibility training, and breathwork.",
    price: 150,
    duration: "60 min",
    order: 1,
  },
  {
    title: "Meditation & Mindfulness",
    slug: "meditation-mindfulness",
    description: "Guided meditation sessions to reduce stress, improve focus, and cultivate inner peace. Learn ancient techniques adapted for modern life.",
    price: 120,
    duration: "45 min",
    order: 2,
  },
  {
    title: "Corporate Wellness Program",
    slug: "corporate-wellness",
    description: "Comprehensive wellness programs for organizations. Includes group yoga sessions, stress management workshops, and team-building activities.",
    price: 500,
    duration: "90 min",
    order: 3,
  },
  {
    title: "Women's Wellness Retreat",
    slug: "womens-wellness",
    description: "Holistic wellness retreats designed exclusively for women. Combines yoga, meditation, nutrition guidance, and self-care practices.",
    price: 300,
    duration: "Half Day",
    order: 4,
  },
  {
    title: "Online Classes",
    slug: "online-classes",
    description: "Live interactive yoga and meditation classes from the comfort of your home. Access recordings and join our global community.",
    price: 80,
    duration: "45 min",
    order: 5,
  },
  {
    title: "Luxury Wellness Retreat",
    slug: "luxury-retreat",
    description: "Premium transformative retreat experiences in breathtaking locations. All-inclusive luxury wellness journey with personalized attention.",
    price: 1500,
    duration: "3 Days",
    order: 6,
  },
];

async function seed() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log("Services seeded successfully!");
  await prisma.$disconnect();
}

seed().catch(console.error);
