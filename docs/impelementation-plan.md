# IMPLEMENTATION PLAN — Front-End Cashflow Harian

## Phase 1 — Setup Struktur Project

Buat struktur folder:

```txt
cashflow-harian/
├── index.html
├── README.md
├── PRD.md
├── IMPLEMENTATION_PLAN.md
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

Acceptance criteria:

* Semua folder dan file tersedia.
* `index.html` bisa dibuka.
* Tailwind Play CDN sudah aktif.

---

## Phase 2 — Buat Shell Layout Utama

Kerjakan `index.html`.

Isi wajib:

* Tailwind CDN
* Config warna Tailwind
* Container aplikasi utama
* Sidebar placeholder
* Topbar placeholder
* Main content dengan `id="app"`
* Mobile navigation container
* Script import:

  * `assets/js/data.js`
  * `assets/js/menu.js`
  * `assets/js/app.js`

Acceptance criteria:

* Layout desktop dan mobile terbentuk.
* Area konten utama tersedia.
* Tidak ada error console.

---

## Phase 3 — Buat Konfigurasi Menu Dinamis

Kerjakan `assets/js/menu.js`.

Buat array menu:

```js
const menus = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', page: 'pages/dashboard.html' },
  { id: 'transaksi', label: 'Transaksi', icon: '💸', page: 'pages/transaksi.html' },
  { id: 'tambah', label: 'Tambah', icon: '➕', page: 'pages/tambah-transaksi.html' },
  { id: 'kategori', label: 'Kategori', icon: '🏷️', page: 'pages/kategori.html' },
  { id: 'laporan', label: 'Laporan', icon: '📑', page: 'pages/laporan.html' },
  { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️', page: 'pages/pengaturan.html' }
]
```

Acceptance criteria:

* Menu tidak hardcoded di HTML.
* Sidebar dan mobile menu memakai data dari `menus`.

---

## Phase 4 — Buat Data Dummy

Kerjakan `assets/js/data.js`.

Isi data:

* `transactions`
* `incomeCategories`
* `expenseCategories`
* `paymentMethods`
* `businessProfile`

Acceptance criteria:

* Minimal 10 transaksi dummy.
* Ada data pemasukan dan pengeluaran.
* Nominal menggunakan angka integer.
* Data bisa dipakai oleh halaman dashboard, transaksi, dan laporan.

---

## Phase 5 — Buat Core JavaScript App

Kerjakan `assets/js/app.js`.

Fungsi wajib:

```js
renderMenus()
loadPage(pageId)
setActiveMenu(pageId)
formatRupiah(value)
showToast(message, type)
renderPageScripts(pageId)
```

Flow utama:

1. Saat aplikasi dibuka, panggil `renderMenus()`.
2. Load halaman default `dashboard`.
3. Jika menu diklik, panggil `loadPage(menu.id)`.
4. Ambil file halaman dari `menu.page` menggunakan `fetch()`.
5. Masukkan hasil HTML ke `#app`.
6. Update active state menu.
7. Jalankan logic khusus halaman lewat `renderPageScripts(pageId)`.

Acceptance criteria:

* Semua menu bisa diklik.
* Konten halaman berubah tanpa reload penuh.
* Active state berubah sesuai menu.
* Halaman default adalah dashboard.

---

## Phase 6 — Buat Komponen Layout

Kerjakan file:

* `components/sidebar.html`
* `components/topbar.html`
* `components/mobile-menu.html`

Catatan:

Karena menu dirender dinamis lewat JavaScript, komponen cukup menyediakan container.

Contoh:

```html
<nav id="sidebar-menu"></nav>
<nav id="mobile-menu"></nav>
```

Acceptance criteria:

* Sidebar tampil di desktop.
* Mobile menu tampil di mobile.
* Menu berasal dari JavaScript, bukan hardcoded.

---

## Phase 7 — Buat Halaman Dashboard

Kerjakan `pages/dashboard.html`.

Komponen wajib:

* Greeting card
* 4 summary card:

  * Pemasukan hari ini
  * Pengeluaran hari ini
  * Saldo bersih
  * Total transaksi
* Grafik dummy cashflow
* Tabel transaksi terbaru
* Quick action button ke tambah transaksi dan laporan

Acceptance criteria:

* Dashboard terlihat modern.
* Data angka berasal dari `transactions`.
* Rupiah diformat dengan `formatRupiah`.
* Layout responsive 1 kolom mobile, 4 kolom desktop.

---

## Phase 8 — Buat Halaman Transaksi

Kerjakan `pages/transaksi.html`.

