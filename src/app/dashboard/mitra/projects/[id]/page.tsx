import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { selectBidAction } from "./actions";
import { ProjectRoom } from "@/components/project/ProjectRoom";

export default async function ProjectBidsPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "MITRA") {
    redirect("/auth/login");
  }

  const profile = await prisma.mitraProfile.findUnique({
    where: { user_id: session.id },
  });

  if (!profile) redirect("/onboarding/mitra");

  const project = await prisma.project.findUnique({
    where: { id: params.id, mitra_id: profile.id },
    include: { 
      bids: { 
        include: { 
          student: { include: { user: true } } 
        },
        orderBy: { created_at: "desc" }
      },
      discussions: { orderBy: { created_at: "asc" } },
      submissions: { orderBy: { submitted_at: "desc" } },
      revisions: { orderBy: { requested_at: "asc" } },
    },
  });

  if (!project) notFound();

  const isExecutionPhase = ["PAYMENT_SECURED", "IN_PROGRESS", "WAITING_APPROVAL", "REVISION_REQUESTED", "COMPLETED"].includes(project.status);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">{project.status.replace(/_/g, " ")}</Badge>
            <span className="text-sm text-slate-500">Kategori: {project.category}</span>
          </div>
        </div>

        {isExecutionPhase ? (
          <ProjectRoom 
            projectId={project.id}
            role="MITRA"
            userId={session.id}
            projectStatus={project.status}
            chats={project.discussions}
            submissions={project.submissions}
            revisions={project.revisions}
            maxRevisions={project.revision_limit}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Penawaran Masuk ({project.bids.length})</h2>
              
              {project.bids.length === 0 ? (
                <Card className="bg-white border-slate-200">
                  <CardContent className="py-12 text-center text-slate-500">
                    Belum ada penawaran (bid) yang masuk untuk project ini.
                  </CardContent>
                </Card>
              ) : (
                project.bids.map((bid) => (
                  <Card key={bid.id} className={`bg-white border-slate-200 ${bid.status === 'ACCEPTED' ? 'border-green-500 shadow-sm' : ''}`}>
                    <CardHeader className="pb-4 border-b border-slate-100 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{bid.student.user.name}</CardTitle>
                        <CardDescription>{bid.student.university} - {bid.student.study_program} Semester {bid.student.semester}</CardDescription>
                      </div>
                      {bid.status === "ACCEPTED" && <Badge className="bg-green-500 hover:bg-green-600">Terpilih</Badge>}
                      {bid.status === "REJECTED" && <Badge variant="secondary">Ditolak</Badge>}
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex gap-6">
                        <div className="flex items-center text-slate-700">
                          <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="font-medium">Rp {bid.bid_price.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="font-medium">{bid.estimated_days} Hari Pengerjaan</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Pesan Proposal:</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{bid.proposal_message}</p>
                      </div>

                      {bid.portfolio_link && (
                        <div className="pt-2">
                          <a href={bid.portfolio_link} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline flex items-center">
                            <ExternalLink className="w-4 h-4 mr-1" /> Lihat Portofolio
                          </a>
                        </div>
                      )}

                      {project.status === "OPEN_FOR_BID" && bid.status === "SUBMITTED" && (
                        <form action={selectBidAction} className="pt-4 border-t border-slate-100 mt-4">
                          <input type="hidden" name="bid_id" value={bid.id} />
                          <input type="hidden" name="project_id" value={project.id} />
                          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
                            Pilih Bid Ini & Lanjut Pembayaran
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Detail Singkat Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Budget Maksimal</p>
                    <p className="font-semibold text-slate-900">Rp {project.max_price.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tenggat Waktu</p>
                    <p className="font-semibold text-slate-900">{project.deadline_days} Hari</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Deskripsi Brief</p>
                    <div className="text-sm text-slate-600 line-clamp-4 prose prose-sm mt-1">
                      <ReactMarkdown>{project.description}</ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
