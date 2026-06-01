"use client";

import { useActionState, useState } from "react";
import { registerMahasiswaAction, registerMitraAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"MAHASISWA" | "MITRA">("MAHASISWA");
  const [mhsState, mhsAction, isMhsPending] = useActionState(registerMahasiswaAction, null);
  const [mitraState, mitraAction, isMitraPending] = useActionState(registerMitraAction, null);

  const isPending = isMhsPending || isMitraPending;
  const state = role === "MAHASISWA" ? mhsState : mitraState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-lg shadow-sm border-slate-200">
        <CardHeader className="space-y-4 text-center">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Daftar Akun</CardTitle>
            <CardDescription className="text-slate-500">
              Bergabung dengan SkillBridge sekarang
            </CardDescription>
          </div>
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setRole("MAHASISWA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "MAHASISWA" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              Mahasiswa
            </button>
            <button
              onClick={() => setRole("MITRA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "MITRA" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              Mitra
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={role === "MAHASISWA" ? mhsAction : mitraAction} className="space-y-4">
            {state?.message && !state.errors && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {state.message}
              </div>
            )}
            
            {role === "MAHASISWA" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" name="name" placeholder="John Doe" disabled={isPending} required className={mhsState?.errors?.name ? "border-red-500" : ""} />
                  {mhsState?.errors?.name && <p className="text-sm text-red-500">{mhsState.errors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Kampus / Pribadi</Label>
                  <Input id="email" name="email" type="email" placeholder="email@kampus.ac.id" disabled={isPending} required className={mhsState?.errors?.email ? "border-red-500" : ""} />
                  {mhsState?.errors?.email && <p className="text-sm text-red-500">{mhsState.errors.email[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WhatsApp</Label>
                  <Input id="phone" name="phone" placeholder="08123456789" disabled={isPending} required className={mhsState?.errors?.phone ? "border-red-500" : ""} />
                  {mhsState?.errors?.phone && <p className="text-sm text-red-500">{mhsState.errors.phone[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" disabled={isPending} required className={mhsState?.errors?.password ? "border-red-500" : ""} />
                  {mhsState?.errors?.password && <p className="text-sm text-red-500">{mhsState.errors.password[0]}</p>}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mitra_name">Nama Instansi / Usaha</Label>
                  <Input id="mitra_name" name="mitra_name" placeholder="PT Contoh Sukses" disabled={isPending} required className={mitraState?.errors?.mitra_name ? "border-red-500" : ""} />
                  {mitraState?.errors?.mitra_name && <p className="text-sm text-red-500">{mitraState.errors.mitra_name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mitra_type">Jenis Instansi</Label>
                  <Input id="mitra_type" name="mitra_type" placeholder="UMKM, Startup, Kampus" disabled={isPending} required className={mitraState?.errors?.mitra_type ? "border-red-500" : ""} />
                  {mitraState?.errors?.mitra_type && <p className="text-sm text-red-500">{mitraState.errors.mitra_type[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible_person">Nama Penanggung Jawab</Label>
                  <Input id="responsible_person" name="responsible_person" placeholder="Jane Doe" disabled={isPending} required className={mitraState?.errors?.responsible_person ? "border-red-500" : ""} />
                  {mitraState?.errors?.responsible_person && <p className="text-sm text-red-500">{mitraState.errors.responsible_person[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <Input id="position" name="position" placeholder="Owner / Manager" disabled={isPending} required className={mitraState?.errors?.position ? "border-red-500" : ""} />
                  {mitraState?.errors?.position && <p className="text-sm text-red-500">{mitraState.errors.position[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Bisnis</Label>
                  <Input id="email" name="email" type="email" placeholder="contact@bisnis.com" disabled={isPending} required className={mitraState?.errors?.email ? "border-red-500" : ""} />
                  {mitraState?.errors?.email && <p className="text-sm text-red-500">{mitraState.errors.email[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WhatsApp PIC</Label>
                  <Input id="phone" name="phone" placeholder="08123456789" disabled={isPending} required className={mitraState?.errors?.phone ? "border-red-500" : ""} />
                  {mitraState?.errors?.phone && <p className="text-sm text-red-500">{mitraState.errors.phone[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" disabled={isPending} required className={mitraState?.errors?.password ? "border-red-500" : ""} />
                  {mitraState?.errors?.password && <p className="text-sm text-red-500">{mitraState.errors.password[0]}</p>}
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-6" disabled={isPending}>
              {isPending ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2">
          <div className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="font-semibold text-slate-900 hover:underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
