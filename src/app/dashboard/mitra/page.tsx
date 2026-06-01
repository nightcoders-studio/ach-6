import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  PlusCircle, 
  Compass, 
  Briefcase, 
  MessageSquare, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default async function MitraDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const profile = await prisma.mitraProfile.findUnique({
    where: { user_id: session.id },
  });

  if (!profile) {
    redirect("/onboarding/mitra");
  }

  const projects = await prisma.project.findMany({
    where: { mitra_id: profile.id },
    include: { _count: { select: { bids: true } } },
    orderBy: { created_at: "desc" },
  });

  // Calculate statistics
  const totalBids = projects.reduce((acc, curr) => acc + curr._count.bids, 0);
  const activeProjects = projects.filter(p => p.status === "IN_PROGRESS" || p.status === "PAYMENT_SECURED").length;

  return (
    <main className="min-h-screen p-6 lg:p-10 space-y-10 bg-slate-50 relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Welcome Header */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900">
              Dashboard Mitra
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm max-w-xl">
              Selamat datang, <span className="font-bold text-slate-800">{profile.responsible_person}</span> dari <span className="font-bold text-slate-800">{profile.mitra_name}</span>. Publikasikan proyek Anda dan temukan talenta terbaik.
            </p>
          </div>
          <Link href="/dashboard/mitra/projects/create" className="shrink-0">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 border-0">
              <PlusCircle className="w-5 h-5 mr-2" /> Buat Project Baru
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Total Project",
              value: projects.length,
              desc: "Proyek yang dibuat",
              icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
              color: "from-indigo-500/20 to-blue-500/5",
              borderColor: "border-indigo-200/50",
              iconBg: "bg-indigo-100"
            },
            {
              title: "Project Berjalan",
              value: activeProjects,
              desc: "Sedang dikerjakan",
              icon: <Compass className="w-6 h-6 text-emerald-600" />,
              color: "from-emerald-500/20 to-teal-500/5",
              borderColor: "border-emerald-200/50",
              iconBg: "bg-emerald-100"
            },
            {
              title: "Total Bid Masuk",
              value: totalBids,
              desc: "Tawaran mahasiswa",
              icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
              color: "from-purple-500/20 to-pink-500/5",
              borderColor: "border-purple-200/50",
              iconBg: "bg-purple-100"
            }
          ].map((stat, i) => (
            <div key={i} className={`p-8 bg-white/80 backdrop-blur-md rounded-3xl border ${stat.borderColor} shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500">{stat.desc}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-inner`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects List */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Project</h2>
              <p className="text-sm text-slate-500 font-medium">Semua proyek yang telah dipublikasikan.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
            {projects.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-400">
                  <PlusCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Mulai Proyek Pertama Anda</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">Publikasikan kebutuhan desain, website, atau riset Anda untuk mulai mendapatkan penawaran dari mahasiswa terbaik.</p>
                </div>
                <Link href="/dashboard/mitra/projects/create" className="inline-block mt-4">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 px-8 h-12">
                    Buat Project Sekarang
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                    <div className="space-y-3">
                      <Link href={`/dashboard/mitra/projects/${project.id}`} className="inline-flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                        <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600">{project.title}</h3>
                        <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200/50">
                          {project.status.replace(/_/g, " ")}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {project._count.bids} Tawaran Masuk
                        </span>
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/mitra/projects/${project.id}`} className="shrink-0 w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all h-11 px-6">
                        Kelola Proyek <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
