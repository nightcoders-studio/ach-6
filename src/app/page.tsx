"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Check, 
  Terminal, 
  DollarSign, 
  Clock, 
  Award,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<null | {
    title: string;
    category: string;
    budget: string;
    duration: string;
    description: string;
    deliverables: string[];
    skills: string[];
  }>(null);

  const mockGenerateBrief = () => {
    setAiGenerating(true);
    setGeneratedBrief(null);
    setTimeout(() => {
      setGeneratedBrief({
        title: "Optimasi Landing Page & SEO Terintegrasi",
        category: "Web Development",
        budget: "Rp 2.500.000",
        duration: "10 Hari",
        description: "Mendesain ulang landing page untuk konversi penjualan yang lebih tinggi, serta mengintegrasikan Google Analytics dan memetakan metadata SEO dasar.",
        deliverables: [
          "Desain landing page responsif (Figma & React/Tailwind)",
          "Integrasi Google Tag Manager & Web Vitals",
          "Laporan audit performa SEO & Kecepatan Akses"
        ],
        skills: ["React", "Next.js", "SEO", "Tailwind CSS", "Figma"]
      });
      setAiGenerating(false);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-300/30 to-violet-300/20 blur-[100px]" />
        <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-300/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-100/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-800">
              SkillBridge<span className="text-indigo-600">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Fitur</a>
            <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">AI Generator</a>
            <a href="#projects" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Eksplorasi</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
              Masuk
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-md shadow-indigo-600/10 transition-all hover:translate-y-[-1px]">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-7 text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/50 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
              Platform Micro-Project Khusus Mahasiswa
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
            >
              Jembatan Menuju <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">
                Karir Profesionalmu.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl"
            >
              Kerjakan proyek riil berbayar dari mitra industri terpercaya. Bangun portofolio tervalidasi dan sertifikat otomatis untuk pendamping wisuda (SKPI) Anda.
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl w-full font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:translate-y-[-1px]">
                  Gabung sebagai Mahasiswa
                </Button>
              </Link>
              <Link href="/auth/register?role=mitra" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl w-full font-bold transition-all">
                  Cari Talenta Mitra
                </Button>
              </Link>
            </motion.div>

            {/* Quick Stats Banner */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100"
            >
              <div>
                <p className="text-3xl font-extrabold text-indigo-600">98%</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Tingkat Kelayakan</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">1.2k+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Proyek Selesai</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">48 Jam</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pencairan Escrow</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Visual Decorative Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] opacity-10 blur-2xl" />
            
            {/* High Fidelity App UI Representation */}
            <div className="relative bg-white rounded-[2rem] border border-slate-200/80 shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  SkillBridge Core V2
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {/* Active Project Card */}
                <div className="bg-indigo-50/40 rounded-2xl border border-indigo-100/80 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Dalam Pengerjaan
                    </span>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      3.500.000
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-3 text-base">Redesign Portal E-Learning Kampus</h4>
                  <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-500" /> Sisa 5 Hari</span>
                    <span>•</span>
                    <span>Student: Andika R.</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Progres Tugas</span>
                      <span>80%</span>
                    </div>
                    <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>

                {/* Second Status Item */}
                <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">Pembayaran Escrow</h5>
                      <p className="text-xs text-slate-500 font-medium">Terkunci secara otomatis</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Aman</span>
                </div>

                {/* Milestone Checklist */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Milestone Verifikasi</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
                    <span>Draft Kontrak Digital Disetujui</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
                    <span>Dana Dikunci di Escrow Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center" />
                    <span>Konfirmasi Deliverable Akhir</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-100 px-6 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Mengapa Harus SkillBridge?</h2>
            <p className="text-slate-600 text-lg">Platform modern yang menggabungkan kesiapan karir akademik dengan kebutuhan eksekusi bisnis yang serba cepat.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
                bg: "bg-indigo-50",
                title: "Micro-Project Riil",
                desc: "Kerjakan studi kasus nyata berskala pendek dari UMKM dan startup terverifikasi, bukan sekadar tugas fiktif kampus."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
                title: "Sistem Escrow Terintegrasi",
                desc: "Pembayaran klien dikunci sebelum pekerjaan dimulai. Mahasiswa dijamin menerima imbalan setelah tugas disetujui."
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-violet-600" />,
                bg: "bg-violet-50",
                title: "Pendamping Wisuda (SKPI)",
                desc: "Setiap proyek yang selesai secara otomatis menghasilkan sertifikat resmi dan portofolio PDF tervalidasi."
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group bg-slate-50/50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Brief Generator Demo Simulator */}
      <section id="demo" className="py-24 bg-slate-50/30 px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Workflow
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.15]">
                Buat Deskripsi Project Dalam Detik.
              </h2>
              <p className="text-slate-600 text-lg">
                Bagi Mitra/Klien, tidak perlu pusing memikirkan spesifikasi teknis. Cukup masukkan nama proyek secara singkat, dan AI kami akan menyusun rincian tugas, deliverable, estimasi harga, hingga rekomendasi skill secara instan.
              </p>
              <div>
                <Button 
                  onClick={mockGenerateBrief} 
                  disabled={aiGenerating}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-8 font-bold text-base shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 active:translate-y-[1px] transition-all"
                >
                  {aiGenerating ? "AI sedang menyusun..." : "Coba Simulasi AI Brief"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl p-6 text-slate-200 min-h-[380px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs font-mono text-purple-400">Brief Generator Console</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!aiGenerating && !generatedBrief && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 text-center space-y-4"
                      >
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <Terminal className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 text-sm font-semibold max-w-sm mx-auto">
                          Klik tombol di samping untuk melihat keajaiban bagaimana AI memformulasikan Brief Project secara terstruktur.
                        </p>
                      </motion.div>
                    )}

                    {aiGenerating && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-16 text-center space-y-4"
                      >
                        <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-purple-400 text-sm font-mono tracking-widest">
                          [ANALYZING SKILLS & MARKET BUDGETS...]
                        </p>
                      </motion.div>
                    )}

                    {generatedBrief && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md uppercase">
                              {generatedBrief.category}
                            </span>
                            <h3 className="font-extrabold text-white text-lg mt-2">{generatedBrief.title}</h3>
                          </div>
                          <div className="text-right">
                            <span className="block text-emerald-400 font-extrabold text-sm">{generatedBrief.budget}</span>
                            <span className="block text-slate-500 text-xs font-semibold">{generatedBrief.duration}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {generatedBrief.description}
                        </p>

                        <div className="space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-800/80">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Deliverable Project:</h4>
                          <ul className="text-xs space-y-1.5 text-slate-200">
                            {generatedBrief.deliverables.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {generatedBrief.skills.map((skill, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                              #{skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Live Projects */}
      <section id="projects" className="py-24 bg-white px-6 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Terbuka Terbaru</h2>
              <p className="text-slate-500 mt-2">Dapatkan inspirasi dari beragam micro-project nyata yang siap Anda bid saat ini.</p>
            </div>
            <Link href="/projects">
              <Button variant="ghost" className="font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl group">
                Lihat Semua Project 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pembuatan Modul CRUD & Integrasi Payment Gateway API",
                client: "Fintech Startup",
                budget: "Rp 3.000.000",
                duration: "2 Minggu",
                skills: ["Node.js", "Express", "Midtrans", "REST API"],
                bids: 5,
                color: "indigo"
              },
              {
                title: "Desain Sistem Manajemen Aset & Mockup UI",
                client: "Logistik UMKM Cirebon",
                budget: "Rp 1.800.000",
                duration: "8 Hari",
                skills: ["Figma", "UI/UX", "User Flow", "Wireframing"],
                bids: 3,
                color: "purple"
              },
              {
                title: "Pengembangan Landing Page Next.js & Tailwind CSS",
                client: "Agency Digital Lokal",
                budget: "Rp 2.000.000",
                duration: "10 Hari",
                skills: ["Next.js", "TailwindCSS", "Responsive Design"],
                bids: 9,
                color: "emerald"
              }
            ].map((proj, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                      {proj.client}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{proj.bids} Bidder</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                    {proj.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.skills.map((s, i) => (
                      <span key={i} className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 mt-6 pt-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maksimal Budget</span>
                    <span className="text-sm font-extrabold text-slate-900">{proj.budget}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {proj.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-25" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blur-[120px] opacity-20" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Mulai Bangun Portofoliomu Hari Ini.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Daftar sekarang secara gratis. Ratusan proyek riil dari para mitra terverifikasi menunggu eksekusi terbaik dari Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-base bg-white hover:bg-slate-100 text-slate-950 rounded-2xl w-full font-bold transition-all shadow-md shadow-white/5">
                  Daftar Sebagai Mahasiswa
                </Button>
              </Link>
              <Link href="/auth/register?role=mitra" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white rounded-2xl w-full font-bold transition-all">
                  Hubungi Tim Klien Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">SkillBridge</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              SkillBridge Nusantara menghubungkan talenta akademis mahasiswa dengan kecepatan dunia industri nyata untuk kolaborasi yang saling menguntungkan.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-semibold">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Hubungi Kami</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">Produk</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-semibold">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Eksplor Project</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Fitur AI Brief</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Sertifikat SKPI</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Mitrans Escrow</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 mt-12 pt-8 text-xs font-semibold text-slate-400">
          <p>© {new Date().getFullYear()} SkillBridge Nusantara. Semua Hak Dilindungi.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> ISO 27001 Certified</span>
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-indigo-500" /> Terakreditasi BAN-PT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
