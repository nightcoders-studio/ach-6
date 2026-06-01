"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendChatAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const project_id = formData.get("project_id") as string;
  const message = formData.get("message") as string;

  if (!project_id || !message || message.trim().length === 0) {
    return { error: "Pesan tidak boleh kosong" };
  }

  try {
    const chatCount = await prisma.projectDiscussion.count({
      where: { project_id }
    });

    if (chatCount >= 5) {
      return { error: "Batas interaksi chat telah tercapai (5 pesan)" };
    }

    await prisma.projectDiscussion.create({
      data: {
        project_id,
        sender_id: session.id,
        message: message.trim(),
        sender_role: session.role as any,
      }
    });

    revalidatePath(`/dashboard/mitra/projects/${project_id}`);
    revalidatePath(`/dashboard/mahasiswa/projects/${project_id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan sistem" };
  }
}

export async function submitProjectWorkAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") return { error: "Unauthorized" };

  const project_id = formData.get("project_id") as string;
  const result_link = formData.get("result_link") as string;
  const submission_note = formData.get("submission_note") as string;

  try {
    const profile = await prisma.studentProfile.findUnique({ where: { user_id: session.id } });
    if (!profile) return { error: "Profil tidak ditemukan" };

    // Update assignment status
    await prisma.projectAssignment.updateMany({
      where: { project_id, student_id: profile.id },
      data: { status: "SUBMITTED" }
    });

    // Create submission record
    await prisma.projectSubmission.create({
      data: {
        project_id,
        student_id: profile.id,
        result_link,
        submission_note,
        status: "SUBMITTED"
      }
    });

    await prisma.project.update({
      where: { id: project_id },
      data: { status: "WAITING_APPROVAL" }
    });

    revalidatePath(`/dashboard/mahasiswa/projects/${project_id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengirim hasil kerja" };
  }
}

export async function approveProjectAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") throw new Error("Unauthorized");

  const project_id = formData.get("project_id") as string;

  try {
    const profile = await prisma.mitraProfile.findUnique({ where: { user_id: session.id } });
    if (!profile) throw new Error("Profil tidak ditemukan");

    await prisma.$transaction(async (tx) => {
      // 1. Update project status
      await tx.project.update({
        where: { id: project_id, mitra_id: profile.id },
        data: { status: "COMPLETED" }
      });

      // 2. Update assignment status
      await tx.projectAssignment.updateMany({
        where: { project_id },
        data: { status: "COMPLETED" }
      });

      // 3. Update submissions
      await tx.projectSubmission.updateMany({
        where: { project_id, status: "SUBMITTED" },
        data: { status: "APPROVED" }
      });
    });

    revalidatePath(`/dashboard/mitra/projects/${project_id}`);
  } catch (error) {
    console.error(error);
    throw new Error("Gagal menyetujui hasil kerja");
  }
}

export async function requestRevisionAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") return { error: "Unauthorized" };

  const project_id = formData.get("project_id") as string;
  const revision_note = formData.get("revision_note") as string;

  try {
    const project = await prisma.project.findUnique({
      where: { id: project_id },
      include: { revisions: true }
    });

    if (!project) return { error: "Project tidak ditemukan" };
    if (project.revisions.length >= project.revision_limit) {
      return { error: "Batas revisi telah tercapai" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.revision.create({
        data: {
          project_id,
          requested_by: session.id,
          revision_number: project.revisions.length + 1,
          revision_note,
        }
      });

      await tx.projectSubmission.updateMany({
        where: { project_id, status: "SUBMITTED" },
        data: { status: "REVISION_REQUESTED" }
      });

      await tx.project.update({
        where: { id: project_id },
        data: { status: "REVISION_REQUESTED" }
      });

      await tx.projectAssignment.updateMany({
        where: { project_id },
        data: { status: "REVISION_REQUESTED" }
      });
    });

    revalidatePath(`/dashboard/mitra/projects/${project_id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal meminta revisi" };
  }
}
