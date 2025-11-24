// prisma/seed.ts
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding...");

  // 1. Bersihkan database (Hapus data lama jika ada, biar tidak duplikat)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Akun Admin
  const hashedPassword = await bcrypt.hash("admin123", 10); // Password: admin123

  await prisma.user.create({
    data: {
      name: "Admin Nayanika",
      email: "admin@nayanika.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(
    "✅ Akun Admin dibuat (email: admin@nayanika.com | pass: admin123)"
  );

  // 3. Buat Kategori
  const catCoffee = await prisma.category.create({ data: { name: "Coffee" } });
  const catNonCoffee = await prisma.category.create({
    data: { name: "Non-Coffee" },
  });
  const catSnack = await prisma.category.create({
    data: { name: "Snack & Pastry" },
  });
  const catMain = await prisma.category.create({
    data: { name: "Main Course" },
  });

  // 4. Buat Menu Makanan (Hubungkan dengan ID Kategori tadi)
  const menus = [
    {
      name: "Nayanika Signature Latte",
      description: "Kopi susu gula aren dengan resep rahasia Nayanika.",
      price: 25000,
      categoryId: catCoffee.id,
      image:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Americano",
      description: "Espresso murni dengan air panas.",
      price: 18000,
      categoryId: catCoffee.id,
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Matcha Latte",
      description: "Pure matcha Jepang dengan susu segar.",
      price: 28000,
      categoryId: catNonCoffee.id,
      image:
        "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Butter Croissant",
      description: "Croissant renyah dengan butter premium.",
      price: 22000,
      categoryId: catSnack.id,
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Nasi Goreng Nayanika",
      description: "Nasi goreng spesial dengan sate ayam.",
      price: 35000,
      categoryId: catMain.id,
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  for (const menu of menus) {
    await prisma.menu.create({ data: menu });
  }

  console.log(`✅ Berhasil membuat ${menus.length} menu makanan.`);
  console.log("🚀 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
