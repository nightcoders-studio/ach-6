"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface SuperuserSidebarProps {
  userEmail: string;
  logoutAction: () => Promise<void>;
}

export default function SuperuserSidebar({ 
  userEmail, 
  logoutAction 
}: SuperuserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard Utama", href: "/dashboard/superuser", icon: LayoutDashboard },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-6 justify-between select-none">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-black text-lg tracking-tight text-white">
            SkillBridge<span className="text-indigo-500">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Superuser Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? "bg-indigo-600/10 text-indigo-400 font-medium" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-500" : "text-slate-500 group-hover:text-slate-400"}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-500" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-200 truncate">Super Admin</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => logoutAction()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header & Trigger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">SkillBridge.</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 bg-slate-900 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-slate-950 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        lg:sticky lg:h-screen lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white lg:hidden z-50 bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
