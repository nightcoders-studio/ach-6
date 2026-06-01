"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { sendChatAction } from "@/app/actions/project";
import { SignaturePad } from "@/components/project/SignaturePad";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle, FileText, CheckCircle2, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { submitProjectWorkAction, approveProjectAction, requestRevisionAction } from "@/app/actions/project";

interface ProjectRoomProps {
  projectId: string;
  role: "MITRA" | "MAHASISWA";
  userId: string;
  projectStatus: string;
  chats: { id: string; sender_id: string; sender_role: string; message: string; created_at: Date | string }[];
  submissions: { status: string; result_link: string | null; submission_note: string | null }[];
  revisions: { id: string; revision_number: number; revision_note: string }[];
  maxRevisions: number;
}

export function ProjectRoom({
  projectId,
  role,
  userId,
  projectStatus,
  chats,
  submissions,
  revisions,
  maxRevisions
}: ProjectRoomProps) {
  const [chatState, chatAction, isChatPending] = useActionState(sendChatAction, null);
  const [submitState, submitAction, isSubmitPending] = useActionState(submitProjectWorkAction, null);
  const [, approveAction, isApprovePending] = useActionState(approveProjectAction, null);
  const [, revisionAction, isRevisionPending] = useActionState(requestRevisionAction, null);
  const [signature, setSignature] = useState("");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const latestSubmission = submissions.length > 0 ? submissions[0] : null; // Assuming ordered by desc
  const remainingRevisions = maxRevisions - revisions.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chat Room */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm border-slate-200 bg-white flex flex-col h-[600px]">
          <CardHeader className="border-b border-slate-100 pb-4 shrink-0">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Ruang Diskusi Project</span>
              <Badge variant="secondary">{chats.length} / 5 Pesan</Badge>
            </CardTitle>
            <CardDescription>Batas maksimal interaksi chat adalah 5 pesan per project untuk MVP.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chats.length === 0 ? (
              <div className="text-center text-slate-500 py-12 text-sm">Belum ada pesan. Mulai diskusi sekarang!</div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className={`flex ${chat.sender_id === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    chat.sender_id === userId ? "bg-indigo-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                  }`}>
                    <div className="font-semibold text-xs mb-1 opacity-80">
                      {chat.sender_role === "MITRA" ? "Mitra" : "Mahasiswa"}
                    </div>
                    <p className="whitespace-pre-wrap">{chat.message}</p>
                    <div className="text-[10px] mt-2 opacity-70 text-right">
                      {new Date(chat.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </CardContent>
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            {chatState?.error && <p className="text-xs text-red-500 mb-2">{chatState.error}</p>}
            <form action={chatAction} className="flex gap-2">
              <input type="hidden" name="project_id" value={projectId} />
              <Input 
                name="message" 
                placeholder="Ketik pesan..." 
                className="flex-1" 
                autoComplete="off" 
                disabled={isChatPending || chats.length >= 5 || projectStatus === "COMPLETED"} 
                required 
              />
              <Button type="submit" disabled={isChatPending || chats.length >= 5 || projectStatus === "COMPLETED"} className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {chats.length >= 5 && projectStatus !== "COMPLETED" && (
              <p className="text-xs text-orange-500 mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Batas maksimum chat tercapai.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Action Sidebar */}
      <div className="space-y-6">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-4">
            <CardTitle className="text-lg">Status Pengerjaan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                {projectStatus === "COMPLETED" ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-indigo-600" />}
              </div>
              <div>
                <p className="text-sm text-slate-500">Status Saat Ini</p>
                <p className="font-bold text-slate-900">{projectStatus.replace(/_/g, " ")}</p>
              </div>
            </div>

            {projectStatus === "COMPLETED" && (
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <a href={`/certificates/${projectId}`} className="flex items-center justify-center w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm">
                  <FileText className="w-4 h-4 mr-2" /> Unduh Sertifikat
                </a>
                {role === "MAHASISWA" && (
                  <a href={`/portfolios/${projectId}`} className="flex items-center justify-center w-full py-2.5 px-4 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm border border-slate-200 shadow-sm">
                    <FileText className="w-4 h-4 mr-2" /> Lihat Portofolio
                  </a>
                )}
              </div>
            )}

            {/* Mahasiswa View: Submit Work */}
            {role === "MAHASISWA" && projectStatus !== "COMPLETED" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Kirim Hasil Kerja</h3>
                {latestSubmission && latestSubmission.status === "SUBMITTED" ? (
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">Menunggu review dari Mitra.</div>
                ) : (
                  <form action={submitAction} className="space-y-3">
                    <input type="hidden" name="project_id" value={projectId} />
                    <Input name="result_link" type="url" placeholder="Link Figma / GDrive / Github" required disabled={isSubmitPending} />
                    <textarea 
                      name="submission_note" 
                      placeholder="Catatan tambahan..." 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      disabled={isSubmitPending}
                    />
                    {submitState?.error && <p className="text-xs text-red-500">{submitState.error}</p>}
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitPending}>
                      Submit Hasil Kerja
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* Submission Result (Always visible if exists) */}
            {latestSubmission && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Hasil Kerja Terbaru</h3>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                  <a href={latestSubmission.result_link || undefined} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-indigo-600 hover:underline">
                    <FileText className="w-4 h-4 mr-2" /> Buka Lampiran / Link
                  </a>
                  {latestSubmission.submission_note && (
                    <div className="text-xs text-slate-600 p-2 bg-white rounded border border-slate-100">
                      <div className="prose prose-sm max-w-none prose-p:leading-tight">
                        <ReactMarkdown>{latestSubmission.submission_note}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {role === "MITRA" && projectStatus !== "COMPLETED" && latestSubmission.status === "SUBMITTED" && (
                    <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
                      <form action={approveAction} className="space-y-4 border border-indigo-100 bg-white p-3 rounded-md">
                        <div>
                          <p className="text-xs text-slate-500 mb-2 font-medium">Tanda Tangan Digital (Diperlukan untuk Sertifikat)</p>
                          <SignaturePad onSignatureChange={setSignature} />
                        </div>
                        <input type="hidden" name="project_id" value={projectId} />
                        <input type="hidden" name="signature" value={signature} />
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isApprovePending || !signature}>
                          Setujui & Selesaikan
                        </Button>
                      </form>
                      
                      {remainingRevisions > 0 ? (
                        <form action={revisionAction} className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                          <input type="hidden" name="project_id" value={projectId} />
                          <p className="text-xs text-slate-500">Sisa revisi: {remainingRevisions}</p>
                          <textarea 
                            name="revision_note" 
                            placeholder="Catatan revisi..." 
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            required
                            disabled={isRevisionPending}
                          />
                          <Button type="submit" variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50" disabled={isRevisionPending}>
                            Minta Revisi
                          </Button>
                        </form>
                      ) : (
                        <p className="text-xs text-red-500 text-center mt-2">Batas revisi habis.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Revisions History */}
            {revisions.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Riwayat Revisi</h4>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="text-xs p-2 bg-orange-50 text-orange-800 rounded border border-orange-100">
                      <span className="font-bold">Revisi #{rev.revision_number}:</span> {rev.revision_note}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
