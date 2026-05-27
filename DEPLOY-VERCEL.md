# Deploy ChurchPresent ke Vercel

## Persiapan (5 menit)

### 1. Buat akun Supabase (database gratis)
1. Buka https://supabase.com → Sign Up (gratis)
2. Buat project baru → pilih region **Southeast Asia (Singapore)**
3. Tunggu project siap (~2 menit)
4. Buka **SQL Editor** → **New Query** → paste isi file `supabase/migrations/0001_initial_schema.sql` → **Run**
5. Buka **Settings** → **API** → catat:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Upload kode ke GitHub
```bash
# Di folder project (church-presenter)
git init
git add .
git commit -m "ChurchPresent v1.0"

# Buat repo baru di github.com, lalu:
git remote add origin https://github.com/USERNAME/church-presenter.git
git push -u origin main
```

### 3. Deploy ke Vercel
1. Buka https://vercel.com → Sign Up with GitHub (gratis)
2. Klik **Add New Project** → pilih repo `church-presenter`
3. Di bagian **Environment Variables**, tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   NEXT_PUBLIC_APP_URL          = https://churchpresent-xxx.vercel.app
   ```
4. Klik **Deploy** → tunggu ~2 menit

✅ Selesai! Aplikasi bisa diakses dari browser manapun.

---

## Cara Pakai (Vercel — multi-device)

| Browser | URL | Fungsi |
|---------|-----|--------|
| Laptop operator | `https://churchpresent-xxx.vercel.app/control` | Panel kendali |
| Proyektor / TV | `https://churchpresent-xxx.vercel.app/output` | Layar jemaat |
| Tablet worship team | `https://churchpresent-xxx.vercel.app/stage` | Stage monitor |

> **Sync antar perangkat**: Semua browser terhubung otomatis via Supabase Realtime.
> Tidak perlu berada di jaringan WiFi yang sama!

---

## Custom Domain (opsional)

Di Vercel Dashboard → Project → Settings → Domains → Add:
```
churchpresent.namagereja.com
```

---

## Update Aplikasi

Setiap kali push ke GitHub → Vercel otomatis rebuild dan deploy ulang.

```bash
git add .
git commit -m "Update lagu baru"
git push
```

---

## Batasan Gratis (Vercel + Supabase)

| Layanan | Gratis | Cukup untuk |
|---------|--------|-------------|
| Vercel | 100GB bandwidth/bulan | Ribuan ibadah |
| Supabase | 500MB database, 1GB storage | Ratusan lagu + media |
| Supabase Realtime | Unlimited connections | ✅ |

Cukup untuk gereja dengan 1 lokasi.
