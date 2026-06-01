"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreditCard, ShieldCheck, Zap } from "lucide-react";

interface ClientPaymentProps {
  projectId: string;
  projectTitle: string;
  netAmount: number;
  platformFee: number;
  totalAmount: number;
  orderId: string;
  snapClientKey?: string; // Optional for compatibility
}

export function ClientPayment({
  projectId,
  projectTitle,
  netAmount,
  platformFee,
  totalAmount,
  orderId,
}: ClientPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membuat transaksi");
        setIsLoading(false);
        return;
      }

      alert("Pembayaran berhasil disimulasikan (MVP Mode)!");
      window.location.href = `/dashboard/mitra/projects/${projectId}`;

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-indigo-100 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-emerald-500" />
      <CardHeader className="border-b border-slate-100 pb-6 text-center pt-8">
        <div className="mx-auto bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Zap className="w-8 h-8 text-indigo-600" />
        </div>
        <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Simulasi Pembayaran</CardTitle>
        <CardDescription className="text-sm font-medium mt-2 max-w-sm mx-auto">
          Mode MVP: Klik tombol di bawah untuk menyimulasikan pembayaran instan tanpa payment gateway pihak ketiga.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-8 space-y-6 px-8">
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-3 uppercase text-xs tracking-wider">Rincian Tagihan</h3>
          
          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-slate-500 font-semibold truncate max-w-[200px]">{projectTitle}</span>
            <span className="font-bold text-slate-700">Rp {netAmount.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-semibold">Biaya Layanan Platform (3%)</span>
            <span className="font-bold text-slate-700">Rp {platformFee.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 px-2">
          <span className="font-black text-slate-900 text-lg uppercase tracking-wider">Total Pembayaran</span>
          <span className="font-black text-indigo-600 text-2xl tracking-tight">Rp {totalAmount.toLocaleString("id-ID")}</span>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-xl text-xs text-amber-700 font-bold text-center border border-amber-100 shadow-inner">
          Order ID: {orderId} (Simulator Mode)
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 pb-8 px-8 border-t border-slate-100 mt-4">
        <Button 
          onClick={handlePayment} 
          disabled={isLoading} 
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 border-0"
        >
          <CreditCard className="w-6 h-6 mr-2" />
          {isLoading ? "Memproses Simulasi..." : "Bayar Sekarang (Simulasi)"}
        </Button>
        <p className="text-xs text-center text-slate-500 font-medium w-full flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transaksi instan & langsung memicu Ruang Kerja
        </p>
      </CardFooter>
    </Card>
  );
}
