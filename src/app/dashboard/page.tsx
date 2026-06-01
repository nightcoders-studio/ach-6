import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Redirect based on role
  if (session.role === "SUPERUSER") {
    redirect("/dashboard/superuser");
  } else if (session.role === "MITRA") {
    redirect("/dashboard/mitra");
  } else if (session.role === "MAHASISWA") {
    redirect("/dashboard/mahasiswa");
  } else {
    // Fallback if role is undefined or unrecognized
    redirect("/auth/login");
  }
}
