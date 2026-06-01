import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_id, student_id, amount, bank_name, account_number, admin_signature } = await req.json();

    if (!project_id || !student_id || isNaN(amount) || !admin_signature) {
      return NextResponse.json({ error: "Invalid data atau TTD kosong" }, { status: 400 });
    }

    // SIMULASI: Meniru delay koneksi ke Payment Gateway (seperti Midtrans Iris / Xendit)
    await new Promise(resolve => setTimeout(resolve, 2500));

    const refId = `TRX-${bank_name.toUpperCase().substring(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

    const maskedAccount = account_number.length > 4 
      ? account_number.slice(-4).padStart(account_number.length, "*")
      : "****";

    await prisma.$transaction(async (tx) => {
      await tx.payout.create({
        data: {
          project_id,
          student_id,
          amount,
          destination_bank: bank_name,
          destination_account_masked: maskedAccount,
          reference_id: refId,
          payout_status: "PAID_SUCCESSFULLY",
          processed_at: new Date(),
          paid_at: new Date(),
        }
      });
      
      await tx.project.update({
        where: { id: project_id },
        data: { admin_signature }
      });
    });

    return NextResponse.json({ success: true, referenceId: refId });
  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json({ error: "Gagal memproses pencairan dana" }, { status: 500 });
  }
}
