import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Mahasiswa</h1>
          <p className="text-slate-500 mt-2">Selamat datang, {profile.user.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Project Aktif Saya</span>
                <Badge className="bg-indigo-600">{activeProjects.length}</Badge>
              </CardTitle>
              <CardDescription>Project yang sedang Anda kerjakan.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {activeProjects.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada project aktif.</p>
              ) : (
                activeProjects.map((assignment) => (
                  <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 line-clamp-1">{assignment.project.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{assignment.status}</Badge>
                        <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200">{assignment.project.status}</Badge>
                      </div>
                    </div>
                    <Link href={`/dashboard/mahasiswa/projects/${assignment.project.id}`}>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">Masuk Ruang Kerja</Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Riwayat Bid (Penawaran)</span>
                <Badge variant="secondary">{bids.length}</Badge>
              </CardTitle>
              <CardDescription>Status penawaran project yang pernah Anda ajukan.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {bids.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Anda belum pernah melakukan bid.</p>
              ) : (
                bids.map((bid) => (
                  <div key={bid.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-1 hover:underline hover:text-indigo-600 cursor-pointer">
                        <Link href={`/projects/${bid.project.id}`}>{bid.project.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Tawaran: Rp {bid.bid_price.toLocaleString("id-ID")}</p>
                    </div>
                    <div>
                      {bid.status === "SUBMITTED" && <Badge variant="secondary" className="bg-slate-100">Menunggu</Badge>}
                      {bid.status === "ACCEPTED" && <Badge className="bg-green-500">Diterima</Badge>}
                      {bid.status === "REJECTED" && <Badge variant="destructive">Ditolak</Badge>}
                    </div>
                  </div>
                ))
              )}
              <div className="pt-4 mt-2">
                <Link href="/projects">
                  <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Briefcase className="w-4 h-4 mr-2" /> Cari Project Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
