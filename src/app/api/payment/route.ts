import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "MITRA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { project_id } = await req.json();

    const mitraProfile = await prisma.mitraProfile.findUnique({
      where: { user_id: session.id },
    });

    if (!mitraProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const payment = await prisma.payment.findFirst({
      where: { project_id, mitra_id: mitraProfile.id },
      include: { project: true }
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment record not found" }, { status: 404 });
    }

    if (payment.payment_status === "SECURED") {
      return NextResponse.json({ message: "Payment already secured" }, { status: 400 });
    }

    // SIMULASI PEMBAYARAN: Langsung anggap sukses tanpa memanggil Midtrans
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update Payment
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          payment_status: "SECURED",
          transaction_id: `SIMULATED-${Date.now()}`,
          payment_method: "simulator",
          paid_at: new Date(),
        }
      });

      // 2. Update Project
      await tx.project.update({
        where: { id: project_id },
        data: { status: "PAYMENT_SECURED" },
      });

      // 3. Create ProjectAssignment (Ruang Kerja)
      const acceptedBid = await tx.bid.findFirst({
        where: { project_id, status: "ACCEPTED" },
      });
      
      if (acceptedBid) {
        const existingAssignment = await tx.projectAssignment.findFirst({
          where: { project_id }
        });
        
        if (!existingAssignment) {
          await tx.projectAssignment.create({
            data: {
              project_id,
              bid_id: acceptedBid.id,
              student_id: acceptedBid.student_id,
              status: "ACTIVE",
            }
          });
        }
      }
    });

    return NextResponse.json({ message: "Pembayaran berhasil disimulasikan" });

  } catch (error) {
    console.error("Payment simulation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
