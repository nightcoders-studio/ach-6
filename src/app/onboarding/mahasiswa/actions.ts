"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitMahasiswaOnboarding(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    redirect("/auth/login");
  }

  const nim = formData.get("nim") as string;
  const university = formData.get("university") as string;
  const study_program = formData.get("study_program") as string;
  const semesterStr = formData.get("semester") as string;
  const domicile = formData.get("domicile") as string;
  const ktm_url = formData.get("ktm_url") as string;
  const krs_url = formData.get("krs_url") as string;

  if (!nim || !university || !study_program || !semesterStr || !domicile) {
    return { message: "Harap isi semua field teks." };
  }

  const semester = parseInt(semesterStr);
  if (isNaN(semester) || semester < 1) {
    return { message: "Semester tidak valid." };
  }

  try {
    await prisma.studentProfile.update({
      where: { user_id: session.id },
      data: {
        nim,
        university,
        study_program,
        semester,
        domicile,
        ktm_file_url: ktm_url || "https://dummyimage.com/600x400/000/fff&text=KTM",
        krs_file_url: krs_url || "https://dummyimage.com/600x400/000/fff&text=KRS",
        verification_status: "PENDING"
      }
    });

    // Option: also mark user status or keep it as is until superuser verifies
  } catch (error) {
    return { message: "Terjadi kesalahan server saat menyimpan profil." };
  }

  redirect("/dashboard/mahasiswa");
}
