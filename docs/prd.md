# SOURCE OF TRUTH — Front-End Aplikasi Cashflow Harian

## 1. Tujuan Proyek

Bangun aplikasi front-end untuk mencatat, memantau, dan menganalisis cashflow harian. Fokus tahap pertama hanya pada tampilan front-end, belum membutuhkan backend, database, atau autentikasi sungguhan.

Aplikasi harus dibuat menggunakan:

* HTML native
* Tailwind CSS Play CDN
* JavaScript native
* Responsive layout
* Komponen menu dinamis yang dipanggil dari `index.html`

Nama aplikasi: **Cashflow Harian**

---

## 2. Target Pengguna

Aplikasi ini ditujukan untuk:

* UMKM
* Freelancer
* Pemilik toko kecil
* Personal finance user
* Admin keuangan sederhana

---

## 3. Fitur Utama Front-End

### 3.1 Dashboard

Menampilkan ringkasan:

* Total pemasukan hari ini
* Total pengeluaran hari ini
* Saldo bersih
* Jumlah transaksi
* Grafik cashflow sederhana
* Ringkasan transaksi terbaru

### 3.2 Transaksi Harian

Halaman untuk melihat daftar transaksi.

Kolom tabel:

* Tanggal
* Kategori
* Deskripsi
* Jenis transaksi
* Nominal
* Status
* Aksi

Jenis transaksi:

* Pemasukan
* Pengeluaran

Status:

* Selesai
* Pending
* Dibatalkan

### 3.3 Tambah Transaksi

Form input transaksi dengan field:

* Tanggal
* Jenis transaksi
* Kategori
* Deskripsi
* Nominal
* Metode pembayaran
* Catatan

Metode pembayaran:

* Cash
* Transfer Bank
* QRIS
* E-Wallet

### 3.4 Kategori

Halaman manajemen kategori cashflow.

Kategori pemasukan:

* Penjualan
* Jasa
* Investasi
* Bonus
* Lainnya

Kategori pengeluaran:

* Operasional
* Gaji
* Transportasi
* Makan
* Belanja
* Tagihan
* Lainnya

### 3.5 Laporan

Halaman laporan sederhana berisi:

* Filter tanggal
* Total pemasukan
* Total pengeluaran
* Saldo akhir
* Ringkasan kategori
* Tabel laporan transaksi

### 3.6 Pengaturan

Halaman pengaturan berisi:

* Nama usaha
* Mata uang
* Format tanggal
* Mode tampilan
* Preferensi notifikasi dummy

---

## 4. Struktur File

Gunakan struktur berikut:

```txt
cashflow-harian/
├── index.html
├── README.md
├── PRD.md
├── assets/
│   ├── js/
│   │   ├── app.js
│   │   ├── menu.js
│   │   └── data.js
│   └── css/
│       └── style.css
├── components/
│   ├── sidebar.html
│   ├── topbar.html
│   └── mobile-menu.html
└── pages/
    ├── dashboard.html
    ├── transaksi.html
    ├── tambah-transaksi.html
    ├── kategori.html
    ├── laporan.html
    └── pengaturan.html
```

---

## 5. Aturan Teknis

### 5.1 HTML

Gunakan HTML semantic:

* `header`
* `nav`
* `main`
* `section`
* `aside`
* `footer`
* `form`
* `table`

### 5.2 Tailwind CSS

Gunakan Tailwind Play CDN langsung di `index.html`.

Contoh:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Boleh menambahkan konfigurasi Tailwind inline:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#2563eb',
          success: '#16a34a',
          danger: '#dc2626',
          warning: '#f59e0b'
        }
      }
    }
  }
