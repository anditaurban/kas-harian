## UI GUIDELINES — Modern Financial SaaS 2026

### 1. Design Direction

Gunakan gaya visual:

* Modern SaaS dashboard
* Clean financial app
* Premium but simple
* Mobile-first
* Soft professional interface
* Terlihat seperti produk fintech modern

Referensi rasa desain:

* Linear
* Stripe Dashboard
* Ramp
* Brex
* Wise Business
* Modern AI SaaS dashboard

---

### 2. Warna Utama

Gunakan warna dasar:

```txt
Background utama: slate-50
Surface/card: white
Primary: blue-600
Success: emerald-600
Danger: rose-600
Warning: amber-500
Text utama: slate-950
Text secondary: slate-500
Border: slate-200
```

Tambahkan Tailwind config:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8'
          }
        },
        boxShadow: {
          soft: '0 18px 45px rgba(15, 23, 42, 0.08)'
        },
        borderRadius: {
          '3xl': '1.5rem'
        }
      }
    }
  }
</script>
```

---

### 3. Layout

Gunakan layout:

```txt
Desktop:
Sidebar kiri fixed + topbar + content area

Mobile:
Topbar + content + bottom navigation
```

Aturan layout:

* Background utama `bg-slate-50`
* Sidebar `bg-white/90 backdrop-blur-xl`
* Card `bg-white rounded-3xl border border-slate-200 shadow-sm`
* Content wrapper `p-4 md:p-6 lg:p-8`
* Gap antar section minimal `gap-4 md:gap-6`
* Maksimalkan whitespace

---

### 4. Card Style

Semua card wajib konsisten:

```html
<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
  ...
</div>
```

Card penting boleh memakai:

```html
<div class="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-soft">
  ...
</div>
```

---

### 5. Typography

Gunakan hierarki:

```txt
Page title: text-2xl md:text-3xl font-bold text-slate-950
Section title: text-lg font-semibold text-slate-900
Card value: text-2xl font-bold text-slate-950
Label: text-sm font-medium text-slate-500
Body: text-sm text-slate-600
Small: text-xs text-slate-400
```

Jangan gunakan terlalu banyak ukuran font berbeda.

---

### 6. Button Style

Primary button:

```html
<button class="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]">
  Simpan
</button>
```

Secondary button:

```html
<button class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">
  Batal
</button>
```

Danger button:

```html
<button class="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">
  Hapus
</button>
```

---

### 7. Form Style

Input, select, textarea wajib menggunakan style:

```html
<input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
```

Label:

```html
<label class="mb-2 block text-sm font-semibold text-slate-700">
  Nama Field
</label>
```

Form card:

```html
<div class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
  ...
</div>
```

---

### 8. Table Style

Table wrapper:

```html
<div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
```

Header table:

```html
<thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
```

Row:

```html
<tr class="border-t border-slate-100 hover:bg-slate-50/80">
```

Cell:

```html
<td class="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
```

---

### 9. Badge Style

Income badge:

```html
<span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
  Pemasukan
</span>
```

Expense badge:

```html
<span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
  Pengeluaran
</span>
```

Status success:

```html
<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
  Selesai
</span>
```

---

### 10. Sidebar Style

Sidebar desktop:

```html
<aside class="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white/90 p-4 backdrop-blur-xl lg:block">
```

Menu item:

```html
<button class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
```

Active menu:

```html
<button class="flex w-full items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm">
```

---

### 11. Mobile Navigation

Bottom nav:

```html
<nav class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/90 px-2 py-2 backdrop-blur-xl lg:hidden">
```

Item mobile:

```html
<button class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium text-slate-500">
```

Active mobile item:

```html
<button class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700">
```

---

### 12. Dashboard Visual

Dashboard harus terasa modern dengan:

* Hero summary card gradient
* Statistik dalam card kecil
* Chart dummy berbentuk bar chart
* Recent transaction list
* Quick action cards
* Empty state jika data kosong

Gunakan kombinasi:

```txt
rounded-3xl
shadow-sm
border-slate-200
bg-gradient-to-br
from-blue-600
to-indigo-600
```

---

### 13. Micro Interaction

Tambahkan:

* Hover state di semua button
* Active scale kecil `active:scale-[0.98]`
* Transition halus `transition duration-200`
* Toast notification
* Loading skeleton sederhana saat fetch halaman
* Empty state card

---

### 14. Responsive Rules

Mobile:

* 1 column layout
* Padding `p-4`
* Bottom nav aktif
* Sidebar hidden
* Table scroll horizontal

Tablet:

* 2 column card grid
* Form bisa 2 kolom

Desktop:

* Sidebar fixed
* Content margin kiri `lg:ml-72`
* Card grid 4 kolom
* Lebar konten nyaman

---

### 15. Design Quality Checklist

Sebelum selesai, pastikan:

* Tidak terlihat seperti template lama.
* Tidak terlalu banyak warna.
* Semua spacing konsisten.
* Semua card punya radius besar.
* Semua button punya hover state.
* Semua form punya focus state.
* Table tetap rapi di mobile.
* Dashboard terlihat premium.
* UI terasa seperti SaaS fintech modern 2026.
