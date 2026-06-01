"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreditCard, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

interface ClientPaymentProps {
  projectId: string;
  projectTitle: string;
  netAmount: number;
  platformFee: number;
  totalAmount: number;
  orderId: string;
  snapClientKey: string;
}

export function ClientPayment({
  projectId,
  projectTitle,
  netAmount,
  platformFee,
  totalAmount,
  orderId,
  snapClientKey
}: ClientPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap Script
    const scriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.setAttribute("data-client-key", snapClientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [snapClientKey]);

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

      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          alert("Pembayaran Berhasil!");
          window.location.href = `/dashboard/mitra/projects/${projectId}`;
        },
        onPending: function (result: any) {
          alert("Menunggu pembayaran Anda.");
        },
        onError: function (result: any) {
          alert("Pembayaran Gagal.");
        },
        onClose: function () {
          alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
        }
      });

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader className="border-b border-slate-100 pb-6 text-center">
        <div className="mx-auto bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">Selesaikan Pembayaran</CardTitle>
        <CardDescription>
          Pembayaran Anda akan diamankan oleh sistem (Escrow) hingga project selesai.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Rincian Tagihan</h3>
          
          <div className="flex justify-between items-start text-sm">
            <span className="text-slate-600">Project: {projectTitle}</span>
            <span className="font-medium">Rp {netAmount.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex justify-between items-start text-sm">
            <span className="text-slate-600">Biaya Layanan Platform (3%)</span>
            <span className="font-medium">Rp {platformFee.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <span className="font-bold text-slate-900 text-lg">Total Pembayaran</span>
          <span className="font-bold text-indigo-600 text-xl">Rp {totalAmount.toLocaleString("id-ID")}</span>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-500 text-center">
          Order ID: {orderId}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <Button 
          onClick={handlePayment} 
          disabled={isLoading} 
          className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {isLoading ? "Memproses..." : "Bayar Sekarang"}
        </Button>
        <p className="text-xs text-center text-slate-400 w-full flex items-center justify-center">
          <ShieldCheck className="w-3 h-3 mr-1" /> Transaksi Aman melalui Midtrans
        </p>
      </CardFooter>
    </Card>
  );
}
