import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import Image from "next/image";

export default async function CertificatePage({ params }: { params: { projectId: string } }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      mitra: { include: { user: true } },
      assignments: { include: { student: { include: { user: true } } } },
    }
  });

  if (!project || project.status !== "COMPLETED") {
    notFound();
  }

  const assignment = project.assignments[0];
  if (!assignment) notFound();

  // Protect access: only the student, the mitra, or superuser can view
  if (session.id !== assignment.student.user_id && session.id !== project.mitra.user_id && session.role !== "SUPERUSER") {
    redirect("/dashboard");
  }

  const studentName = assignment.student.user.name;
  const projectName = project.title;
  const mitraName = project.mitra.mitra_name;
  const issueDate = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  const certId = `CERT-SB-${project.id.slice(0, 8).toUpperCase()}-${assignment.student.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center">
      {/* Print Button Wrapper (Hidden on print) */}
      <div className="w-full max-w-[1000px] flex justify-end mb-4 px-4 print:hidden">
        <Button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800">
          <Printer className="w-4 h-4 mr-2" /> Cetak / Simpan PDF
        </Button>
      </div>

      {/* Certificate Container */}
      <div className="w-full max-w-[1000px] aspect-[1.414/1] bg-white shadow-2xl relative overflow-hidden print:shadow-none print:w-full print:h-screen print:max-w-none px-12 py-16 flex flex-col items-center text-center justify-center border-12 border-slate-900 mx-4">
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-br-full -z-10 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-tl-full -z-10 opacity-50"></div>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-wider uppercase mb-2">Sertifikat Kontribusi</h1>
          <p className="text-slate-500 tracking-widest text-sm uppercase">SkillBridge Nusantara</p>
        </div>

        <p className="text-lg text-slate-600 mb-4">Diberikan dengan bangga kepada:</p>
        
        <h2 className="text-5xl font-bold text-indigo-700 mb-6 italic">{studentName}</h2>
        
        <p className="text-slate-700 max-w-2xl text-lg leading-relaxed mb-12">
          Atas dedikasi, profesionalisme, dan kontribusi teknis yang luar biasa dalam menyelesaikan project <br/>
          <strong className="text-slate-900">{projectName}</strong> <br/>
          yang diselenggarakan bersama <strong className="text-slate-900">{mitraName}</strong>.
        </p>

        <div className="flex justify-between w-full max-w-3xl mt-auto pt-12">
          <div className="flex flex-col items-center">
            <div className="w-40 border-b border-slate-400 mb-2"></div>
            <p className="font-semibold text-slate-900">{project.mitra.responsible_person || "Perwakilan Mitra"}</p>
            <p className="text-sm text-slate-500">{mitraName}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-50 border-2 border-indigo-100 rounded-full flex items-center justify-center mb-4">
              <span className="font-bold text-indigo-300 transform -rotate-12">SEAL</span>
            </div>
            <p className="text-xs text-slate-400">ID: {certId}</p>
            <p className="text-xs text-slate-400">Tanggal: {issueDate}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-40 border-b border-slate-400 mb-2"></div>
            <p className="font-semibold text-slate-900">Admin SkillBridge</p>
            <p className="text-sm text-slate-500">Platform Escrow & Validation</p>
          </div>
        </div>
      </div>
      
      {/* Add global print styles to force landscape and margins */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `}} />
    </div>
  );
}
