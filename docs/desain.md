# SkillBridge — Pedoman Desain (UI/UX)

Dokumen ini berisi aturan desain antarmuka (UI) dan pengalaman pengguna (UX) untuk platform SkillBridge, agar tampilan dan *feel* aplikasi konsisten, elegan, dan profesional.

## 1. Konsep Utama (Theme & Vibe)
- **Modern Minimalist & Elegan:** Desain harus terlihat bersih, fungsional, dan menghilangkan elemen-elemen yang tidak esensial. Setiap ruang dan elemen harus memiliki tujuan.
- **Dominan Putih (Clean White):** Background utama wajib menggunakan warna putih atau *off-white* (`#ffffff`, `#f8fafc`). Hindari penggunaan warna-warni yang terlalu mencolok bergaya "AI/futuristik".
- **Aksen Warna Terpadu:** Gunakan satu atau dua warna aksen utama (misalnya biru profesional atau hijau zamrud) yang dipadukan secara elegan dengan putih.
- **Micro-interactions:** Setiap tombol dan interaksi harus terasa responsif (hover effect, focus ring).

## 2. Animasi (Framer Motion)
- **Out of the box:** Gunakan `framer-motion` untuk membuat transisi yang *smooth* dan menarik di Landing Page.
- **Animasi Scroll:** Elemen pada Landing Page (seperti Hero section, daftar fitur) harus memiliki efek *fade-in up* atau *staggered entrance* saat di-scroll.
- **Pergantian Halaman:** Transisi halus antar halaman, tidak mengganggu kecepatan render aplikasi.

## 3. Komponen, Icon & Reusability
- **Reusable Components:** Pastikan setiap komponen UI dibuat modular dan dapat digunakan kembali (*reusable*). Hindari pengulangan kode UI; buat komponen dasar (seperti `Card`, `Button`, `InputField`, `Badge`) yang bisa dikonfigurasi melalui props.
- **Library Komponen:** Menggunakan `shadcn/ui` secara konsisten untuk form, tombol, dialog, dan tabel. Kustomisasi komponen *shadcn* agar sesuai dengan gaya Modern Minimalist.
- **Icon Wajib:** Semua icon dalam platform **wajib** menggunakan `lucide-react`. 
- **Tanpa Emoji:** Dilarang keras menggunakan emoji di dalam UI (sebagai ganti icon). Selalu gunakan icon SVG dari Lucide yang bergaris bersih.

## 4. Tipografi
- **Plus Jakarta Sans:** Gunakan font `Plus Jakarta Sans` sebagai font utama untuk seluruh platform.
- **Font Weights:** Sesuaikan pemilihan *weight* dengan cermat untuk membedakan hierarki informasi:
  - `ExtraBold (800)` / `Bold (700)` untuk H1 dan judul utama (Hero section).
  - `SemiBold (600)` untuk judul kartu, tombol, dan elemen aksi.
  - `Medium (500)` untuk subjudul, teks tebal dalam paragraf, dan label form.
  - `Regular (400)` untuk body text panjang, deskripsi, dan catatan kaki.
- **Hirarki Jelas:** Teks harus mudah dipindai (*scannable*) dengan perbedaan ukuran dan ketebalan yang tegas. Gunakan teks abu-abu terang (`text-muted-foreground`) untuk deskripsi pendukung.

## 5. Ilustrasi & Gambar
- Jika membutuhkan ilustrasi, gunakan gambar dengan *line art* minimalis atau foto berkualitas tinggi dengan tone warna netral.
- Jangan menggunakan *placeholder* kotak kosong tanpa kejelasan konteks; gunakan `framer-motion` skeleton saat loading.

## 6. Layout
- Berbasis komponen dan responsif secara bawaan. Penuhi standar mobile-first.
- Ruang bernapas (*whitespace*): Pastikan jarak padding dan margin cukup lega (misalnya `p-6` atau `gap-4`) untuk menghindari tampilan yang sumpek.
