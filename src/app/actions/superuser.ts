"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function verifyMahasiswaAction(id: string, action: "VERIFIED" | "REJECTED") {
  const session = await getSession();
  if (!session || session.role !== "SUPERUSER") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.studentProfile.update({
      where: { id },
      data: { verification_status: action }
    });
    revalidatePath("/dashboard/superuser");
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal memperbarui status Mahasiswa");
  }
}

export async function verifyMitraAction(id: string, action: "VERIFIED" | "REJECTED") {
  const session = await getSession();
  if (!session || session.role !== "SUPERUSER") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.mitraProfile.update({
      where: { id },
      data: { verification_status: action }
    });
    revalidatePath("/dashboard/superuser");
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal memperbarui status Mitra");
  }
}
