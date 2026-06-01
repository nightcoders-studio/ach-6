"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Globe, FileText, Image as ImageIcon, Briefcase, FileBadge2, PenTool } from "lucide-react";

interface MitraData {
  mitra_name: string;
  mitra_type: string;
  responsible_person: string;
  position: string;
  address: string | null;
  description: string | null;
  social_media_url: string | null;
  website_url: string | null;
  nib_number: string | null;
  nib_file_url: string | null;
  business_photo_url: string | null;
  logo_url: string | null;
  user: {
    email: string;
  };
}

export function MitraDetailDialog({ mitra }: { mitra: MitraData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 mt-2">
          <Eye className="w-4 h-4 mr-2" />
          Lihat Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Detail Profil Mitra</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            {mitra.logo_url ? (
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0">
                <img src={mitra.logo_url} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                <Briefcase className="w-8 h-8 text-indigo-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900">{mitra.mitra_name}</h3>
              <p className="text-slate-500 font-medium">{mitra.mitra_type}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                <div className="flex items-center text-sm text-slate-600">
                  <UserIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  {mitra.responsible_person} ({mitra.position})
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MailIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  {mitra.user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Info Lanjutan
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Alamat Lengkap</p>
                  <p className="text-sm font-medium">{mitra.address || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Deskripsi Singkat</p>
                  <p className="text-sm">{mitra.description || "-"}</p>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2 border-b pb-2">
                <Globe className="w-4 h-4 text-indigo-500" /> Tautan
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Website URL</p>
                  {mitra.website_url ? (
                    <a href={mitra.website_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">{mitra.website_url}</a>
                  ) : <p className="text-sm text-slate-400">-</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Social Media URL</p>
                  {mitra.social_media_url ? (
                    <a href={mitra.social_media_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">{mitra.social_media_url}</a>
                  ) : <p className="text-sm text-slate-400">-</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Legalitas & Dokumen */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 border-b pb-2 mt-4">
              <FileBadge2 className="w-4 h-4 text-indigo-500" /> Dokumen & Legalitas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Nomor Induk Berusaha (NIB)</p>
                <p className="font-medium text-sm mb-2">{mitra.nib_number || "Tidak ada NIB"}</p>
                {mitra.nib_file_url ? (
                  <a href={mitra.nib_file_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">
                    <FileText className="w-3 h-3 mr-1.5" /> Lihat Dokumen NIB
                  </a>
                ) : <p className="text-xs text-slate-400 italic">Dokumen belum diunggah</p>}
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Foto Usaha / Kantor</p>
                {mitra.business_photo_url ? (
                  <a href={mitra.business_photo_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">
                    <ImageIcon className="w-3 h-3 mr-1.5" /> Lihat Foto Usaha
                  </a>
                ) : <p className="text-xs text-slate-400 italic">Foto belum diunggah</p>}
              </div>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simple icons to avoid too many lucide imports in one line
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  )
}
