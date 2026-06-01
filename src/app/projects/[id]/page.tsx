import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Target, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BidForm } from "./BidForm";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { mitra: { include: { user: true } }, scope: true },
  });

  if (!project) {
    notFound();
  }

  const isMahasiswa = session?.role === "MAHASISWA";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">{project.category}</Badge>
                <span className="text-sm text-slate-500">
                  Dibuat pada: {new Date(project.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">{project.title}</CardTitle>
              <CardDescription className="flex items-center text-slate-600">
                <Briefcase className="w-4 h-4 mr-2" />
                Diterbitkan oleh {project.mitra.mitra_name} ({project.mitra.mitra_type})
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Brief</h3>
              <div className="prose prose-slate max-w-none prose-sm md:prose-base prose-headings:font-semibold prose-a:text-indigo-600">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>

              {project.scope && (
                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Ruang Lingkup (Scope)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium text-slate-900 mb-1">Termasuk:</p>
                      <p className="text-slate-600">{project.scope.included_scope}</p>
                    </div>
                    {project.scope.excluded_scope && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="font-medium text-slate-900 mb-1">Tidak Termasuk:</p>
                        <p className="text-slate-600">{project.scope.excluded_scope}</p>
                      </div>
                    )}
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium text-slate-900 mb-1">Format Output:</p>
                      <p className="text-slate-600">{project.scope.output_format} (Qty: {project.scope.output_quantity})</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium text-slate-900 mb-1">Kriteria Penyelesaian:</p>
                      <p className="text-slate-600">{project.scope.completion_criteria}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bidding Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-white sticky top-6">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl">
              <CardTitle className="text-xl">Ringkasan Project</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center text-slate-700">
                <DollarSign className="w-5 h-5 mr-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Rentang Harga</p>
                  <p className="font-semibold">Rp {project.min_price.toLocaleString("id-ID")} - Rp {project.max_price.toLocaleString("id-ID")}</p>
                </div>
              </div>
              <div className="flex items-center text-slate-700">
                <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Deadline</p>
                  <p className="font-semibold">{project.deadline_days} Hari Pengerjaan</p>
                </div>
              </div>
              <div className="flex items-center text-slate-700">
                <Target className="w-5 h-5 mr-3 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Batas Revisi</p>
                  <p className="font-semibold">{project.revision_limit} Kali Revisi</p>
                </div>
              </div>

              {isMahasiswa ? (
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4">Submit Bid Anda</h4>
                  <BidForm projectId={project.id} minPrice={project.min_price} maxPrice={project.max_price} />
                </div>
              ) : (
                <div className="pt-6 mt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500">Hanya mahasiswa yang dapat melakukan bid pada project ini.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
