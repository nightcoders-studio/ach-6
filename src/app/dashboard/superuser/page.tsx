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
      </div>
    </div>
  );
}