</script>
```

### 5.3 JavaScript

Gunakan JavaScript native tanpa framework.

Menu harus dinamis dan dipanggil dari `index.html`.

Contoh konsep:

```js
const routes = {
  dashboard: 'pages/dashboard.html',
  transaksi: 'pages/transaksi.html',
  tambah: 'pages/tambah-transaksi.html',
  kategori: 'pages/kategori.html',
  laporan: 'pages/laporan.html',
  pengaturan: 'pages/pengaturan.html'
}
```

Ketika menu diklik, konten halaman dimuat ke dalam:

```html
<main id="app"></main>
```

Gunakan `fetch()` untuk memanggil halaman dari folder `pages`.

---

## 6. Layout Utama

Aplikasi menggunakan layout dashboard modern:

* Sidebar kiri untuk desktop
* Topbar atas
* Mobile bottom navigation atau hamburger menu
* Area konten utama
* Card statistik
* Table responsive
* Form responsive

Layout desktop:

```txt
+------------------------------------------------+
| Sidebar | Topbar                               |
|         |--------------------------------------|
|         | Main Content                         |
|         |                                      |
+------------------------------------------------+
```

Layout mobile:

```txt
+----------------------+
| Topbar               |
|----------------------|
| Main Content         |
|----------------------|
| Bottom Navigation    |
+----------------------+
```

---

## 7. UI Guidelines

Gunakan style modern SaaS financial dashboard 2026.

Karakter desain:

* Clean
* Minimal
* Profesional
* Rounded corner besar
* Soft shadow
* Warna netral
* Accent biru atau hijau
* Banyak whitespace
* Responsive mobile-first

Rekomendasi class Tailwind:

```txt
bg-slate-50
bg-white
text-slate-900
text-slate-500
rounded-2xl
shadow-sm
border border-slate-200
p-4
md:p-6
grid
gap-4
```

Card statistik:

```html
<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
  ...
</div>
```

Button utama:

```html
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium">
  Tambah Transaksi
