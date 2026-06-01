"use client";

import { useActionState } from "react";
import { updateBankAccountAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

interface BankAccountFormProps {
  initialData: {
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    verification_status: string;
  } | null;
}

export function BankAccountForm({ initialData }: BankAccountFormProps) {
  const [state, formAction, isPending] = useActionState(updateBankAccountAction, null);

  return (
    <form key={initialData?.account_number || "new-account"} action={formAction} className="space-y-4">
      {state?.success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center mb-4">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Data rekening berhasil disimpan!
        </div>
      )}
      
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
          {state.error}
        </div>
      )}

      {initialData?.verification_status === "VERIFIED" && (
        <div className="bg-indigo-50 text-indigo-700 p-3 rounded-md text-sm flex items-center mb-4 border border-indigo-100">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Rekening Terverifikasi
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="bank_name" className="text-slate-600">Nama Bank</Label>
        <Input 
          id="bank_name" 
          name="bank_name" 
          placeholder="Misal: BCA, BSI, Mandiri" 
          defaultValue={initialData?.bank_name || ""} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="account_number" className="text-slate-600">Nomor Rekening</Label>
        <Input 
          id="account_number" 
          name="account_number" 
          placeholder="Misal: 1234567890" 
          defaultValue={initialData?.account_number || ""} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="account_holder_name" className="text-slate-600">Atas Nama</Label>
        <Input 
          id="account_holder_name" 
          name="account_holder_name" 
          placeholder="Sesuai nama di buku tabungan" 
          defaultValue={initialData?.account_holder_name || ""} 
          required 
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-slate-900 hover:bg-slate-800" 
        disabled={isPending}
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
        ) : (
          "Simpan Rekening"
        )}
      </Button>
    </form>
  );
}
