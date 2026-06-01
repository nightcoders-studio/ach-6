import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const project_id = formData.get("project_id") as string;
    const student_id = formData.get("student_id") as string;
    const amount = parseInt(formData.get("amount") as string, 10);

    if (!project_id || !student_id || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Since this is MVP, we simulate a successful payout instantly
    await prisma.$transaction(async (tx) => {
      await tx.payout.create({
        data: {
          project_id,
          student_id,
          amount,
          destination_bank: "BCA", // Mock
          destination_account_masked: "1234xxxx56", // Mock
          payout_status: "PAID_SUCCESSFULLY",
          processed_at: new Date(),
          paid_at: new Date(),
        }
      });
    });

    return NextResponse.redirect(new URL("/dashboard/superuser?payout=success", req.url));
  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json({ error: "Gagal memproses pencairan dana" }, { status: 500 });
  }
}