</button>
```

---

## 8. Data Dummy

Gunakan data dummy dari `assets/js/data.js`.

Contoh struktur:

```js
const transactions = [
  {
    id: 1,
    date: '2026-07-08',
    type: 'income',
    category: 'Penjualan',
    description: 'Penjualan produk harian',
    amount: 750000,
    method: 'QRIS',
    status: 'Selesai'
  },
  {
    id: 2,
    date: '2026-07-08',
    type: 'expense',
    category: 'Operasional',
    description: 'Pembelian bahan baku',
    amount: 250000,
    method: 'Cash',
    status: 'Selesai'
  }
]
```

Semua tampilan cukup menggunakan data dummy dulu.

---

## 9. Navigasi Menu

Menu utama:

1. Dashboard
2. Transaksi
3. Tambah Transaksi
4. Kategori
5. Laporan
6. Pengaturan

Setiap menu harus memiliki:

* Icon sederhana menggunakan emoji atau SVG inline
* Label
* Active state
* Hover state

Contoh menu:

```js
const menus = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    page: 'pages/dashboard.html'
  },
  {
    id: 'transaksi',
    label: 'Transaksi',
    icon: '💸',
    page: 'pages/transaksi.html'
  },
  {
    id: 'tambah',
    label: 'Tambah',
    icon: '➕',
    page: 'pages/tambah-transaksi.html'
  },
  {
    id: 'kategori',
    label: 'Kategori',
    icon: '🏷️',
    page: 'pages/kategori.html'
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: '📑',
    page: 'pages/laporan.html'
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan',
    icon: '⚙️',
    page: 'pages/pengaturan.html'
  }
]
```

---

## 10. Ketentuan Responsive

Aplikasi wajib nyaman digunakan di:

* Mobile: 360px ke atas
* Tablet: 768px ke atas
* Desktop: 1024px ke atas

Aturan:

* Sidebar muncul di desktop
* Mobile menggunakan bottom navigation atau drawer menu
* Table harus bisa horizontal scroll
* Card statistik berubah dari 1 kolom ke 2 atau 4 kolom
* Form menggunakan 1 kolom di mobile dan 2 kolom di desktop

---

## 11. Halaman Detail

### 11.1 Dashboard

Komponen:

* Greeting section
* Summary cards
* Cashflow chart dummy
* Recent transaction table
* Quick action buttons

### 11.2 Transaksi

Komponen:

* Search input
* Filter jenis transaksi
* Filter tanggal
* Tabel transaksi
* Badge status
* Badge pemasukan/pengeluaran

### 11.3 Tambah Transaksi

Komponen:

* Form card
* Input nominal
* Select kategori
* Select metode pembayaran
* Submit button
* Reset button

Untuk tahap front-end, submit cukup menampilkan alert atau toast dummy.

### 11.4 Kategori

Komponen:

* Grid kategori pemasukan
* Grid kategori pengeluaran
* Button tambah kategori dummy

### 11.5 Laporan

Komponen:

* Filter periode
* Summary report
* Tabel laporan
* Export PDF button dummy
* Export Excel button dummy

### 11.6 Pengaturan

Komponen:

* Form profil usaha
* Preferensi aplikasi
* Tombol simpan dummy

---

## 12. Interaksi Front-End

Wajib ada:

* Navigasi halaman dinamis
* Active menu state
* Mobile menu toggle
* Format angka ke Rupiah
* Alert/toast dummy saat submit form
* Filter transaksi sederhana menggunakan JavaScript
* Search transaksi sederhana

Format Rupiah:

```js
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}
```

---

## 13. Larangan

Jangan gunakan:

* React
* Vue
* Angular
* Next.js
* Vite
* Bootstrap
* jQuery
* Backend
* Database
* Build tools

Semua harus berjalan cukup dengan membuka `index.html` melalui local server.

---

## 14. Instruksi Eksekusi untuk Codex

Buat seluruh struktur file sesuai spesifikasi.

Prioritas pengerjaan:

1. Buat `index.html`
2. Tambahkan Tailwind Play CDN
3. Buat layout utama dashboard
4. Buat sistem menu dinamis
5. Buat semua file halaman di folder `pages`
6. Buat data dummy di `assets/js/data.js`
7. Buat logic navigasi di `assets/js/app.js`
8. Buat menu config di `assets/js/menu.js`
9. Pastikan responsive mobile dan desktop
10. Pastikan semua menu dapat membuka halaman masing-masing

Aplikasi tidak perlu backend. Semua data boleh dummy.

Pastikan hasil akhir terlihat seperti aplikasi SaaS modern, profesional, ringan, dan nyaman digunakan untuk mencatat cashflow harian.

---

## 15. Acceptance Criteria

Aplikasi dianggap selesai jika:

* `index.html` berhasil dibuka
* Sidebar desktop tampil dengan baik
* Menu mobile tampil dengan baik
* Semua menu dapat diklik
* Konten halaman berubah sesuai menu
* Dashboard menampilkan card statistik
* Halaman transaksi menampilkan tabel
* Halaman tambah transaksi menampilkan form
* Halaman kategori menampilkan daftar kategori
* Halaman laporan menampilkan ringkasan laporan
* Halaman pengaturan menampilkan form pengaturan
* Tampilan responsive di mobile dan desktop
* Tidak ada framework selain Tailwind Play CDN
* Tidak ada error JavaScript di console

---

## 16. Prompt untuk Codex

Baca file `PRD.md` atau `SOURCE_OF_TRUTH.md` terlebih dahulu.

Bangun aplikasi front-end Cashflow Harian sesuai seluruh instruksi di dokumen tersebut.

Gunakan hanya HTML native, Tailwind CSS Play CDN, dan JavaScript native.

Buat struktur file sesuai dokumen.

Pastikan menu dinamis dipanggil dari `index.html`, konten halaman dimuat dari folder `pages`, dan semua data menggunakan dummy data dari `assets/js/data.js`.

Jangan gunakan framework JavaScript, backend, database, npm, Vite, React, Vue, Angular, Bootstrap, atau jQuery.

Fokus pada tampilan modern SaaS financial dashboard 2026 yang responsive, bersih, profesional, dan mudah digunakan.
