import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BankAccountForm } from "./BankAccountForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, User, FileBadge2 } from "lucide-react";

export default async function MahasiswaProfilePage() {
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    redirect("/auth/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { user_id: session.id },
    include: {
      bank_accounts: true
    }
  });

  if (!profile) {
    redirect("/onboarding/mahasiswa");
  }

  const bankAccount = profile.bank_accounts[0] || null;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi pribadi dan data pembayaran Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-indigo-600" /> Data Diri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Nama Lengkap</p>
              <p className="font-semibold text-slate-900">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Universitas</p>
              <p className="font-semibold text-slate-900">{profile.university}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Keahlian (Skills)</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.skills && profile.skills.length > 0 ? (
                  Array.isArray(profile.skills) ? profile.skills.map((s: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">
                      {s}
                    </span>
                  )) : (
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">
                      {String(profile.skills)}
                    </span>
                  )
                ) : (
                  <span className="text-sm text-slate-400">Belum diisi</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Portofolio Link</p>
              <p className="text-sm text-indigo-600 hover:underline">{profile.portfolio_link || "Belum ada"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Landmark className="w-5 h-5 mr-2 text-green-600" /> Rekening Pencairan
            </CardTitle>
            <CardDescription>
              Diperlukan agar Superuser dapat mentransfer dana proyek yang telah selesai ke rekening Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankAccountForm initialData={bankAccount} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
