"use client";

import { useActionState, useState } from "react";
import { registerMahasiswaAction, registerMitraAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Zap, ShieldCheck, ArrowLeft, GraduationCap, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [role, setRole] = useState<"MAHASISWA" | "MITRA">("MAHASISWA");
  const [mhsState, mhsAction, isMhsPending] = useActionState(registerMahasiswaAction, null);
  const [mitraState, mitraAction, isMitraPending] = useActionState(registerMitraAction, null);

  const isPending = isMhsPending || isMitraPending;
  const state = role === "MAHASISWA" ? mhsState : mitraState;

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Left side: branding/visuals (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glowing background meshes */}
        <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <Link href="/" className="flex items-center gap-2 group relative z-10 self-start">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            SkillBridge<span className="text-indigo-500">.</span>
          </span>
        </Link>

        <div className="space-y-6 relative z-10 my-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold leading-tight tracking-tight"
          >
            Langkah Awal <br />
            Membangun Portofolio Nyata.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-sm leading-relaxed max-w-sm"
          >
            Bergabunglah dengan SkillBridge hari ini. Selesaikan proyek, kumpulkan reputasi, dan dapatkan sertifikat penunjang karir profesional Anda.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 pt-4"
          >
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">✓</div>
              <p className="text-xs text-slate-300 font-semibold">Bekerjasama dengan UMKM, Startup, & Instansi Resmi</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">✓</div>
              <p className="text-xs text-slate-300 font-semibold">Tingkatkan Portofolio Anda dengan Sertifikat SKPI</p>
            </div>
          </motion.div>
        </div>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 relative z-10">
          <ShieldCheck className="w-4.5 h-4.5 text-indigo-500" />
          Data Aman & Terenkripsi
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 py-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          
          <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-3xl p-4 md:p-6">
            <CardHeader className="space-y-4 text-center pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Daftar Akun Baru</CardTitle>
                <CardDescription className="text-slate-500 font-semibold text-sm">
                  Bergabung dengan ekosistem SkillBridge
                </CardDescription>
              </div>

              {/* Tab Selector Role */}
              <div className="flex p-1 bg-slate-100 rounded-xl relative">
                <button
                  type="button"
                  onClick={() => setRole("MAHASISWA")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 relative z-10 ${role === "MAHASISWA" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Mahasiswa
                </button>
                <button
                  type="button"
                  onClick={() => setRole("MITRA")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 relative z-10 ${role === "MITRA" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Building2 className="w-4 h-4" />
                  Mitra Industri
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form action={role === "MAHASISWA" ? mhsAction : mitraAction} className="space-y-4">
                {state?.message && !state.errors && (
                  <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                    <AlertCircle className="w-4 h-4" />
                    {state.message}
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  {role === "MAHASISWA" ? (
                    <motion.div
                      key="mahasiswa-fields"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Nama Lengkap</Label>
                        <Input id="name" name="name" placeholder="John Doe" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mhsState?.errors?.name ? "border-rose-500" : ""}`} />
                        {mhsState?.errors?.name && <p className="text-xs text-rose-500 font-semibold">{mhsState.errors.name[0]}</p>}
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email Kampus / Pribadi</Label>
                        <Input id="email" name="email" type="email" placeholder="email@kampus.ac.id" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mhsState?.errors?.email ? "border-rose-500" : ""}`} />
                        {mhsState?.errors?.email && <p className="text-xs text-rose-500 font-semibold">{mhsState.errors.email[0]}</p>}
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Nomor WhatsApp</Label>
                        <Input id="phone" name="phone" placeholder="08123456789" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mhsState?.errors?.phone ? "border-rose-500" : ""}`} />
                        {mhsState?.errors?.phone && <p className="text-xs text-rose-500 font-semibold">{mhsState.errors.phone[0]}</p>}
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Password</Label>
                        <Input id="password" name="password" type="password" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mhsState?.errors?.password ? "border-rose-500" : ""}`} />
                        {mhsState?.errors?.password && <p className="text-xs text-rose-500 font-semibold">{mhsState.errors.password[0]}</p>}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mitra-fields"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="mitra_name" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Nama Instansi</Label>
                          <Input id="mitra_name" name="mitra_name" placeholder="PT Contoh Sukses" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.mitra_name ? "border-rose-500" : ""}`} />
                          {mitraState?.errors?.mitra_name && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.mitra_name[0]}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="mitra_type" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Jenis Instansi</Label>
                          <Input id="mitra_type" name="mitra_type" placeholder="UMKM, Startup" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.mitra_type ? "border-rose-500" : ""}`} />
                          {mitraState?.errors?.mitra_type && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.mitra_type[0]}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="responsible_person" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">PIC Penanggung Jawab</Label>
                          <Input id="responsible_person" name="responsible_person" placeholder="Jane Doe" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.responsible_person ? "border-rose-500" : ""}`} />
                          {mitraState?.errors?.responsible_person && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.responsible_person[0]}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="position" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Jabatan PIC</Label>
                          <Input id="position" name="position" placeholder="Owner / Manager" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.position ? "border-rose-500" : ""}`} />
                          {mitraState?.errors?.position && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.position[0]}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email Bisnis</Label>
                        <Input id="email" name="email" type="email" placeholder="contact@bisnis.com" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.email ? "border-rose-500" : ""}`} />
                        {mitraState?.errors?.email && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.email[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Nomor WhatsApp PIC</Label>
                        <Input id="phone" name="phone" placeholder="08123456789" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.phone ? "border-rose-500" : ""}`} />
                        {mitraState?.errors?.phone && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.phone[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Password</Label>
                        <Input id="password" name="password" type="password" disabled={isPending} required className={`h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 ${mitraState?.errors?.password ? "border-rose-500" : ""}`} />
                        {mitraState?.errors?.password && <p className="text-xs text-rose-500 font-semibold">{mitraState.errors.password[0]}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 transition-all mt-6" disabled={isPending}>
                  {isPending ? "Memproses..." : "Daftar Akun"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center justify-center pt-2 pb-0">
              <div className="text-xs text-slate-500 font-semibold">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Masuk di sini
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
