# AGENTS.md

# AI Development Agent Rules

Dokumen ini berfungsi sebagai aturan utama yang harus diikuti oleh AI Agent (Codex) selama proses pengembangan aplikasi.

---

# 1. Mission

Bangun aplikasi **Cashflow Harian** sesuai spesifikasi yang telah didefinisikan dalam dokumentasi proyek.

Agent tidak boleh membuat asumsi sendiri yang bertentangan dengan dokumen proyek.

Semua implementasi harus mengacu pada dokumen yang tersedia di folder:

```txt
/docs
```

---

# 2. Source of Truth Priority

Sebelum melakukan perubahan apa pun, baca dokumen berikut secara berurutan:

Priority 1

```txt
/docs/PRD.md
```

Berisi:

* Business requirements
* Product requirements
* Struktur aplikasi
* Fitur utama
* Acceptance criteria

---

Priority 2

```txt
/docs/IMPLEMENTATION_PLAN.md
```

Berisi:

* Tahapan pengerjaan
* Urutan implementasi
* Deliverables per phase
* Technical checklist

---

Priority 3

```txt
/docs/UI_GUIDELINES.md
```

Berisi:

* Design system
* Layout rules
* Component styling
* Responsive behavior
* UX standards

---

Jika terdapat konflik:

```txt
PRD.md
mengalahkan
IMPLEMENTATION_PLAN.md

IMPLEMENTATION_PLAN.md
mengalahkan
UI_GUIDELINES.md
```

Urutan prioritas:

```txt
PRD
>
IMPLEMENTATION PLAN
>
UI GUIDELINES
```

---

# 3. Required Workflow

Setiap kali menerima task baru:

Step 1

Baca:

```txt
/docs/PRD.md
```

---

Step 2

Baca:

```txt
/docs/IMPLEMENTATION_PLAN.md
```

---

Step 3

Baca:

```txt
/docs/UI_GUIDELINES.md
```

---

Step 4

Identifikasi phase yang sedang dikerjakan.

Contoh:

```txt
Phase 1 - Setup

Phase 2 - Layout

Phase 3 - Navigation

Phase 4 - Dummy Data

dst
```

---

Step 5

Kerjakan hanya phase terkait.

Jangan melompat ke phase berikutnya sebelum phase aktif selesai.

---

Step 6

Lakukan self validation menggunakan acceptance criteria phase tersebut.

---

Step 7

Baru lanjut ke phase berikutnya.

---

# 4. Frontend Technology Rules

Wajib menggunakan:

```txt
HTML Native
Tailwind CSS Play CDN
JavaScript Native
CSS Native
```

---

Dilarang menggunakan:

```txt
React
Next.js
Vue
Nuxt
Angular
Svelte
Bootstrap
jQuery
TypeScript
Node Framework
Backend Framework
Database
NPM Package
Build Tool
Vite
Webpack
Parcel
```

Semua halaman harus dapat berjalan menggunakan:

```txt
index.html
```

dan local server sederhana.

---

# 5. Architecture Rules

Gunakan struktur:

```txt
index.html

assets/
components/
pages/
docs/
```

Jangan membuat struktur baru tanpa alasan yang jelas.

---

# 6. Dynamic Navigation Rules

Menu wajib berasal dari:

```txt
assets/js/menu.js
```

Dilarang hardcode menu di:

```txt
index.html
```

Konten halaman wajib dimuat secara dinamis menggunakan:

```js
fetch()
```

ke dalam:

```html
<main id="app"></main>
```

---

# 7. Design Rules

Ikuti seluruh aturan pada:

```txt
/docs/UI_GUIDELINES.md
```

Prioritas desain:

1. Modern SaaS
2. Financial Dashboard
3. Mobile First
4. Responsive
5. Clean Layout
6. Premium Feel

---

Semua halaman wajib menggunakan:

```txt
rounded-3xl
soft shadow
large spacing
clean typography
consistent color system
```

---

# 8. Responsive Rules

Minimal breakpoint:

```txt
360px
768px
1024px
1440px
```

Wajib memastikan:

* Mobile navigation berfungsi
* Sidebar desktop berfungsi
* Table responsive
* Form responsive
* No horizontal overflow

---

# 9. Coding Standards

Gunakan:

```txt
Semantic HTML
Reusable Components
Clean JavaScript
Readable Naming
```

Nama function harus jelas:

```js
renderMenus()
loadPage()
formatRupiah()
renderDashboard()
renderTransactions()
```

Hindari:

```js
a()
b()
temp()
test()
```

---

# 10. Self Review Before Commit

Sebelum menyelesaikan task:

Periksa:

```txt
✓ Tidak ada console error

✓ Tidak ada broken layout

✓ Responsive

✓ Mengikuti UI Guidelines

✓ Mengikuti PRD

✓ Mengikuti Implementation Plan

✓ Semua acceptance criteria phase terpenuhi
```

---

# 11. File Creation Rules

Jika file belum ada:

```txt
boleh dibuat
```

Jika file sudah ada:

```txt
edit file yang ada
```

Jangan membuat file duplikat seperti:

```txt
dashboard-new.html
dashboard-v2.html
dashboard-final.html
```

---

# 12. Agent Execution Command

Untuk setiap task baru, lakukan proses berikut:

1. Read /docs/PRD.md

2. Read /docs/IMPLEMENTATION_PLAN.md

3. Read /docs/UI_GUIDELINES.md

4. Determine active phase

5. Implement requirements

6. Validate acceptance criteria

7. Verify responsive behavior

8. Verify UI consistency

9. Verify no console errors

10. Complete task

---

# 13. Definition of Done

Task dianggap selesai jika:

```txt
Semua acceptance criteria terpenuhi

Tidak ada error JavaScript

Responsive berjalan baik

Mengikuti UI Guidelines

Mengikuti PRD

Mengikuti Implementation Plan
```

Jika salah satu belum terpenuhi:

```txt
Task belum selesai
```
