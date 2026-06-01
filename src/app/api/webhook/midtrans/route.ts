import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coreApi } from "@/lib/midtrans";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Verify Midtrans Signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = crypto
      .createHash("sha512")
      .update(data.order_id + data.status_code + data.gross_amount + serverKey)
      .digest("hex");

    if (signatureKey !== data.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const { transaction_status, order_id, transaction_id, payment_type } = data;

    // Log the webhook
    await prisma.paymentWebhookLog.create({
      data: {
        payment: { connect: { order_id } },
        gateway: "MIDTRANS",
        event_type: "notification",
        transaction_status: transaction_status,
        payload: JSON.stringify(data),
      }
    });

    const payment = await prisma.payment.findUnique({ where: { order_id } });
    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    let newStatus = payment.payment_status;

    if (transaction_status === "capture" || transaction_status === "settlement") {
      newStatus = "SECURED"; // Monetization logic holds the fee, and payment is secured
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire" || transaction_status === "failure") {
      newStatus = "FAILED";
    } else if (transaction_status === "pending") {
      newStatus = "PENDING";
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        payment_status: newStatus as any,
        transaction_id,
        payment_method: payment_type,
        paid_at: newStatus === "SECURED" ? new Date() : null,
      }
    });

    // If payment secured, update project status
    if (newStatus === "SECURED") {
      await prisma.project.update({
        where: { id: payment.project_id },
        data: { status: "PAYMENT_SECURED" }, // Project moves to the execution phase
      });
      // Optionally create the ProjectAssignment here!
      // But maybe we already have a selected bid, so we should convert it to assignment.
      const acceptedBid = await prisma.bid.findFirst({
        where: { project_id: payment.project_id, status: "ACCEPTED" },
      });
      
      if (acceptedBid) {
        // Create assignment
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
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
