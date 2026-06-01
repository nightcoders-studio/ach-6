import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
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

    const parameters = {
      transaction_details: {
        order_id: payment.order_id,
        gross_amount: payment.amount,
      },
      customer_details: {
        first_name: mitraProfile.responsible_person,
        email: session.email,
        phone: "081234567890",
      },
      item_details: [
        {
          id: project_id,
          price: payment.net_amount,
          quantity: 1,
          name: `Project: ${payment.project.title}`,
        },
        {
          id: "FEE-3PERCENT",
          price: payment.platform_fee,
          quantity: 1,
          name: "Biaya Layanan Platform (3%)",
        }
      ]
    };

    const transaction = await snap.createTransaction(parameters);
    
    return NextResponse.json({ token: transaction.token, redirect_url: transaction.redirect_url });

  } catch (error) {
    console.error("Payment generation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
