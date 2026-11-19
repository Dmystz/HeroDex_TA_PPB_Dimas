# HeroDex: Game Character Encyclopedia

PWA (React + Vite) dengan data dari REST API sendiri (Supabase). Responsif untuk HP dan desktop, dengan Bottom Navigation Bar.

## Menjalankan

```bash
cp .env.example .env   # isi VITE_API_URL dan VITE_SUPABASE_KEY
npm install
npm run dev
npm run build          # hasil di dist/
npm run preview
```

## Data

| Endpoint | Keterangan |
| --- | --- |
| `GET /heroes_view` | daftar & detail hero (kolom: id, name, game, role, image, description) |
| `GET /games` | daftar & detail game (kolom: id, title, genre, image, description) |

`db.json` hanya contoh bentuk data untuk mock lokal.

## Catatan

- Hanya pakai **anon key** Supabase di frontend dan aktifkan Row Level Security di tabel. Jangan pernah memasukkan `service_role` key.
- `.env` sudah ada di `.gitignore`; gunakan `.env.example` untuk dibagikan.
- Response API di-cache 60 detik di memori dan disimpan Service Worker (NetworkFirst) agar tetap terbuka saat offline.

## Deploy (free hosting)

**Vercel / Netlify / Cloudflare Pages:** import repo GitHub, build command `npm run build`, output `dist`, lalu isi Environment Variables `VITE_API_URL` dan `VITE_SUPABASE_KEY`.

**GitHub Pages:** workflow sudah disiapkan di `.github/workflows/deploy.yml`. Aktifkan Settings > Pages > Source: GitHub Actions, tambahkan dua secrets di atas, lalu push ke `main`.

## Jadi APK (nilai tambah)

Setelah aplikasi ter-deploy (HTTPS), buka https://www.pwabuilder.com, masukkan URL aplikasi, lalu pilih Package for stores > Android untuk mengunduh APK/AAB.

## Memenuhi ketentuan Tugas Akhir

| Ketentuan | Implementasi |
| --- | --- |
| API sendiri | Supabase REST API (`heroes_view`, `games`) |
| Bottom Navigation Bar | Home, Heroes, Games, Favorites, About |
| Minimal 5 halaman | 7 halaman (5 tab + detail hero + detail game) |
| 2 list dengan detail | Heroes → detail hero, Games → detail game |
| Halaman Profile/About | About |
| PWA di-deploy | Lihat bagian Deploy |
