"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function submitMahasiswaOnboarding(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    redirect("/auth/login");
  }

  const nim = formData.get("nim") as string;
  const university = formData.get("university") as string;
  const study_program = formData.get("study_program") as string;
  const semesterStr = formData.get("semester") as string;
  const domicile = formData.get("domicile") as string;
  const ktm_file = formData.get("ktm_file") as File | null;
  const krs_file = formData.get("krs_file") as File | null;

  if (!nim || !university || !study_program || !semesterStr || !domicile) {
    return { message: "Harap isi semua field teks." };
  }

  const semester = parseInt(semesterStr);
  if (isNaN(semester) || semester < 1) {
    return { message: "Semester tidak valid." };
  }

  let ktm_url = "https://dummyimage.com/600x400/000/fff&text=KTM";
  let krs_url = "https://dummyimage.com/600x400/000/fff&text=KRS";

  try {
    if (ktm_file && ktm_file.size > 0) {
      const bytes = await ktm_file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `ktm-${session.id}-${Date.now()}.${ktm_file.name.split('.').pop()}`;
      const filepath = join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      ktm_url = `/uploads/${filename}`;
    }

    if (krs_file && krs_file.size > 0) {
      const bytes = await krs_file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `krs-${session.id}-${Date.now()}.${krs_file.name.split('.').pop()}`;
      const filepath = join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      krs_url = `/uploads/${filename}`;
    }

    await prisma.studentProfile.update({
      where: { user_id: session.id },
      data: {
        nim,
        university,
        study_program,
        semester,
        domicile,
        ktm_file_url: ktm_url,
        krs_file_url: krs_url,
        verification_status: "PENDING"
      }
    });

  } catch (error) {
    console.error(error);
    return { message: "Terjadi kesalahan server saat menyimpan data." };
  }

  redirect("/dashboard/mahasiswa");
}
