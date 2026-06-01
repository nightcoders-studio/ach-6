import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SuperuserDashboard() {
  const session = await getSession();
  if (!session || session.role !== "SUPERUSER") {
    redirect("/auth/login");
  }

  const pendingMahasiswa = await prisma.studentProfile.findMany({
    where: { verification_status: "PENDING", nim: { not: "" } },
    include: { user: true },
  });

  const pendingMitra = await prisma.mitraProfile.findMany({
    where: { verification_status: "PENDING", address: { not: null } },
    include: { user: true },
  });

  const completedProjects = await prisma.project.findMany({
    where: { status: "COMPLETED" },
    include: { 
      mitra: { include: { user: true } },
      assignments: { include: { student: { include: { user: true } } } },
      payments: { where: { payment_status: "SECURED" } }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Superuser Dashboard</h1>
          <p className="text-slate-500 mt-2">Kelola persetujuan verifikasi Mahasiswa dan Mitra.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mahasiswa Pending */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Antrean Verifikasi Mahasiswa</CardTitle>
              <CardDescription>Menunggu persetujuan admin</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {pendingMahasiswa.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Tidak ada antrean.</p>
              ) : (
                pendingMahasiswa.map((mhs) => (
                  <div key={mhs.id} className="flex flex-col space-y-2 p-4 border border-slate-100 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{mhs.user.name}</p>
                        <p className="text-sm text-slate-500">{mhs.university} - {mhs.study_program}</p>
                        <p className="text-xs text-slate-400 mt-1">NIM: {mhs.nim}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="w-full">Setujui</Button>
                      <Button size="sm" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Tolak</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Mitra Pending */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Antrean Verifikasi Mitra</CardTitle>
              <CardDescription>Menunggu persetujuan admin</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {pendingMitra.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Tidak ada antrean.</p>
              ) : (
                pendingMitra.map((mitra) => (
                  <div key={mitra.id} className="flex flex-col space-y-2 p-4 border border-slate-100 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{mitra.mitra_name}</p>
                        <p className="text-sm text-slate-500">{mitra.mitra_type}</p>
                        <p className="text-xs text-slate-400 mt-1">PIC: {mitra.responsible_person}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="w-full">Setujui</Button>
                      <Button size="sm" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Tolak</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payout Queue */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg">Antrean Pencairan Dana (Payout)</CardTitle>
            <CardDescription>Project yang sudah selesai dan dana escrow siap dicairkan ke Mahasiswa.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {completedProjects.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Tidak ada antrean pencairan dana.</p>
            ) : (
              completedProjects.map((project) => {
                const payment = project.payments[0];
                const assignment = project.assignments[0];
                if (!payment || !assignment) return null;

                return (
                  <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-lg gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{project.title}</p>
                      <p className="text-sm text-slate-500">Pekerja: {assignment.student.user.name}</p>
                      <p className="text-xs text-slate-400 mt-1">Klien: {project.mitra.user.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-bold text-indigo-600">Rp {payment.net_amount.toLocaleString("id-ID")}</p>
                      <form action="/api/payout/simulate" method="POST">
                        <input type="hidden" name="project_id" value={project.id} />
                        <input type="hidden" name="student_id" value={assignment.student.id} />
                        <input type="hidden" name="amount" value={payment.net_amount} />
                        <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800">Simulasi Cairkan Dana</Button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
