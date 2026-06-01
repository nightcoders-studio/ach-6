"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Zap, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

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
            Mulai Langkah Nyata <br />
            Membangun Portofoliomu.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-sm leading-relaxed max-w-sm"
          >
            Masuk ke akun SkillBridge Anda untuk mengakses ratusan micro-project berbayar dari mitra UMKM, startup, dan instansi nasional.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 pt-4"
          >
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">✓</div>
              <p className="text-xs text-slate-300 font-semibold">Semua data transaksi dijamin oleh escrow Midtrans</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">✓</div>
              <p className="text-xs text-slate-300 font-semibold">Sertifikasi digital tervalidasi pendamping SKPI</p>
            </div>
          </motion.div>
        </div>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 relative z-10">
          <ShieldCheck className="w-4.5 h-4.5 text-indigo-500" />
          Platform Terproteksi SSL 256-bit
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          
          <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-3xl p-4 md:p-6">
            <CardHeader className="space-y-2 text-center pb-4">
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Selamat Datang</CardTitle>
              <CardDescription className="text-slate-500 font-semibold text-sm">
                Masuk ke akun SkillBridge Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                {state?.message && !state.errors && (
                  <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                    <AlertCircle className="w-4 h-4" />
                    {state.message}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@contoh.com"
                    autoComplete="email"
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                    disabled={isPending}
                  />
                  {state?.errors?.email && (
                    <p className="text-xs text-rose-500 font-semibold">{state.errors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                    disabled={isPending}
                  />
                  {state?.errors?.password && (
                    <p className="text-xs text-rose-500 font-semibold">{state.errors.password[0]}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 transition-all mt-4" disabled={isPending}>
                  {isPending ? "Memproses..." : "Masuk ke Akun"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center pt-2 pb-0">
              <div className="text-xs text-slate-500 font-semibold">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Daftar sekarang
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
