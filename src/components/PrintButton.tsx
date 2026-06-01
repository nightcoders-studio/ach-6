"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800">
      <Printer className="w-4 h-4 mr-2" /> Cetak / Simpan PDF
    </Button>
  );
}
