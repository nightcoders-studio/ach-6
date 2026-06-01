import { z } from "zod";
import { UserRole, StudentPlan, MitraVerificationLevel } from "../status";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const registerMahasiswaSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  phone: z.string().min(10, { message: "Nomor HP tidak valid" }),
});

export const registerMitraSchema = z.object({
  mitra_name: z.string().min(3, { message: "Nama mitra minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  phone: z.string().min(10, { message: "Nomor HP tidak valid" }),
  mitra_type: z.string().min(2, { message: "Jenis mitra wajib diisi" }),
  responsible_person: z.string().min(3, { message: "Nama penanggung jawab wajib diisi" }),
  position: z.string().min(2, { message: "Jabatan wajib diisi" }),
});

export const createProjectSchema = z.object({
  title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
  description: z.string().min(20, { message: "Deskripsi minimal 20 karakter" }),
  category: z.string().min(2, { message: "Kategori wajib diisi" }),
  min_price: z.number().min(50000, { message: "Harga minimal Rp50.000" }),
  max_price: z.number().min(50000, { message: "Harga maksimal Rp50.000" }),
  deadline_days: z.number().min(1, { message: "Deadline minimal 1 hari" }),
  revision_limit: z.number().min(0, { message: "Batas revisi tidak boleh negatif" }),
  
  // Scope
  included_scope: z.string().min(10, { message: "Scope yang termasuk wajib diisi" }),
  excluded_scope: z.string().optional(),
  output_format: z.string().min(2, { message: "Format output wajib diisi" }),
  output_quantity: z.number().min(1, { message: "Kuantitas output minimal 1" }),
  completion_criteria: z.string().min(10, { message: "Kriteria penyelesaian wajib diisi" }),
  required_materials_from_mitra: z.string().optional(),
}).refine((data) => data.max_price >= data.min_price, {
  message: "Harga maksimal harus lebih besar atau sama dengan harga minimal",
  path: ["max_price"],
});

export const submitBidSchema = z.object({
  bid_price: z.number().min(50000, { message: "Harga bid minimal Rp50.000" }),
  estimated_days: z.number().min(1, { message: "Estimasi pengerjaan minimal 1 hari" }),
  proposal_message: z.string().min(20, { message: "Pesan proposal minimal 20 karakter" }),
  portfolio_link: z.string().url({ message: "Link portofolio harus berupa URL valid" }).optional().or(z.literal("")),
});
