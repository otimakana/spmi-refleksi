# SPMI Asesmen – GitHub Pages + Supabase

## 1. Konfigurasi
Buka `assets/supabase.js` lalu isi:
- `url` = Project URL Supabase
- `anonKey` = Publishable/anon key Supabase (BUKAN secret/service_role)

## 2. RLS
Form peserta perlu INSERT ke `participants`, `assessment_responses`, `reflection_responses`.
Dashboard perlu SELECT. Karena GitHub Pages tidak punya backend, dashboard password di browser hanya penghalang tampilan, BUKAN keamanan database. Untuk data sensitif, sebaiknya dashboard nantinya dipindah ke Supabase Auth/Edge Function.

## 3. Upload
Upload SELURUH isi folder ini ke root repository GitHub. Aktifkan Settings → Pages → Deploy from branch → main → /(root).

## 4. Password dashboard
Password tampilan saat ini: `SPMI2026`. Ubah `ADMIN_PASSWORD` di `assets/dashboard.js` jika diperlukan.
