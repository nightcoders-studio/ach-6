"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold text-xl tracking-tight text-slate-900">
            SkillBridge<span className="text-indigo-600">.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Masuk
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <motion.div 
          className="text-center max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-8">
            <Zap className="w-4 h-4" />
            Platform Micro-Project Khusus Mahasiswa
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Jembatan Menuju <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Karir Profesionalmu.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            SkillBridge menghubungkan mahasiswa bertalenta dengan mitra industri nyata untuk mengerjakan proyek singkat berbayar, sekaligus membangun portofolio otentik.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-8 text-base bg-slate-900 hover:bg-slate-800 text-white rounded-full w-full sm:w-auto shadow-xl shadow-slate-900/10">
                Gabung sebagai Mahasiswa
              </Button>
            </Link>
            <Link href="/auth/register?role=mitra">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-full w-full sm:w-auto">
                Cari Talenta Mitra
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa SkillBridge?</h2>
            <p className="text-slate-600">Ekosistem terpercaya yang dirancang khusus untuk memajukan karir mahasiswa melalui pengalaman kerja nyata.</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
                title: "Micro-Project Riil",
                desc: "Kerjakan studi kasus nyata dari UMKM dan startup, bukan sekadar tugas fiktif kampus."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                title: "Escrow Aman",
                desc: "Pembayaran klien diamankan di awal. Mahasiswa dijamin dibayar setelah tugas disetujui."
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-orange-600" />,
                title: "Portofolio Otomatis",
                desc: "Setiap tugas yang selesai otomatis menjadi dokumen portofolio sah pendamping SKPI."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Sistem Kerja Transparan dan Berorientasi Hasil.</h2>
            <p className="text-lg text-slate-600 mb-8">Tanpa proses rekrutmen panjang. Klien memposting brief yang dioptimalkan oleh AI, mahasiswa terpilih mengeksekusi, lalu dibayar.</p>
            
            <div className="space-y-6">
              {[
                "AI Brief Generator membantu klien membuat deskripsi tugas terstandar.",
                "Sistem Escrow Midtrans mengunci dana klien sebelum kerja dimulai.",
                "Sertifikat & Portofolio PDF otomatis diterbitkan saat project selesai."
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <p className="text-slate-700 font-medium">{text}</p>
                </div>
              ))}
            </div>
            
            <Button className="mt-10 group" variant="ghost">
              Pelajari Cara Kerja Detail
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="aspect-square rounded-3xl bg-slate-100 overflow-hidden relative shadow-2xl border-8 border-white">
              {/* Abstract Representation of App UI */}
              <div className="absolute inset-4 bg-white rounded-2xl shadow-inner border border-slate-100 p-6 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1 h-32 bg-indigo-50/50 rounded-xl border border-indigo-100 p-4">
                    <div className="h-4 w-1/2 bg-indigo-200 rounded-md mb-2"></div>
                    <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="flex-1 h-32 bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="h-4 w-1/2 bg-slate-200 rounded-md mb-2"></div>
                    <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
                <div className="h-48 w-full bg-slate-50 rounded-xl mt-4 border border-slate-100 p-4 flex flex-col gap-3">
                  <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-4/6 bg-slate-200 rounded-md"></div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pembayaran</p>
                <p className="font-bold text-slate-900">100% Aman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-40"></div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 relative z-10">Mulai Bangun Karirmu Hari Ini.</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">Daftar sekarang dan dapatkan akses ke ratusan micro-project dari mitra industri terverifikasi di seluruh Indonesia.</p>
          
          <Link href="/auth/register" className="relative z-10">
            <Button size="lg" className="h-14 px-8 text-base bg-white hover:bg-slate-100 text-slate-900 rounded-full">
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tight text-slate-900">
            SkillBridge<span className="text-indigo-600">.</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} SkillBridge Nusantara. Semua Hak Dilindungi.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900">Privasi</a>
            <a href="#" className="hover:text-slate-900">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-slate-900">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
