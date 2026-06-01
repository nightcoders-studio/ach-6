import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppSidebarLayout from "@/components/dashboard/AppSidebarLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SkillBridge",
  description: "Platform Micro-Project Khusus Mahasiswa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  let studentProfile = null;
  let mitraProfile = null;

  if (session) {
    try {
      if (session.role === "MAHASISWA") {
        studentProfile = await prisma.studentProfile.findUnique({
          where: { user_id: session.id },
          include: { user: { select: { name: true, email: true } } }
        });
      } else if (session.role === "MITRA") {
        mitraProfile = await prisma.mitraProfile.findUnique({
          where: { user_id: session.id },
          include: { user: { select: { email: true } } }
        });
      }
    } catch (err) {
      console.error("Layout profile fetch failed:", err);
    }
  }

  async function handleLogout() {
    "use server";
    const { deleteSession } = await import("@/lib/auth");
    await deleteSession();
    const { redirect } = await import("next/navigation");
    redirect("/auth/login");
  }

  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900" suppressHydrationWarning>
        <AppSidebarLayout
          session={session}
          studentProfile={studentProfile}
          mitraProfile={mitraProfile}
          logoutAction={handleLogout}
        >
          {children}
        </AppSidebarLayout>
      </body>
    </html>
  );
}
