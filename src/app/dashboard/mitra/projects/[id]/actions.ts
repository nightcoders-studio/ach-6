"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function selectBidAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const bid_id = formData.get("bid_id") as string;
  const project_id = formData.get("project_id") as string;

  if (!bid_id || !project_id) {
    throw new Error("Data tidak valid.");
  }

  try {
    const profile = await prisma.mitraProfile.findUnique({
      where: { user_id: session.id },
    });

    if (!profile) throw new Error("Profil Mitra tidak ditemukan.");

    const project = await prisma.project.findUnique({
      where: { id: project_id, mitra_id: profile.id },
    });

    if (!project || project.status !== "OPEN_FOR_BID") {
      throw new Error("Project tidak tersedia atau Anda tidak memiliki akses.");
    }

    // Update the selected bid to ACCEPTED, others to REJECTED (optional, but let's just mark the winner)
    await prisma.$transaction(async (tx) => {
      // Mark all bids as REJECTED first
      await tx.bid.updateMany({
        where: { project_id },
        data: { status: "REJECTED" },
      });

      // Mark the selected one as ACCEPTED
      const winningBid = await tx.bid.update({
        where: { id: bid_id },
        data: { status: "ACCEPTED" },
      });

      // Update project status
      await tx.project.update({
        where: { id: project_id },
        data: { status: "BID_SELECTED" },
      });

      // Also create Payment record here according to Tahap 4 schema later, 
      // but for now we just change project status.
      // Wait, Tahap 4 requires total_amount calculation (Bid + 3%).
      // Let's implement this now since it's logical.
      const platform_fee = Math.round(winningBid.bid_price * 0.03);
      const total_amount = winningBid.bid_price + platform_fee;

      await tx.payment.create({
        data: {
          project_id: project_id,
          mitra_id: profile.id,
          order_id: `PAY-${project_id}-${Date.now()}`,
          amount: total_amount,
          platform_fee: platform_fee,
          net_amount: winningBid.bid_price,
          payment_status: "UNPAID",
          payment_method: "MIDTRANS_SNAP",
        }
      });
    });

  } catch (error) {
    console.error(error);
    throw new Error("Terjadi kesalahan server saat memilih bid.");
  }

  redirect(`/dashboard/mitra/projects/${project_id}/payment`); // Redirect to a payment page (Tahap 4)
}
