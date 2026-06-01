"use client";

import { useActionState, useState, useRef } from "react";
import { submitMitraOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, UploadCloud, FileText } from "lucide-react";

export default function OnboardingMitraPage() {
  const [state, formAction, isPending] = useActionState(submitMitraOnboarding, null);
  const [nibFile, setNibFile] = useState<File | null>(null);
  const nibInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-sm border-slate-200 bg-white">
        <CardHeader className="space-y-2 border-b border-slate-100 pb-6 mb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Lengkapi Profil Instansi
          </CardTitle>
          <CardDescription className="text-slate-500">
            Unggah dokumen dan lengkapi detail profil instansi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state?.message && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {state.message}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" name="address" placeholder="Jl. Sudirman No. 123, Jakarta" required disabled={isPending} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Deskripsi Instansi / Bisnis</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ceritakan sedikit tentang instansi Anda" 
                  required 
                  disabled={isPending} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website (Opsional)</Label>
                <Input id="website_url" name="website_url" placeholder="https://contoh.com" disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_media_url">Media Sosial (Opsional)</Label>
                <Input id="social_media_url" name="social_media_url" placeholder="https://instagram.com/contoh" disabled={isPending} />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Legalitas Instansi (Opsional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nib_number">Nomor Induk Berusaha (NIB)</Label>
                <Input id="nib_number" name="nib_number" placeholder="1234567890123" disabled={isPending} />
              </div>

              <div className="space-y-2">
                <Label>Scan Dokumen NIB (Jika ada NIB)</Label>
                <div 
                  onClick={() => nibInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${nibFile ? "border-green-400 bg-green-50 text-green-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {nibFile ? (
                    <>
                      <FileText className="w-8 h-8 mb-2 text-green-500" />
                      <span className="text-sm font-medium">{nibFile.name}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="text-sm">Klik untuk memilih file PDF/JPG</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                  ref={nibInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNibFile(e.target.files[0]);
                    }
                  }}
                />
                <input type="hidden" name="nib_file_url" value={nibFile ? `https://storage.skillbridge.com/docs/${nibFile.name}` : ""} />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Kirim Pengajuan Verifikasi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
