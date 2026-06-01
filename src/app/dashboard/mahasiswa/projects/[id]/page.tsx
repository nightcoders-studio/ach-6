import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { ProjectRoom } from "@/components/project/ProjectRoom";

export default async function MahasiswaProjectExecutionPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getSession();
  if (!session || session.role !== "MAHASISWA") {
    redirect("/auth/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { user_id: session.id },
  });

  if (!profile) redirect("/onboarding/mahasiswa");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      mitra: { include: { user: true } },
      scope: true,
      assignments: { where: { student_id: profile.id } },
      discussions: { orderBy: { created_at: "asc" } },
      submissions: { where: { student_id: profile.id }, orderBy: { submitted_at: "desc" } },
      revisions: { orderBy: { requested_at: "asc" } },
    },
  });

  if (!project || project.assignments.length === 0) {
    notFound(); // Only accessible if the student is assigned to this project
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">{project.status.replace(/_/g, " ")}</Badge>
            <span className="text-sm text-slate-500">Klien: {project.mitra.mitra_name}</span>
          </div>
        </div>

        <ProjectRoom 
          projectId={project.id}
          role="MAHASISWA"
          userId={session.id}
          projectStatus={project.status}
          chats={project.discussions}
          submissions={project.submissions}
          revisions={project.revisions}
          maxRevisions={project.revision_limit}
        />

        <Card className="bg-white border-slate-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Referensi Brief Project</CardTitle>
            <CardDescription>Detail project yang disepakati.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none text-slate-600">
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
