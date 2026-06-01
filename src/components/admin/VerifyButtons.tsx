"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyMahasiswaAction, verifyMitraAction } from "@/app/actions/superuser";
import { Loader2, Check, X } from "lucide-react";

interface VerifyButtonsProps {
  id: string;
  type: "MAHASISWA" | "MITRA";
}

export function VerifyButtons({ id, type }: VerifyButtonsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleVerify = async (action: "VERIFIED" | "REJECTED") => {
    setIsPending(true);
    try {
      if (type === "MAHASISWA") {
        await verifyMahasiswaAction(id, action);
      } else {
        await verifyMitraAction(id, action);
      }
    } catch {
      alert("Terjadi kesalahan sistem saat memproses.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex gap-2 pt-2">
      <Button 
        size="sm" 
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={() => handleVerify("VERIFIED")}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1"/> Setujui</>}
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => handleVerify("REJECTED")}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1"/> Tolak</>}
      </Button>
    </div>
  );
}
