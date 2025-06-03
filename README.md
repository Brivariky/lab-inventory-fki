# Lab Inventory System — INACOS

Sistem manajemen inventaris laboratorium kampus berbasis **Laravel (backend)** dan **Next.js (frontend)**. Dirancang modular per lab seperti LAB FKI, LAB SI, LAB JARKOM, dsb.

---

## 📁 Struktur Folder Proyek

```
lab-inventory-fki/
├── app/
├── bootstrap/
├── config/
├── database/
│   └── lab_inventory_fki.sql       ← file dump database
├── frontend/                       ← project Next.js (UI)
├── public/
├── resources/
├── routes/
├── storage/
├── .env.example
├── artisan
├── composer.json
├── README.md
```

### ❌ Folder/File yang **TIDAK perlu dikirim**
- `vendor/`
- `node_modules/` (termasuk di dalam `frontend/`)
- `frontend/.next/`
- `.env`
- Cache OS: `.DS_Store`, `Thumbs.db`

---

## 📦 Cara ZIP Proyek (Sebelum Dikirim)

```bash
zip -r lab-inventory-fki.zip lab-inventory-fki \
  -x "lab-inventory-fki/vendor/*" \
  -x "lab-inventory-fki/node_modules/*" \
  -x "lab-inventory-fki/frontend/node_modules/*" \
  -x "lab-inventory-fki/frontend/.next/*" \
  -x "lab-inventory-fki/.env"
```

Pastikan file `lab_inventory_fki.sql` disertakan di dalam folder `database/`.

---

## 🧑‍💻 Cara Menjalankan Proyek (Setelah Ekstrak)

### ✅ A. Backend — Laravel 12

#### 1. Tempatkan folder ke:
```
C:\laragon\www\lab-inventory-fki
```

#### 2. Jalankan:

```bash
cd lab-inventory-fki
composer install
copy .env.example .env
php artisan key:generate
```

#### 3. Import Database

- Buka `http://localhost/phpmyadmin`
- Buat database `lab_inventory_fki`
- Import file `database/lab_inventory_fki.sql`

#### 4. Akses API Laravel

Jika menggunakan Laragon atau Laravel Herd:

```
http://lab-inventory-fki.test/api/items
```

> ⚠️ Laravel 12 **tidak menggunakan `php artisan serve`**. Gunakan Laragon/Herd untuk domain `.test`.

---

### ✅ B. Frontend — Next.js (PNPM)

```bash
cd frontend
pnpm install        # atau npm install
pnpm run dev        # jalankan development server
```

Akses di browser:
```
http://localhost:3000/
```

---

## 🔗 Koneksi Frontend ke Backend

File konfigurasi `axios.ts` (di `frontend/src/lib/axios.ts`):

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://lab-inventory-fki.test/api',
  headers: {
    Accept: 'application/json',
  },
});

export default api;
```

Jika menggunakan `localhost:8000` sebagai backend, ganti `baseURL` menjadi:
```ts
baseURL: 'http://localhost:8000/api'
```

---

## 🔍 Fitur Aplikasi

- ✅ Manajemen item dan produk
- ✅ Tambah/edit/hapus unit per item
- ✅ Hitung kondisi baik/buruk per unit
- ✅ Modular per-lab dengan template dinamis
- ✅ Export data ke Excel per sheet/lab
- ✅ Pencarian berdasarkan nama & kode

---

## ⚙️ Persyaratan Sistem

| Komponen          | Versi Minimum | Keterangan                  |
|-------------------|---------------|-----------------------------|
| PHP               | 8.1+          | Laravel 12 kompatibel       |
| Composer          | 2.x           | Laravel dependency          |
| Node.js           | 18+           | Untuk Next.js               |
| PNPM/NPM          | latest        | Disarankan: PNPM            |
| MySQL             | 5.7+ / 8      | Database backend            |
| Laravel Herd      | Opsional      | Otomatis domain `.test`     |
| Laragon           | Disarankan    | Untuk Windows full stack    |

---

📦 Dibuat dengan ❤️ oleh **Project Bank** untuk **INACOS Lab Inventory**.