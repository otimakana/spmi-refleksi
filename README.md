# Website Asesmen Reflektif SPMI

Website siap dihubungkan ke GitHub + Netlify Pages + Supabase. Paket berisi formulir publik pretest/posttest (masing-masing 5 soal), refleksi (3 pertanyaan), QR otomatis, API Netlify Functions, dan dashboard admin yang meniru struktur PDF Dashboard Refleksi Redoks V3.

## Fitur

- `index.html`: halaman awal berisi tautan dan QR Pretest, Posttest, dan Refleksi.
- `pretest.html`: nama, instansi, 5 soal; skor dihitung di backend.
- `posttest.html`: 5 soal yang sama agar hasil dapat dibandingkan.
- `refleksi.html`: nama, instansi, dan 3 jawaban terbuka sesuai permintaan.
- `dashboard.html`: login admin, ringkasan, distribusi kategori refleksi, topik yang sering disebut, skor pre/post berpasangan, pencarian jawaban, filter, dan ekspor CSV.
- `functions/`: API server-side. Kunci database tidak ditaruh di browser.
- `supabase/schema.sql`: skema database.

## 1. Siapkan Supabase

1. Buat proyek Supabase baru.
2. Buka **SQL Editor**.
3. Jalankan semua isi `supabase/schema.sql`.
4. Di pengaturan API proyek, salin **Project URL**.
5. Buat/salin key server-side yang bersifat rahasia. Gunakan `SUPABASE_SECRET_KEY` jika proyek Anda menyediakan key `sb_secret_...`. Key legacy `service_role` juga didukung melalui `SUPABASE_SERVICE_ROLE_KEY`.
6. Jangan pernah menuliskan key rahasia ke file HTML, JavaScript frontend, atau repositori GitHub.

## 2. Unggah ke GitHub

1. Buat repositori baru, misalnya `asesmen-reflektif-spmi`.
2. Unggah isi folder ini ke **root repositori**, sehingga folder `functions/`, `assets/`, `supabase/`, dan `index.html` berada langsung di root.
3. Pastikan file `.dev.vars` atau file secrets lokal tidak ikut diunggah. File rahasia tidak disertakan dalam paket ini.

## 3. Deploy ke Netlify

1. Buka Netlify dan pilih **Add new project → Import an existing project → GitHub**.
2. Pilih repositori ini.
3. Build command: kosongkan.
4. Publish directory: `.`
5. Functions directory: `netlify/functions` (sudah diatur di `netlify.toml`).
6. Deploy. Tidak perlu Wrangler/Netlify.
7. Setelah site jadi, buka **Site configuration → Environment variables** dan tambahkan:

| Nama | Isi |
|---|---|
| `SUPABASE_URL` | Project URL Supabase |
| `SUPABASE_SECRET_KEY` | Key server-side rahasia `sb_secret_...`; atau `SUPABASE_SERVICE_ROLE_KEY` untuk key legacy |
| `ADMIN_PASSWORD` | Password dashboard |
| `ADMIN_SESSION_SECRET` | Rahasia acak minimal 32 karakter |

8. Trigger **Deploy site** sekali lagi setelah variables disimpan.
9. Tes: buka `/api/health`. Harus muncul `databaseConfigured: true` dan `adminConfigured: true`.

### Struktur Netlify

- HTML/CSS/JS tetap di root.
- API Netlify Functions sudah dikonversi menjadi Netlify Functions di `netlify/functions/`.
- URL publik tetap sama: `/api/health`, `/api/admin/login`, `/api/admin/data`, `/api/submit/pretest`, `/api/submit/posttest`, dan `/api/submit/refleksi`.
- Frontend tidak perlu diubah karena tetap memanggil `/api/...`.

## 4. Cara menggunakan saat acara

- Bagikan/ tampilkan QR dari halaman beranda. QR dibuat otomatis sesuai alamat website yang sedang dibuka; karena itu tidak perlu mengganti URL secara manual setelah deployment.
- Sebelum sesi: peserta memindai QR Pretest.
- Setelah materi: peserta memindai QR Posttest.
- Penutup: peserta mengisi QR Refleksi.
- Fasilitator membuka `/dashboard.html` dan masuk menggunakan `ADMIN_PASSWORD`.
- Tombol **Perbarui data** mengambil data terkini. Tombol ekspor menghasilkan CSV yang dapat dibuka di Excel/Google Sheets.

## 5. Memasangkan pretest dan posttest

Website membuat ID acak otomatis di browser dan menyimpannya di `localStorage`. Nama dan instansi diminta di setiap formulir, sementara ID otomatis digunakan untuk memasangkan hasil pretest/posttest/refleksi. Karena itu peserta sebaiknya memakai perangkat dan browser yang sama pada ketiga tahap. Jika perangkat berganti atau penyimpanan browser dibersihkan, hasil mungkin tidak terpasang sebagai pasangan meskipun nama sama; hal ini disengaja agar dua peserta bernama sama tidak digabung otomatis.

Pengiriman ulang dari ID perangkat yang sama memperbarui jawaban pada tahap yang sama. Ini memudahkan koreksi kiriman, tetapi bukan sistem pencatatan percobaan berulang.

## 6. Catatan dashboard

- Kategori **Sudah memahami / Perlu penguatan / Masih bingung** adalah indikasi otomatis berbasis kata pada jawaban refleksi, bukan penilaian final. Baca jawaban asli sebelum mengambil keputusan.
- Analisis topik memakai pencocokan kata kunci sederhana, sehingga istilah baru atau frasa berbeda mungkin tidak terkelompokkan.
- Dashboard bersifat privat melalui login admin. Supabase tidak memberikan akses langsung dari browser; seluruh data dibaca melalui Netlify Functions setelah sesi admin diverifikasi.
- Formulir meminta persetujuan untuk penggunaan jawaban dan identitas dalam evaluasi sesi. Batasi akses dashboard kepada fasilitator yang berwenang dan hapus data sesuai kebutuhan/kebijakan penyelenggara.
- QR dibuat melalui layanan QR eksternal `api.qrserver.com`; yang dikirim ke layanan tersebut hanyalah URL halaman formulir, bukan nama maupun jawaban peserta.

## Struktur folder

```text
SPMI_Asesmen_Web/
├── index.html
├── pretest.html
├── posttest.html
├── refleksi.html
├── dashboard.html
├── assets/
│   ├── styles.css
│   ├── shared.js
│   ├── assessment.js
│   ├── reflection.js
│   └── dashboard.js
├── functions/
│   ├── api/
│   └── _lib/
└── supabase/schema.sql
```

## Troubleshooting

- **API health menyatakan database belum dikonfigurasi:** cek nama environment variable di Netlify dan jalankan deployment ulang.
- **Pengiriman gagal:** cek Logs di Netlify Functions. Pastikan skema SQL sudah dijalankan dan key server-side benar.
- **Dashboard tidak dapat login:** cek `ADMIN_PASSWORD` dan `ADMIN_SESSION_SECRET`; session secret harus minimal 32 karakter.
- **QR tidak tampil:** tautan biasa tetap tersedia. QR menggunakan layanan eksternal; pastikan jaringan mengizinkan akses ke `api.qrserver.com`.
# spmi-refleksi
