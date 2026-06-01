"use client";

import { useActionState, useState, useRef } from "react";
import { submitMahasiswaOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, UploadCloud, FileText } from "lucide-react";

export default function OnboardingMahasiswaPage() {
  const [state, formAction, isPending] = useActionState(submitMahasiswaOnboarding, null);
  const [ktmFile, setKtmFile] = useState<File | null>(null);
  const [krsFile, setKrsFile] = useState<File | null>(null);
  
  const ktmInputRef = useRef<HTMLInputElement>(null);
  const krsInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-sm border-slate-200 bg-white">
        <CardHeader className="space-y-2 border-b border-slate-100 pb-6 mb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Lengkapi Profil Mahasiswa
          </CardTitle>
          <CardDescription className="text-slate-500">
            Unggah dokumen verifikasi untuk mengaktifkan akun Anda.
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
              <div className="space-y-2">
                <Label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</Label>
                <Input id="nim" name="nim" placeholder="123456789" required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">Universitas</Label>
                <Input id="university" name="university" placeholder="Universitas Syiah Kuala" required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="study_program">Program Studi</Label>
                <Input id="study_program" name="study_program" placeholder="Informatika" required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester Saat Ini</Label>
                <Input id="semester" name="semester" type="number" min="1" max="14" placeholder="5" required disabled={isPending} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="domicile">Domisili Asal (Kota)</Label>
                <Input id="domicile" name="domicile" placeholder="Banda Aceh" required disabled={isPending} />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Upload Dokumen Verifikasi</h3>
              
              <div className="space-y-2">
                <Label>Scan KTM (Kartu Tanda Mahasiswa)</Label>
                <div 
                  onClick={() => ktmInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${ktmFile ? "border-green-400 bg-green-50 text-green-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {ktmFile ? (
                    <>
                      <FileText className="w-8 h-8 mb-2 text-green-500" />
                      <span className="text-sm font-medium">{ktmFile.name}</span>
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
                  name="ktm_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                  ref={ktmInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setKtmFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>KRS Semester Terakhir</Label>
                <div 
                  onClick={() => krsInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${krsFile ? "border-green-400 bg-green-50 text-green-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {krsFile ? (
                    <>
                      <FileText className="w-8 h-8 mb-2 text-green-500" />
                      <span className="text-sm font-medium">{krsFile.name}</span>
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
                  name="krs_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                  ref={krsInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setKrsFile(e.target.files[0]);
                    }
                  }}
                />
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
