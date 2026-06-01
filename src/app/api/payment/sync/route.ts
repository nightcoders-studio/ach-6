import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coreApi } from "@/lib/midtrans";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { project_id } = await req.json();

    const payment = await prisma.payment.findFirst({
      where: { project_id, payment_status: { not: "SECURED" } },
      orderBy: { created_at: "desc" }
    });

    if (!payment) {
      return NextResponse.json({ message: "No pending payment found" }, { status: 404 });
    }

    // Check status directly to Midtrans Core API
    const transactionStatus = await coreApi.transaction.status(payment.order_id);

    if (
      transactionStatus.transaction_status === "capture" || 
      transactionStatus.transaction_status === "settlement"
    ) {
      // Manually trigger the webhook logic here
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          payment_status: "SECURED",
          transaction_id: transactionStatus.transaction_id,
          payment_method: transactionStatus.payment_type,
          paid_at: new Date(),
        }
      });

      await prisma.project.update({
        where: { id: payment.project_id },
        data: { status: "PAYMENT_SECURED" },
      });

      const acceptedBid = await prisma.bid.findFirst({
        where: { project_id: payment.project_id, status: "ACCEPTED" },
      });
      
      if (acceptedBid) {
        const existingAssignment = await prisma.projectAssignment.findFirst({
          where: { project_id: payment.project_id }
        });
        
        if (!existingAssignment) {
          await prisma.projectAssignment.create({
            data: {
              project_id: payment.project_id,
              bid_id: acceptedBid.id,
              student_id: acceptedBid.student_id,
              status: "ACTIVE",
            }
          });
        }
      }

      return NextResponse.json({ message: "Payment synced and secured" });
    }

    return NextResponse.json({ message: "Payment not completed yet" }, { status: 400 });

  } catch (error) {
    console.error("Sync payment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
