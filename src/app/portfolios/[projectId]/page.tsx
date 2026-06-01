import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, ExternalLink } from "lucide-react";

export default async function PortfolioPage({ params }: { params: { projectId: string } }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      mitra: { include: { user: true } },
      assignments: { include: { student: { include: { user: true } } } },
      submissions: { orderBy: { submitted_at: "desc" }, take: 1 },
      scope: true
    }
  });

  if (!project || project.status !== "COMPLETED") {
    notFound();
  }

  const assignment = project.assignments[0];
  if (!assignment) notFound();

  // Protect access
  if (session.id !== assignment.student.user_id && session.id !== project.mitra.user_id && session.role !== "SUPERUSER") {
    redirect("/dashboard");
  }

  const submission = project.submissions[0];

  return (
    <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center font-sans">
      <div className="w-full max-w-[800px] flex justify-end mb-4 px-4 print:hidden">
        <Button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800">
          <Printer className="w-4 h-4 mr-2" /> Cetak / Ekspor PDF
        </Button>
      </div>

      <div className="w-full max-w-[800px] bg-white shadow-xl px-12 py-16 print:shadow-none print:w-full mx-4 space-y-8">
        
        {/* Header */}
        <div className="border-b-4 border-indigo-600 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Project Proof</h1>
              <p className="text-slate-500">SkillBridge Verified Evidence</p>
            </div>
            <div className="text-right">
              <CheckCircle className="w-8 h-8 text-green-500 ml-auto mb-2" />
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Verified Work</p>
            </div>
          </div>
        </div>

        {/* Worker Info */}
        <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dikerjakan Oleh</p>
            <p className="font-semibold text-slate-900 text-lg">{assignment.student.user.name}</p>
            <p className="text-sm text-slate-600">{assignment.student.university}</p>
            <p className="text-sm text-slate-600">{assignment.student.study_program}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Klien Mitra</p>
            <p className="font-semibold text-slate-900 text-lg">{project.mitra.mitra_name}</p>
            <p className="text-sm text-slate-600">{project.mitra.mitra_type}</p>
          </div>
        </div>

        {/* Project Detail */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Detail Project</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Judul Project</h3>
              <p className="text-lg font-medium text-slate-900">{project.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Deskripsi / Scope Pekerjaan</h3>
              <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed mt-1">{project.description}</p>
            </div>
          </div>
        </div>

        {/* Result */}
        {submission && submission.result_link && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Hasil Akhir (Deliverables)</h2>
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
              <a href={submission.result_link} target="_blank" rel="noreferrer" className="flex items-center font-medium text-indigo-700 hover:underline">
                <ExternalLink className="w-4 h-4 mr-2" />
                {submission.result_link}
              </a>
              {submission.submission_note && (
                <p className="mt-4 text-sm text-slate-600 italic">"{submission.submission_note}"</p>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-12 text-center border-t border-slate-200 mt-12">
          <p className="text-xs text-slate-400">
            Dokumen ini dihasilkan secara otomatis oleh platform SkillBridge dan menjadi bukti otentik penyelesaian project. <br/>
            Project ID: {project.id} | Tanggal Disetujui: {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `}} />
    </div>
  );
}
