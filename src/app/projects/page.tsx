import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, DollarSign, Target } from "lucide-react";

export default async function ProjectDiscoveryPage() {
  const projects = await prisma.project.findMany({
    where: { status: "OPEN_FOR_BID" },
    include: { mitra: { include: { user: true } } },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Eksplorasi Project</h1>
          <p className="text-slate-500 mt-2">Temukan dan bid project yang sesuai dengan keahlian Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              Belum ada project yang terbuka saat ini.
            </div>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="flex flex-col shadow-sm border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(project.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-tight">{project.title}</CardTitle>
                  <CardDescription className="text-slate-500 mt-1 line-clamp-1">
                    oleh {project.mitra.mitra_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {project.description.replace(/[#*]/g, "") /* Simple strip markdown for preview */}
                  </p>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600">
                      <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                      <span>Rp {project.min_price.toLocaleString("id-ID")} - Rp {project.max_price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      <span>{project.deadline_days} Hari Pengerjaan</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Target className="w-4 h-4 mr-2 text-slate-400" />
                      <span>Maks. {project.revision_limit} Revisi</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-slate-100">
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800">Lihat Detail & Bid</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
