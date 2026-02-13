import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default admin user
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });
  console.log(`Admin user created: ${admin.username}`);

  // Create default category
  const categoryName = "General";
  const category = await prisma.category.upsert({
    where: { slug: slugify(categoryName, { lower: true, strict: true }) },
    update: {},
    create: {
      name: categoryName,
      slug: slugify(categoryName, { lower: true, strict: true }),
    },
  });
  console.log(`Default category created: ${category.name}`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
