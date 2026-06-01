"use client";

import { useActionState, useState } from "react";
import { generateBriefAction, submitProjectAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function CreateProjectPage() {
  const [aiState, aiAction, isAiPending] = useActionState(generateBriefAction, null);
  const [submitState, submitAction, isSubmitPending] = useActionState(submitProjectAction, null);

  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  // Update description when AI generates successfully
  if (aiState?.result && description === "" && !isAiPending) {
    setDescription(aiState.result);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buat Project Baru</h1>
          <p className="text-slate-500 mt-2">Buka peluang untuk mahasiswa mengerjakan project Anda.</p>
        </div>

        {/* AI Brief Generator */}
        <Card className="shadow-sm border-indigo-100 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4 bg-indigo-50/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg text-indigo-900">AI Project Brief Generator</CardTitle>
            </div>
            <CardDescription className="text-indigo-700/70">
              Ceritakan singkat tentang project yang ingin Anda buat, dan Gemini AI akan merapikannya menjadi Project Brief profesional.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={aiAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Instruksi / Ide Project</Label>
                <textarea 
                  id="prompt" 
                  name="prompt" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Contoh: Saya butuh website company profile untuk toko roti saya. Ada halaman home, tentang kami, produk, dan kontak. Warnanya coklat dan hangat." 
                  disabled={isAiPending}
                />
              </div>
              {aiState?.error && (
                <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{aiState.error}</p>
              )}
              <Button type="submit" disabled={isAiPending || prompt.length < 10} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isAiPending ? "AI Sedang Menulis..." : "Generate Brief dengan AI"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main Project Form */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg">Detail Project</CardTitle>
            <CardDescription>Lengkapi detail spesifikasi agar mahasiswa dapat melakukan penawaran (bid).</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={submitAction} className="space-y-6">
              {submitState?.message && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  {submitState.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Judul Project</Label>
                  <Input id="title" name="title" placeholder="Misal: Pembuatan Website Company Profile Toko Roti" required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Deskripsi Lengkap (Project Brief)</Label>
                    <div className="flex bg-slate-100 p-1 rounded-md">
                      <button 
                        type="button" 
                        onClick={() => setPreviewMode(false)}
                        className={`text-xs px-2 py-1 rounded ${!previewMode ? "bg-white shadow-sm font-medium" : "text-slate-500"}`}
                      >
                        Edit Markdown
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`text-xs px-2 py-1 rounded ${previewMode ? "bg-white shadow-sm font-medium" : "text-slate-500"}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  
                  {previewMode ? (
                    <div className="min-h-[200px] w-full rounded-md border border-slate-200 bg-slate-50 p-4 prose prose-sm max-w-none">
                      <ReactMarkdown>{description || "*Belum ada deskripsi*"}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea 
                      id="description" 
                      name="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                      placeholder="Gunakan Markdown untuk struktur yang lebih rapi..." 
                      required 
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori Project</Label>
                  <Input id="category" name="category" placeholder="Web Development, Design, dll" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline_days">Estimasi Deadline (Hari)</Label>
                  <Input id="deadline_days" name="deadline_days" type="number" min="1" placeholder="14" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_price">Harga Minimal (Rp)</Label>
                  <Input id="min_price" name="min_price" type="number" min="50000" placeholder="100000" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_price">Harga Maksimal (Rp)</Label>
                  <Input id="max_price" name="max_price" type="number" min="50000" placeholder="500000" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revision_limit">Batas Revisi</Label>
                  <Input id="revision_limit" name="revision_limit" type="number" min="0" placeholder="2" required />
                </div>
              </div>

              <Button type="submit" className="w-full mt-8" disabled={isSubmitPending}>
                {isSubmitPending ? "Menyimpan Project..." : "Publish Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
