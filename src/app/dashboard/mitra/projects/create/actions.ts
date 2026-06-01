"use server";

import { generateProjectBrief } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function generateBriefAction(prevState: unknown, formData: FormData) {
  const prompt = formData.get("prompt") as string;
  if (!prompt || prompt.length < 10) {
    return { error: "Ide project terlalu singkat. Berikan minimal 10 karakter." };
  }

  try {
    const markdownBrief = await generateProjectBrief(prompt);
    return { result: markdownBrief };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menghasilkan brief dari AI. Coba lagi nanti." };
  }
}

export async function submitProjectAction(prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const min_price = parseInt(formData.get("min_price") as string);
  const max_price = parseInt(formData.get("max_price") as string);
  const deadline_days = parseInt(formData.get("deadline_days") as string);
  const revision_limit = parseInt(formData.get("revision_limit") as string) || 0;
  
  const included_scope = formData.get("included_scope") as string || "See Description";
  const excluded_scope = formData.get("excluded_scope") as string || "";
  const output_format = formData.get("output_format") as string || "Digital Files";
  const output_quantity = parseInt(formData.get("output_quantity") as string) || 1;
  const completion_criteria = formData.get("completion_criteria") as string || "Sesuai Brief";
  const required_materials_from_mitra = formData.get("required_materials_from_mitra") as string || "";

  if (!title || !description || isNaN(min_price) || isNaN(max_price)) {
    return { message: "Input tidak valid" };
  }

  try {
    const mitraProfile = await prisma.mitraProfile.findUnique({
      where: { user_id: session.id },
    });

    if (!mitraProfile) {
      return { message: "Mitra profile tidak ditemukan" };
    }

    await prisma.project.create({
      data: {
        mitra_id: mitraProfile.id,
        title,
        description,
        category: category || "General",
        min_price,
        max_price,
        deadline_days,
        revision_limit,
        status: "OPEN_FOR_BID",
        scope: {
          create: {
            included_scope,
            excluded_scope,
            output_format,
            output_quantity,
            completion_criteria,
            required_materials_from_mitra,
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    return { message: "Terjadi kesalahan sistem saat menyimpan project" };
  }

  redirect("/dashboard/mitra");
}
