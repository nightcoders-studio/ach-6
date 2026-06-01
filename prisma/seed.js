const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up existing database...");
  await prisma.dispute.deleteMany();
  await prisma.skpiEvidencePack.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.paymentWebhookLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.projectDiscussion.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.projectScope.deleteMany();
  await prisma.project.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.studentBankAccount.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.mitraProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding skills...");
  const skillsData = [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Tailwind CSS", category: "Design/Frontend" },
    { name: "Figma", category: "Design" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "SEO", category: "Marketing" }
  ];

  const skills = [];
  for (const sk of skillsData) {
    const skill = await prisma.skill.create({ data: sk });
    skills.push(skill);
  }

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create 3 Mahasiswa Users
  const student1 = await prisma.user.create({
    data: {
      name: "Andi Pratama",
      email: "andi@student.com",
      password_hash: hashedPassword,
      role: "MAHASISWA",
      phone: "08110000001",
      status: "ACTIVE",
      student_profile: {
        create: {
          nim: "2204111001",
          university: "Universitas Syiah Kuala",
          study_program: "Informatika",
          semester: 6,
          domicile: "Banda Aceh",
          verification_status: "VERIFIED",
          plan: "PRO",
          verified_at: new Date()
        }
      }
    },
    include: { student_profile: true }
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Budi Setiawan",
      email: "budi@student.com",
      password_hash: hashedPassword,
      role: "MAHASISWA",
      phone: "08110000002",
      status: "ACTIVE",
      student_profile: {
        create: {
          nim: "2204111002",
          university: "Universitas Syiah Kuala",
          study_program: "Sistem Informasi",
          semester: 4,
          domicile: "Aceh Besar",
          verification_status: "VERIFIED",
          plan: "BASIC",
          verified_at: new Date()
        }
      }
    },
    include: { student_profile: true }
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Citra Lestari",
      email: "citra@student.com",
      password_hash: hashedPassword,
      role: "MAHASISWA",
      phone: "08110000003",
      status: "ACTIVE",
      student_profile: {
        create: {
          nim: "2204111003",
          university: "Universitas Teuku Umar",
          study_program: "Desain Komunikasi Visual",
          semester: 8,
          domicile: "Meulaboh",
          verification_status: "VERIFIED",
          plan: "BASIC",
          verified_at: new Date()
        }
      }
    },
    include: { student_profile: true }
  });

  // Assign Student Skills & Bank Accounts
  await prisma.studentSkill.createMany({
    data: [
      { student_id: student1.student_profile.id, skill_id: skills[0].id, level: "INTERMEDIATE" }, // React
      { student_id: student1.student_profile.id, skill_id: skills[1].id, level: "EXPERT" }, // Next.js
      { student_id: student2.student_profile.id, skill_id: skills[4].id, level: "INTERMEDIATE" }, // Node.js
      { student_id: student3.student_profile.id, skill_id: skills[3].id, level: "EXPERT" }, // Figma
    ]
  });

  // 2. Create 1 Mitra User
  const mitraUser = await prisma.user.create({
    data: {
      name: "Pak Dimas",
      email: "dimas@mitra.com",
      password_hash: hashedPassword,
      role: "MITRA",
      phone: "08220000001",
      status: "ACTIVE",
      mitra_profile: {
        create: {
          mitra_name: "PT Prima Inovasi",
          mitra_type: "Perusahaan IT",
          responsible_person: "Dimas Anggara",
          position: "Project Manager",
          address: "Banda Aceh",
          description: "Perusahaan solusi teknologi inovatif.",
          verification_level: "BUSINESS",
          verification_status: "VERIFIED",
          verified_at: new Date()
        }
      }
    },
    include: { mitra_profile: true }
  });

  console.log("Seeding 5 Projects...");

  // Project 1: OPEN FOR BID
  await prisma.project.create({
    data: {
      mitra_id: mitraUser.mitra_profile.id,
      title: "Desain Logo & Identitas Perusahaan",
      category: "Design",
      description: "Membutuhkan desainer untuk merancang logo modern dan guidelines identitas visual untuk produk SaaS baru kami.",
      min_price: 1000000,
      max_price: 2000000,
      deadline_days: 7,
      revision_limit: 3,
      status: "OPEN_FOR_BID",
      published_at: new Date(),
      scope: {
        create: {
          included_scope: "Logo Utama, Warna, Tipografi",
          output_format: "Figma Link, PNG, SVG",
          output_quantity: 1,
          completion_criteria: "Sesuai briefing dan revisi final"
        }
      },
      skills_required: {
        create: [{ skill_id: skills[3].id }] // Figma
      }
    }
  });

  // Project 2: OPEN FOR BID
  await prisma.project.create({
    data: {
      mitra_id: mitraUser.mitra_profile.id,
      title: "Optimasi SEO Website Profil",
      category: "Marketing",
      description: "Meningkatkan peringkat pencarian website profil perusahaan kami. Perlu audit SEO on-page dan rekomendasi perbaikan konten.",
      min_price: 1500000,
      max_price: 2500000,
      deadline_days: 14,
      revision_limit: 1,
      status: "OPEN_FOR_BID",
      published_at: new Date(),
      scope: {
        create: {
          included_scope: "Audit On-page, Metadata, Keyword Research",
          output_format: "Laporan PDF",
          output_quantity: 1,
          completion_criteria: "Laporan diserahkan dan action plan jelas"
        }
      },
      skills_required: {
        create: [{ skill_id: skills[6].id }] // SEO
      }
    }
  });

  // Project 3: OPEN FOR BID (Has some bids from students)
  const project3 = await prisma.project.create({
    data: {
      mitra_id: mitraUser.mitra_profile.id,
      title: "Pengembangan Frontend Dashboard Kasir",
      category: "Web Development",
      description: "Kami memiliki backend yang sudah jadi. Kami membutuhkan developer React/Next.js untuk membuat UI dashboard kasir.",
      min_price: 3000000,
      max_price: 5000000,
      deadline_days: 21,
      revision_limit: 2,
      status: "OPEN_FOR_BID",
      published_at: new Date(),
      scope: {
        create: {
          included_scope: "Integrasi API, Manajemen State, UI Responsive",
          output_format: "Source Code (Github)",
          output_quantity: 1,
          completion_criteria: "Fitur utama berfungsi tanpa error"
        }
      },
      skills_required: {
        create: [{ skill_id: skills[0].id }, { skill_id: skills[1].id }] // React, Next.js
      }
    }
  });

  // Add a bid to Project 3
  await prisma.bid.create({
    data: {
      project_id: project3.id,
      student_id: student1.student_profile.id,
      bid_price: 4500000,
      estimated_days: 18,
      proposal_message: "Saya sangat berpengalaman dalam pembuatan dashboard dengan React dan Next.js.",
      status: "SUBMITTED"
    }
  });

  // Project 4: IN PROGRESS
  const project4 = await prisma.project.create({
    data: {
      mitra_id: mitraUser.mitra_profile.id,
      title: "Pembuatan API Backend Sistem Inventori",
      category: "Backend Development",
      description: "Mengembangkan RESTful API menggunakan Node.js dan PostgreSQL untuk sistem inventori gudang.",
      min_price: 3500000,
      max_price: 5000000,
      deadline_days: 14,
      revision_limit: 2,
      status: "IN_PROGRESS",
      published_at: new Date(),
      scope: {
        create: {
          included_scope: "REST API, Autentikasi JWT, Relasi Database",
          output_format: "Github Repo & Postman Collection",
          output_quantity: 1,
          completion_criteria: "100% Endpoints lolos testing"
        }
      },
      skills_required: {
        create: [{ skill_id: skills[4].id }, { skill_id: skills[5].id }] // Node.js, PostgreSQL
      }
    }
  });

  const bid4 = await prisma.bid.create({
    data: {
      project_id: project4.id,
      student_id: student2.student_profile.id,
      bid_price: 4000000,
      estimated_days: 12,
      proposal_message: "Saya bisa mengerjakan API ini menggunakan Express dan PostgreSQL.",
      status: "ACCEPTED"
    }
  });

  await prisma.projectAssignment.create({
    data: {
      project_id: project4.id,
      bid_id: bid4.id,
      student_id: student2.student_profile.id,
      status: "ACTIVE"
    }
  });

  await prisma.payment.create({
    data: {
      project_id: project4.id,
      mitra_id: mitraUser.mitra_profile.id,
      amount: 4000000,
      platform_fee: 200000,
      net_amount: 3800000,
      gateway: "MIDTRANS",
      order_id: `INV-${Date.now()}-4`,
      payment_status: "SECURED",
      payment_method: "qris",
      paid_at: new Date()
    }
  });


  // Project 5: COMPLETED
  const project5 = await prisma.project.create({
    data: {
      mitra_id: mitraUser.mitra_profile.id,
      title: "Desain UI/UX Aplikasi Edukasi",
      category: "Design",
      description: "Membutuhkan 10 wireframe dan mockup untuk aplikasi mobile edukasi interaktif.",
      min_price: 2000000,
      max_price: 3000000,
      deadline_days: 10,
      revision_limit: 1,
      status: "COMPLETED",
      published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      scope: {
        create: {
          included_scope: "Wireframe, Hi-fi Mockup",
          output_format: "Figma Link",
          output_quantity: 10,
          completion_criteria: "Desain user-friendly dan sesuai brand"
        }
      },
      skills_required: {
        create: [{ skill_id: skills[3].id }] // Figma
      }
    }
  });

  const bid5 = await prisma.bid.create({
    data: {
      project_id: project5.id,
      student_id: student3.student_profile.id,
      bid_price: 2500000,
      estimated_days: 8,
      proposal_message: "Saya mahir menggunakan Figma untuk desain UI/UX mobile.",
      status: "ACCEPTED"
    }
  });

  await prisma.projectAssignment.create({
    data: {
      project_id: project5.id,
      bid_id: bid5.id,
      student_id: student3.student_profile.id,
      status: "COMPLETED"
    }
  });

  await prisma.payment.create({
    data: {
      project_id: project5.id,
      mitra_id: mitraUser.mitra_profile.id,
      amount: 2500000,
      platform_fee: 125000,
      net_amount: 2375000,
      gateway: "MIDTRANS",
      order_id: `INV-${Date.now()}-5`,
      payment_status: "SECURED",
      payment_method: "bca_va",
      paid_at: new Date()
    }
  });

  await prisma.projectSubmission.create({
    data: {
      project_id: project5.id,
      student_id: student3.student_profile.id,
      file_url: "https://figma.com/file/completed-design",
      result_link: "https://figma.com/proto/completed-design",
      submission_note: "Berikut adalah hasil desain 10 layar utama.",
      status: "APPROVED",
      submitted_at: new Date()
    }
  });

  await prisma.certificate.create({
    data: {
      project_id: project5.id,
      student_id: student3.student_profile.id,
      mitra_id: mitraUser.mitra_profile.id,
      certificate_number: "CERT/SB/2026/06002",
      certificate_file_url: "https://skillbridge.id/certs/validation-code",
      qr_verification_url: "https://skillbridge.id/verify/CERT-SB-2026-06002",
      status: "ACTIVE"
    }
  });

  console.log("Database seeded successfully with 1 Mitra, 5 Projects, and 3 Students!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
