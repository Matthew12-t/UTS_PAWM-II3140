-- Create pathways table
CREATE TABLE IF NOT EXISTS pathways (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'topic', 'simulation', 'quiz', 'final_test'
  content JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user pathway progress table
CREATE TABLE IF NOT EXISTS user_pathway_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id INTEGER NOT NULL REFERENCES pathways(id),
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  score INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, pathway_id)
);

-- Insert pathways
INSERT INTO pathways (title, description, order_number, type, content) VALUES
(
  'Topik 1: Jenis dan Mekanisme Ikatan Kimia',
  'Pelajari berbagai jenis ikatan kimia dan mekanisme pembentukannya',
  1,
  'topic',
  '{
    "sections": [
      {
        "title": "Pengertian Ikatan Kimia",
        "content": "Ikatan kimia adalah gaya tarik-menarik yang mengikat atom-atom bersama dalam molekul atau kristal. Ikatan kimia terbentuk karena atom-atom cenderung mencapai konfigurasi elektron yang stabil."
      },
      {
        "title": "Jenis-Jenis Ikatan Kimia",
        "content": "1. Ikatan Ionik: Transfer elektron dari atom logam ke atom nonlogam\n2. Ikatan Kovalen: Berbagi pasangan elektron antara dua atom\n3. Ikatan Logam: Elektron valensi bergerak bebas dalam struktur logam\n4. Ikatan Hidrogen: Gaya tarik antara atom hidrogen dan atom elektronegativ"
      },
      {
        "title": "Mekanisme Pembentukan Ikatan",
        "content": "Ikatan terbentuk ketika atom-atom bereaksi untuk mencapai konfigurasi elektron yang lebih stabil. Energi dilepaskan atau diserap selama proses pembentukan ikatan."
      }
    ]
  }'::jsonb
),
(
  'Forming a Molecule (Simulation)',
  'Simulasi pembentukan molekul dengan memilih atom dan mengamati ikatan yang terbentuk',
  2,
  'simulation',
  '{
    "instructions": "Pilih dua atom dari tabel periodik dan amati bagaimana ikatan terbentuk. Perhatikan perbedaan elektronegativitas dan jenis ikatan yang dihasilkan."
  }'::jsonb
),
(
  'Kuis 1: Jenis dan Mekanisme Ikatan Kimia',
  'Uji pemahaman Anda tentang jenis dan mekanisme ikatan kimia',
  3,
  'quiz',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Apa yang dimaksud dengan ikatan ionik?",
        "options": [
          "Transfer elektron dari atom logam ke atom nonlogam",
          "Berbagi pasangan elektron antara dua atom",
          "Elektron valensi bergerak bebas dalam struktur logam",
          "Gaya tarik antara atom hidrogen dan atom elektronegativ"
        ],
        "correct_answer": 0
      },
      {
        "id": 2,
        "question": "Ikatan kovalen terbentuk melalui...",
        "options": [
          "Transfer elektron",
          "Berbagi pasangan elektron",
          "Gaya tarik elektrostatik",
          "Pergerakan elektron bebas"
        ],
        "correct_answer": 1
      },
      {
        "id": 3,
        "question": "Manakah yang merupakan contoh ikatan ionik?",
        "options": [
          "H2O",
          "NaCl",
          "O2",
          "Fe"
        ],
        "correct_answer": 1
      }
    ]
  }'::jsonb
),
(
  'Topik 2: Struktur, Sifat, dan Penamaan Senyawa',
  'Pelajari struktur senyawa, sifat-sifatnya, dan cara penamaan yang benar',
  4,
  'topic',
  '{
    "sections": [
      {
        "title": "Struktur Senyawa",
        "content": "Struktur senyawa menentukan sifat-sifat fisik dan kimia. Struktur dapat digambarkan dengan rumus struktur Lewis atau model 3D."
      },
      {
        "title": "Sifat-Sifat Senyawa",
        "content": "Sifat senyawa dipengaruhi oleh jenis ikatan dan struktur molekul. Senyawa ionik umumnya padat, mudah larut dalam air, dan menghantarkan listrik. Senyawa kovalen umumnya gas atau cairan, kurang larut dalam air."
      },
      {
        "title": "Penamaan Senyawa",
        "content": "Senyawa ionik: nama kation + nama anion\nSenyawa kovalen: gunakan prefiks untuk menunjukkan jumlah atom (mono-, di-, tri-, dll)"
      }
    ]
  }'::jsonb
),
(
  'Energy of Bond Formation (Simulation)',
  'Simulasi energi yang dilepaskan atau diserap saat pembentukan ikatan',
  5,
  'simulation',
  '{
    "instructions": "Amati perubahan energi saat dua atom bergabung membentuk ikatan. Energi negatif menunjukkan ikatan yang stabil."
  }'::jsonb
),
(
  'Kuis 2: Struktur, Sifat, dan Penamaan Senyawa',
  'Uji pemahaman Anda tentang struktur, sifat, dan penamaan senyawa',
  6,
  'quiz',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Senyawa ionik umumnya memiliki sifat...",
        "options": [
          "Gas pada suhu ruang",
          "Padat dan mudah larut dalam air",
          "Cairan pada suhu ruang",
          "Tidak menghantarkan listrik"
        ],
        "correct_answer": 1
      },
      {
        "id": 2,
        "question": "Bagaimana cara menamai senyawa kovalen?",
        "options": [
          "Nama kation + nama anion",
          "Gunakan prefiks untuk menunjukkan jumlah atom",
          "Sesuai dengan rumus kimia",
          "Berdasarkan warna senyawa"
        ],
        "correct_answer": 1
      },
      {
        "id": 3,
        "question": "Manakah yang merupakan senyawa kovalen?",
        "options": [
          "NaCl",
          "KBr",
          "CO2",
          "MgO"
        ],
        "correct_answer": 2
      }
    ]
  }'::jsonb
),
(
  'Tes Akhir: Semua Materi Chemical Bonding',
  'Tes komprehensif yang mencakup semua materi chemical bonding',
  7,
  'final_test',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Apa perbedaan utama antara ikatan ionik dan kovalen?",
        "options": [
          "Ionik melibatkan transfer elektron, kovalen melibatkan berbagi elektron",
          "Ionik lebih kuat dari kovalen",
          "Kovalen hanya terjadi pada gas",
          "Ionik tidak menghasilkan energi"
        ],
        "correct_answer": 0
      },
      {
        "id": 2,
        "question": "Senyawa dengan ikatan logam memiliki sifat...",
        "options": [
          "Mudah larut dalam air",
          "Menghantarkan listrik dan panas dengan baik",
          "Tidak dapat ditempa",
          "Tidak berwarna"
        ],
        "correct_answer": 1
      },
      {
        "id": 3,
        "question": "Ikatan hidrogen terbentuk antara...",
        "options": [
          "Dua atom hidrogen",
          "Atom hidrogen dan atom elektronegativ",
          "Dua atom nonlogam",
          "Logam dan nonlogam"
        ],
        "correct_answer": 1
      },
      {
        "id": 4,
        "question": "Manakah yang bukan merupakan senyawa ionik?",
        "options": [
          "NaCl",
          "CaCl2",
          "CH4",
          "KBr"
        ],
        "correct_answer": 2
      },
      {
        "id": 5,
        "question": "Energi ikatan menunjukkan...",
        "options": [
          "Warna senyawa",
          "Energi yang diperlukan untuk memutus ikatan",
          "Jumlah atom dalam molekul",
          "Titik leleh senyawa"
        ],
        "correct_answer": 1
      }
    ]
  }'::jsonb
);

-- Enable RLS
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pathway_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pathways (public read)
CREATE POLICY "Pathways are viewable by everyone" ON pathways
  FOR SELECT USING (true);

-- Create RLS policies for user_pathway_progress
CREATE POLICY "Users can view their own pathway progress" ON user_pathway_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pathway progress" ON user_pathway_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pathway progress" ON user_pathway_progress
  FOR UPDATE USING (auth.uid() = user_id);
