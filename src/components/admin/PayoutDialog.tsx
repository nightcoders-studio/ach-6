"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Landmark, ArrowRightLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PayoutDialogProps {
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  amount: number;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

export function PayoutDialog({
  projectId,
  projectTitle,
  studentId,
  studentName,
  amount,
  bankName,
  accountNumber,
  accountHolder,
}: PayoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const router = useRouter();

  const handlePayout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payout/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          student_id: studentId,
          amount: amount,
          bank_name: bankName || "N/A",
          account_number: accountNumber || "0000",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Terjadi kesalahan sistem.");
        setIsProcessing(false);
        return;
      }

      setReferenceId(data.referenceId);
      setIsSuccess(true);
      
      // Give time to read success message before refreshing
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Koneksi gagal.");
      setIsProcessing(false);
    }
  };

  const hasBankAccount = !!bankName && !!accountNumber;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isProcessing) setIsOpen(open);
      if (!open) {
        setIsSuccess(false);
        setReferenceId("");
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
          <Landmark className="w-4 h-4 mr-2" /> Cairkan Dana
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Dana Terkirim!</h2>
            <p className="text-slate-500 text-center text-sm px-4">
              Pencairan dana telah berhasil diteruskan ke bank tujuan melalui Payment Gateway.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full mt-4">
              <p className="text-xs text-slate-500 text-center uppercase tracking-widest">Ref ID</p>
              <p className="font-mono text-center font-bold text-slate-900">{referenceId}</p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Konfirmasi Pencairan Dana</DialogTitle>
              <DialogDescription>
                Tinjau rincian transfer sebelum memproses dana ke rekening mahasiswa.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Dari Escrow</span>
                  <span className="font-bold text-slate-900">SkillBridge Platform</span>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-slate-300 mx-4" />
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-500">Ke Rekening</span>
                  <span className="font-bold text-slate-900">{studentName}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Project</span>
                  <span className="font-medium text-right truncate w-[200px]">{projectTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bank Tujuan</span>
                  <span className="font-bold text-slate-900">{bankName || "Belum Diatur"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">No. Rekening</span>
                  <span className="font-mono font-medium">{accountNumber || "Belum Diatur"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Atas Nama</span>
                  <span className="font-medium uppercase">{accountHolder || "Belum Diatur"}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-900">Nominal Transfer</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">Rp {amount.toLocaleString("id-ID")}</span>
              </div>

              {!hasBankAccount && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                  Mahasiswa ini belum mendaftarkan rekening bank. Pencairan tidak dapat dilakukan.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>Batal</Button>
              <Button 
                onClick={handlePayout} 
                disabled={isProcessing || !hasBankAccount} 
                className="bg-indigo-600 hover:bg-indigo-700 w-[160px]"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
                ) : (
                  "Proses Transfer"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
