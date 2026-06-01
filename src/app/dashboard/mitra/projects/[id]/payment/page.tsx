import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ClientPayment } from "./ClientPayment";

export default async function PaymentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const profile = await prisma.mitraProfile.findUnique({
    where: { user_id: session.id },
  });

  if (!profile) redirect("/onboarding/mitra");

  const payment = await prisma.payment.findFirst({
    where: { project_id: id, mitra_id: profile.id },
    include: { project: true }
  });

  if (!payment) notFound();

  if (payment.payment_status === "SECURED") {
    // If already paid, redirect to project page or success page
    redirect(`/dashboard/mitra/projects/${id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <ClientPayment 
          projectId={id}
          projectTitle={payment.project.title}
          netAmount={payment.net_amount}
          platformFee={payment.platform_fee}
          totalAmount={payment.amount}
          orderId={payment.order_id}
          snapClientKey={process.env.MIDTRANS_CLIENT_KEY || ""}
        />
      </div>
    </div>
  );
}
