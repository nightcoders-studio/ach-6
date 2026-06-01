import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function generateProjectBrief(mitraPrompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `
Anda adalah asisten AI ahli dalam menulis Project Brief profesional.
Seorang Mitra/Klien memberikan instruksi singkat atau acak berikut ini untuk proyek yang ingin mereka buat:

"${mitraPrompt}"

Tugas Anda:
Buatkan Project Brief terstruktur dalam format Markdown yang elegan, rapi, dan komprehensif. 
Brief ini akan dibaca oleh mahasiswa yang ingin mengerjakan proyek tersebut.

Struktur Markdown wajib:
## Latar Belakang Proyek
(Jelaskan konteks dari instruksi klien)

## Tujuan Utama
(Tujuan spesifik proyek)

## Ruang Lingkup (Scope of Work)
(Daftar pekerjaan yang harus dilakukan)

## Kriteria Penyelesaian
(Syarat agar proyek dianggap selesai dan sukses)

## Hasil Output
(Format atau bentuk penyerahan akhir, misal: File PDF, Source Code, Desain Figma)

Pastikan bahasanya profesional, jelas, dan memotivasi mahasiswa. Jangan tambahkan pesan perkenalan atau penutup di luar struktur Markdown.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
