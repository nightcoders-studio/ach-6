"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitMitraOnboarding(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const address = formData.get("address") as string;
  const description = formData.get("description") as string;
  const website_url = formData.get("website_url") as string;
  const social_media_url = formData.get("social_media_url") as string;
  const nib_number = formData.get("nib_number") as string;
  const nib_file_url = formData.get("nib_file_url") as string;

  if (!address || !description) {
    return { message: "Alamat dan deskripsi instansi wajib diisi." };
  }

  try {
    await prisma.mitraProfile.update({
      where: { user_id: session.id },
      data: {
        address,
        description,
        website_url,
        social_media_url,
        nib_number,
        nib_file_url: nib_file_url || (nib_number ? "https://dummyimage.com/600x400/000/fff&text=NIB" : undefined),
        verification_status: "PENDING"
      }
    });

  } catch (error) {
    return { message: "Terjadi kesalahan server saat menyimpan profil mitra." };
  }

  redirect("/dashboard/mitra");
}
