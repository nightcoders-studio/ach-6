import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Briefcase, 
  Award, 
  FileText, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from "lucide-react";

export default async function MahasiswaDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    redirect("/auth/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { user_id: session.id },
    include: { user: true }
  });

  if (!profile) redirect("/onboarding/mahasiswa");

  const bids = await prisma.bid.findMany({
    where: { student_id: profile.id },
    include: { project: true },
    orderBy: { created_at: "desc" }
  });

  const activeProjects = await prisma.projectAssignment.findMany({
    where: { student_id: profile.id },
    include: { project: true },
    orderBy: { assigned_at: "desc" }
  });

  // Calculate statistics
  const completedProjects = activeProjects.filter(p => p.status === "COMPLETED").length;
  const inProgressProjects = activeProjects.filter(p => p.status !== "COMPLETED").length;

  return (
    <main className="min-h-screen p-6 lg:p-10 space-y-10 bg-slate-50 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Welcome Section */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm max-w-lg">
            Selamat datang kembali, <span className="text-slate-800 font-bold">{profile.user.name}</span>. Terus kembangkan portofolio Anda dan temukan proyek menarik hari ini.
          </p>
        </div>
        <div className="flex shrink-0">
          {profile.plan !== "PRO" ? (
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold rounded-2xl shadow-lg shadow-orange-500/25 text-white border-0 flex items-center gap-2 px-6 transition-all hover:scale-105 active:scale-95">
              <Sparkles className="w-5 h-5" /> Upgrade ke PRO
            </Button>
          ) : (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-2xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-indigo-500/25">
              <Award className="w-5 h-5" /> Mahasiswa PRO
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Project Berjalan",
            value: inProgressProjects,
            desc: "Proyek aktif dikerjakan",
            icon: <Clock className="w-6 h-6 text-amber-500" />,
            color: "from-amber-500/20 to-orange-500/5",
            borderColor: "border-amber-200/50",
            iconBg: "bg-amber-100"
          },
          {
            title: "Project Selesai",
            value: completedProjects,
            desc: "Portofolio terbangun",
            icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
            color: "from-emerald-500/20 to-teal-500/5",
            borderColor: "border-emerald-200/50",
            iconBg: "bg-emerald-100"
          },
          {
            title: "Total Bid",
            value: bids.length,
            desc: "Penawaran dikirim",
            icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
            color: "from-indigo-500/20 to-blue-500/5",
            borderColor: "border-indigo-200/50",
            iconBg: "bg-indigo-100"
          },
          {
            title: "Status Akun",
            value: profile.plan || "BASIC",
            desc: "Akses fitur saat ini",
            icon: <Award className="w-6 h-6 text-purple-500" />,
            color: "from-purple-500/20 to-pink-500/5",
            borderColor: "border-purple-200/50",
            iconBg: "bg-purple-100"
          }
        ].map((stat, i) => (
          <div key={i} className={`p-6 bg-white/80 backdrop-blur-md rounded-3xl border ${stat.borderColor} shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500">{stat.desc}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-inner`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Projects Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspace Aktif</h2>
              <p className="text-sm text-slate-500 font-medium">Tugas yang saat ini sedang Anda kerjakan.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
              {activeProjects.length}
            </div>
          </div>

          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 border-dashed rounded-3xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Belum Ada Proyek Aktif</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Mulai perjalanan karir Anda dengan mencari dan memberikan penawaran pada proyek yang tersedia.</p>
                <Link href="/projects">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 font-semibold px-6">
                    Jelajahi Proyek
                  </Button>
                </Link>
              </div>
            ) : (
              activeProjects.map((assignment) => (
                <div key={assignment.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold border-0 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">
                          {assignment.project.status.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 font-bold border-slate-200 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">
                          Status: {assignment.status}
                        </Badge>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xl group-hover:text-indigo-700 transition-colors">{assignment.project.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        Dimulai: <span className="text-slate-700 font-bold">{new Date(assignment.assigned_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 w-full md:w-auto">
                      {assignment.status === "COMPLETED" ? (
                        <div className="flex flex-col gap-2 w-full">
                          <Link href={`/certificates/${assignment.project.id}`} className="w-full">
                            <Button variant="outline" className="w-full justify-center text-sm font-bold text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl transition-all shadow-sm">
                              <Award className="w-4 h-4 mr-2" /> Sertifikat
                            </Button>
                          </Link>
                          {profile.plan === "PRO" ? (
                            <Link href={`/portfolios/${assignment.project.id}`} className="w-full">
                              <Button variant="outline" className="w-full justify-center text-sm font-bold text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all shadow-sm">
                                <FileText className="w-4 h-4 mr-2" /> Export Portfolio
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="outline" disabled className="w-full justify-center text-sm font-semibold text-slate-400 border-slate-200 rounded-xl bg-slate-50" title="Upgrade ke PRO">
                              Portfolio (Pro)
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Link href={`/dashboard/mahasiswa/projects/${assignment.project.id}`} className="block w-full">
                          <Button className="w-full justify-center bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all">
                            Ruang Kerja <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bid History Block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Bid</h2>
              <p className="text-sm text-slate-500 font-medium">Status penawaran Anda.</p>
            </div>
            <Link href="/projects" className="text-indigo-600 hover:text-indigo-700 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors">
              <Compass className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-2 shadow-xl shadow-slate-200/30">
            {bids.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-500">Anda belum mengajukan bid apapun.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {bids.map((bid) => (
                  <div key={bid.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group cursor-default">
                    <div className="min-w-0 flex-1">
                      <Link href={`/projects/${bid.project.id}`} className="block">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {bid.project.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Tawaran: <span className="text-emerald-600 font-bold">Rp {bid.bid_price.toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      {bid.status === "SUBMITTED" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          Menunggu
                        </span>
                      )}
                      {bid.status === "ACCEPTED" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                          Diterima
                        </span>
                      )}
                      {bid.status === "REJECTED" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-4 border-t border-slate-50 mt-2">
              <Link href="/projects" className="block w-full">
                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold text-sm h-12">
                  Cari Proyek Baru <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
