import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Mitra</h1>
            <p className="text-slate-500 mt-2">Selamat datang, {profile.mitra_name}. Kelola project Anda di sini.</p>
          </div>
          <Link href="/dashboard/mitra/projects/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <PlusCircle className="w-4 h-4 mr-2" /> Buat Project Baru
            </Button>
          </Link>
        </div>

        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg">Daftar Project Saya</CardTitle>
            <CardDescription>Semua project yang pernah Anda publikasikan.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Anda belum membuat project apa pun.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors gap-4">
                  <div>
                    <Link href={`/dashboard/mitra/projects/${project.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline">
                      {project.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">{project.status}</Badge>
                      <span className="text-xs text-slate-500">{project._count.bids} penawaran (bids) masuk</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/mitra/projects/${project.id}`}>
                    <Button variant="outline" size="sm">Lihat Penawaran</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
