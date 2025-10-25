## 📋 Deskripsi Singkat

**ChemLab** adalah platform belajar kimia interaktif yang dirancang khusus untuk membantu siswa memahami materi kimia melalui simulasi virtual, kuis interaktif, dan pathway pembelajaran yang terstruktur. Platform ini menyediakan pengalaman belajar yang komprehensif dengan fitur tracking progress dan analisis hasil pembelajaran secara detail.

**Live Demo:** https://uts-pawm-ii-3140-kelompok-14.vercel.app/

## 👥 Tim Pengembang

- **Matthew Sebastian Kurniawan** - NIM: 18223096
- **Darryl Rayhananta Adenan** - NIM: 18223042

## ✨ Fitur-Fitur Utama

### 1. **Autentikasi & Manajemen User**
   - Register dan Login dengan email
   - Verifikasi email untuk keamanan
   - Dashboard profile user
   - Manajemen setting akun
   - Integrasi OAuth dengan Supabase

### 2. **Pathway Pembelajaran Terstruktur**
   - Pathway pembelajaran yang terorganisir secara sekuensial
   - Multiple tipe konten (Topic, Quiz, Simulasi, Final Test)
   - Progress tracking untuk setiap pathway
   - Navigation mudah antar pathway
   - Completion status dan scoring system

### 3. **Simulasi Interaktif**
   - **Simulasi Pembentukan Ikatan (Bond Formation Simulator)**
     - Visualisasi atom dan elektron
     - Simulasi ikatan kovalen dan ionik
     - Interaksi real-time antara atom
   
   - **Simulasi Pembentukan Senyawa (Compound Formation Simulator)**
     - Kombinasi elemen untuk membentuk senyawa
     - Visualisasi struktur molekul
     - Validasi reaksi kimia

   - **Atom Selector**
     - Pemilihan atom dengan interface yang intuitif
     - Periodik table interaktif
     - Informasi atom lengkap

### 4. **Quiz & Assessment**
   - Kuis interaktif dengan multiple choice
   - Tracking jawaban individual
   - Penyimpanan jawaban ke database
   - Penjelasan jawaban untuk setiap pertanyaan
   - Real-time scoring

### 5. **Final Test dengan Detail Hasil**
   - Tes akhir komprehensif
   - Penyimpanan detail jawaban ke database
   - Hasil tes dengan score persentase
   - Modal detail pembahasan jawaban
   - Informasi jawaban benar vs jawaban user
   - Penjelasan lengkap untuk setiap soal

### 6. **Dashboard & Analytics**
   - Dashboard overview dengan statistik pembelajaran
   - Daftar pathway yang dapat diakses
   - Tracking progress per pathway
   - Rata-rata score pembelajaran
   - Total eksperimen yang diselesaikan
   - Session history

### 7. **User Experience**
   - Responsive design (mobile, tablet, desktop)
   - Dark mode support
   - Animated background
   - Smooth transitions dan interactions
   - Breadcrumb navigation
   - User menu dengan profile access

### 8. **Database & Storage**
   - Supabase PostgreSQL database
   - Real-time data synchronization
   - Secure authentication dengan JWT
   - User data persistence
   - Quiz answers history
   - Progress tracking

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **UI Components:** Radix UI + Custom Components
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Animation:** Framer Motion
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Fetch API

### Backend & Database
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Middleware:** Custom authentication middleware

### Tools & Libraries
- **Chart:** Chart.js / Recharts
- **Date Handling:** date-fns
- **Toast Notifications:** Sonner
- **Code Quality:** ESLint

## 🚀 Cara Menggunakan

### Prerequisites
- Node.js 18+
- npm atau pnpm
- Supabase account

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd 18223096_Tugas-PAWM-Virtual-Lab
```

2. Install dependencies
```bash
pnpm install
# atau
npm install
```

3. Setup environment variables
Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server
```bash
pnpm dev
# atau
npm run dev
```

5. Buka http://localhost:3000 di browser

## 📊 Database Schema

### Tables Utama:
- **users** - User profiles (Supabase Auth)
- **pathways** - Pathway pembelajaran
- **user_pathway_progress** - Progress user per pathway
- **quiz_answers** - Simpanan jawaban quiz user
- **user_progress** - Statistik progress user

## 🔐 Security

- Authentication dengan Supabase Auth
- JWT token-based security
- Server-side middleware protection
- Email verification
- Secure password handling
