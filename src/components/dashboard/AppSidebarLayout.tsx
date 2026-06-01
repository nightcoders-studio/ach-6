"use client";

import { usePathname } from "next/navigation";
import StudentSidebar from "./StudentSidebar";
import MitraSidebar from "./MitraSidebar";

interface AppSidebarLayoutProps {
  session: {
    id: string;
    email: string;
    role: string;
    name: string;
  } | null;
  studentProfile: {
    plan: string;
    user: { name: string; email: string };
  } | null;
  mitraProfile: {
    mitra_name: string;
    user: { email: string };
  } | null;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

export default function AppSidebarLayout({
  session,
  studentProfile,
  mitraProfile,
  logoutAction,
  children
}: AppSidebarLayoutProps) {
  const pathname = usePathname();

  // Define public routes where the sidebar should not be displayed
  const isPublicRoute = 
    pathname === "/" || 
    pathname.startsWith("/auth/") || 
    pathname.startsWith("/api/");

  if (isPublicRoute || !session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/50">
      {/* Conditionally render sidebar based on role */}
      {session.role === "MAHASISWA" && studentProfile && (
        <StudentSidebar
          userName={studentProfile.user.name}
          userEmail={studentProfile.user.email}
          plan={studentProfile.plan || "BASIC"}
          logoutAction={logoutAction}
        />
      )}

      {session.role === "MITRA" && mitraProfile && (
        <MitraSidebar
          mitraName={mitraProfile.mitra_name}
          userEmail={mitraProfile.user.email}
          logoutAction={logoutAction}
        />
      )}

      {/* Main Content Pane */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
