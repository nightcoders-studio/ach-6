const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createSuperuser() {
  const email = process.env.SUPERUSER_EMAIL;
  const password = process.env.SUPERUSER_PASSWORD;
  const name = process.env.SUPERUSER_NAME || "Super Administrator";

  if (!email || !password) {
    console.error("Error: SUPERUSER_EMAIL dan SUPERUSER_PASSWORD harus diatur di dalam file .env");
    process.exit(1);
  }

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log(`User dengan email ${email} sudah ada.`);
      console.log("Melakukan update password dan role...");
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password_hash: hashedPassword,
          role: "SUPERUSER",
          status: "ACTIVE"
        }
      });
      console.log("Password dan role berhasil diperbarui menjadi SUPERUSER.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: hashedPassword,
        role: "SUPERUSER",
        phone: "-",
        status: "ACTIVE",
      }
    });

    console.log(`Superuser berhasil dibuat!`);
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Name: ${newAdmin.name}`);
    console.log(`Role: ${newAdmin.role}`);

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperuser();
