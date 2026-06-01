"use server";


import { loginSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Silakan periksa kembali input Anda.",
    };
  }

  // TODO: Add real DB logic here, for now MVP simulation
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: "Email atau password salah." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
       return { message: "Email atau password salah." };
    }

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      is_verified: user.status === "VERIFIED", // Simplified for now
      name: user.name,
    });

  } catch {
    return { message: "Terjadi kesalahan server." };
  }

  // Redirect based on role
  // This will be handled by middleware or we can force redirect here
  redirect("/dashboard");
}
