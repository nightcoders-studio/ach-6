"use server";

import { z } from "zod";
import { registerMahasiswaSchema, registerMitraSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function registerMahasiswaAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = registerMahasiswaSchema.safeParse({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Silakan periksa kembali input Anda.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existingUser) {
      return { message: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedFields.data.email,
        password_hash: hashedPassword,
        name: validatedFields.data.name,
        phone: validatedFields.data.phone,
        role: "MAHASISWA",
        student_profile: {
          create: {
             nim: "",
             university: "",
             study_program: "",
             semester: 1,
             domicile: "",
          }
        }
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      is_verified: user.status === "VERIFIED",
      name: user.name,
    });

  } catch (error) {
    return { message: "Terjadi kesalahan server." };
  }

  redirect("/onboarding/mahasiswa");
}

export async function registerMitraAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = registerMitraSchema.safeParse({
    mitra_name: data.mitra_name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    mitra_type: data.mitra_type,
    responsible_person: data.responsible_person,
    position: data.position,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Silakan periksa kembali input Anda.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existingUser) {
      return { message: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedFields.data.email,
        password_hash: hashedPassword,
        name: validatedFields.data.responsible_person, // Using PIC name as user name
        phone: validatedFields.data.phone,
        role: "MITRA",
        mitra_profile: {
          create: {
             mitra_name: validatedFields.data.mitra_name,
             mitra_type: validatedFields.data.mitra_type,
             responsible_person: validatedFields.data.responsible_person,
             position: validatedFields.data.position,
          }
        }
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      is_verified: user.status === "VERIFIED",
      name: user.name,
    });

  } catch (error) {
    return { message: "Terjadi kesalahan server." };
  }

  redirect("/onboarding/mitra");
}
