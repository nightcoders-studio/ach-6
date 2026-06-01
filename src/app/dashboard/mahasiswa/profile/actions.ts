"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBankAccountAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    return { error: "Unauthorized" };
  }

  const bank_name = formData.get("bank_name") as string;
  const account_number = formData.get("account_number") as string;
  const account_holder_name = formData.get("account_holder_name") as string;

  if (!bank_name || !account_number || !account_holder_name) {
    return { error: "Semua kolom wajib diisi" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { user_id: session.id }
    });

    if (!profile) {
      return { error: "Profil tidak ditemukan" };
    }

    // Check if bank account already exists
    const existingBank = await prisma.studentBankAccount.findFirst({
      where: { student_id: profile.id }
    });

    if (existingBank) {
      await prisma.studentBankAccount.update({
        where: { id: existingBank.id },
        data: {
          bank_name,
          account_number,
          account_holder_name
        }
      });
    } else {
      await prisma.studentBankAccount.create({
        data: {
          student_id: profile.id,
          bank_name,
          account_number,
          account_holder_name,
          verification_status: "PENDING"
        }
      });
    }

    revalidatePath("/dashboard/mahasiswa/profile");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat menyimpan rekening" };
  }
}