Komponen wajib:

* Search input
* Filter jenis transaksi
* Filter status
* Tabel transaksi
* Badge pemasukan/pengeluaran
* Badge status
* Tombol tambah transaksi

Logic di `app.js`:

```js
renderTransactionTable()
filterTransactions()
```

Acceptance criteria:

* Tabel transaksi tampil dari data dummy.
* Search berjalan.
* Filter jenis transaksi berjalan.
* Filter status berjalan.
* Table horizontal scroll di mobile.

---

## Phase 9 — Buat Halaman Tambah Transaksi

Kerjakan `pages/tambah-transaksi.html`.

Komponen wajib:

* Form tanggal
* Select jenis transaksi
* Select kategori
* Input deskripsi
* Input nominal
* Select metode pembayaran
* Textarea catatan
* Tombol simpan
* Tombol reset

Logic di `app.js`:

```js
handleTransactionForm()
updateCategoryOptions()
```

Acceptance criteria:

* Form tampil responsive.
* Kategori berubah sesuai jenis transaksi.
* Submit menampilkan toast dummy.
* Reset mengosongkan form.

---

## Phase 10 — Buat Halaman Kategori

Kerjakan `pages/kategori.html`.

Komponen wajib:

* Card kategori pemasukan
* Card kategori pengeluaran
* Button tambah kategori dummy
* Badge jumlah kategori

Acceptance criteria:

* Semua kategori dari `data.js`.
* Tampilan grid responsive.
* Button tambah kategori menampilkan toast dummy.

---

## Phase 11 — Buat Halaman Laporan

Kerjakan `pages/laporan.html`.

Komponen wajib:

* Filter tanggal awal
* Filter tanggal akhir
* Summary report
* Tabel laporan
* Ringkasan per kategori
* Button export PDF dummy
* Button export Excel dummy

Logic di `app.js`:

```js
renderReport()
filterReportByDate()
```

Acceptance criteria:

* Summary laporan dihitung dari data dummy.
* Filter tanggal bekerja.
* Export button menampilkan toast dummy.

---

## Phase 12 — Buat Halaman Pengaturan

Kerjakan `pages/pengaturan.html`.

Komponen wajib:

* Form nama usaha
* Input pemilik
* Select mata uang
* Select format tanggal
* Toggle dummy dark mode
* Toggle dummy notifikasi
* Tombol simpan

Acceptance criteria:

* Form tampil rapi.
* Data awal dari `businessProfile`.
* Simpan menampilkan toast dummy.

---

## Phase 13 — Styling Tambahan

Kerjakan `assets/css/style.css`.

Tambahkan hanya styling yang tidak nyaman dibuat dengan Tailwind, seperti:

* Custom scrollbar
* Toast animation
* Smooth transition
* Chart dummy bar height

Acceptance criteria:

* Tidak mengganti konsep Tailwind.
* CSS tambahan minimal dan rapi.

---

## Phase 14 — Responsive Testing

Uji ukuran:

* 360px
* 768px
* 1024px
* 1440px

Checklist:

* Sidebar tidak muncul di mobile.
* Mobile menu muncul di mobile.
* Table bisa scroll horizontal.
* Card tidak pecah.
* Form nyaman diisi.
* Tidak ada overflow aneh.

---

## Phase 15 — Final QA

Checklist final:

* Semua menu berfungsi.
* Tidak ada error console.
* Semua halaman bisa dimuat.
* Semua data dummy tampil.
* Semua tombol dummy memberi feedback.
* Desain konsisten.
* Responsive baik.
* Tidak ada framework tambahan.
* Tidak ada backend.
* Tidak ada npm.
* Bisa dijalankan via local server.

---

# Prompt Eksekusi untuk Codex

Baca file `PRD.md` dan `IMPLEMENTATION_PLAN.md` terlebih dahulu.

Kerjakan aplikasi front-end Cashflow Harian secara bertahap sesuai implementation plan.

Mulai dari Phase 1 sampai Phase 15.

Gunakan hanya:

* HTML native
* Tailwind CSS Play CDN
* JavaScript native
* CSS native seperlunya

Jangan gunakan:

* React
* Vue
* Angular
* Next.js
* Vite
* npm
* Bootstrap
* jQuery
* Backend
* Database

Pastikan menu aplikasi bersifat dinamis dari `assets/js/menu.js`, dipanggil dan dirender melalui `index.html`, lalu konten halaman dimuat dari folder `pages` menggunakan JavaScript native.

Setelah selesai, lakukan self-check berdasarkan acceptance criteria di setiap phase.
