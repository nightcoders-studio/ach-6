"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  LayoutDashboard, 
  Compass, 
  User, 
  Sparkles, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentSidebarProps {
  userName: string;
  userEmail: string;
  plan: string;
  logoutAction: () => Promise<void>;
}

export default function StudentSidebar({ 
  userName, 
  userEmail, 
  plan, 
  logoutAction 
}: StudentSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/mahasiswa", icon: LayoutDashboard },
    { name: "Eksplor Project", href: "/projects", icon: Compass },
    { name: "Profil Saya", href: "/dashboard/mahasiswa/profile", icon: User },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-6 justify-between select-none">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            SkillBridge<span className="text-indigo-500">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}>
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? "translate-x-0.5" : "opacity-0 group-hover:opacity-100"}`} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Promo Plan Banner */}
        {plan !== "PRO" && (
          <div className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-900/50 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-indigo-500/20 rounded-full blur-xl" />
            <Sparkles className="w-5 h-5 text-indigo-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Upgrade ke PRO</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
              Dapatkan akses ekspor portofolio PDF resmi dan prioritas bid.
            </p>
            <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold mt-3 border-0">
              Upgrade Sekarang
            </Button>
          </div>
        )}
      </div>

      {/* User Section / Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {userName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{userEmail}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <button 
            type="submit" 
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Navbar */}
      <div className="lg:hidden bg-slate-950 text-white h-16 px-6 flex items-center justify-between border-b border-slate-900 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">SkillBridge</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-slate-900 transform lg:transform-none transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:sticky lg:h-screen lg:flex lg:flex-col shrink-0`}>
        {sidebarContent}
      </aside>
    </>
  );
}
