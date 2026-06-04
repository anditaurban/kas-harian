const incomeCategories = ['Penjualan', 'Jasa', 'Investasi', 'Bonus', 'Lainnya']
const expenseCategories = ['Operasional', 'Gaji', 'Transportasi', 'Makan', 'Belanja', 'Tagihan', 'Lainnya']
const paymentMethods = ['Cash', 'Transfer Bank', 'QRIS', 'E-Wallet']

const businessProfile = {
  businessName: 'Toko Andita',
  owner: 'Andita',
  currency: 'IDR',
  dateFormat: 'DD/MM/YYYY',
  displayMode: 'Terang',
  notifications: true
}

const transactions = [
  { id: 1, date: '2026-06-04', type: 'income', category: 'Penjualan', description: 'Penjualan produk pagi', amount: 950000, method: 'QRIS', status: 'Selesai' },
  { id: 2, date: '2026-06-04', type: 'expense', category: 'Operasional', description: 'Pembelian bahan baku', amount: 320000, method: 'Cash', status: 'Selesai' },
  { id: 3, date: '2026-06-04', type: 'income', category: 'Jasa', description: 'Pembayaran jasa konsultasi', amount: 1200000, method: 'Transfer Bank', status: 'Pending' },
  { id: 4, date: '2026-06-03', type: 'expense', category: 'Transportasi', description: 'Ongkos pengiriman barang', amount: 150000, method: 'E-Wallet', status: 'Selesai' },
  { id: 5, date: '2026-06-03', type: 'income', category: 'Penjualan', description: 'Penjualan grosir', amount: 1750000, method: 'Transfer Bank', status: 'Selesai' },
  { id: 6, date: '2026-06-02', type: 'expense', category: 'Gaji', description: 'Pembayaran helper harian', amount: 400000, method: 'Cash', status: 'Selesai' },
  { id: 7, date: '2026-06-02', type: 'expense', category: 'Tagihan', description: 'Tagihan internet toko', amount: 275000, method: 'QRIS', status: 'Pending' },
  { id: 8, date: '2026-06-01', type: 'income', category: 'Bonus', description: 'Bonus referral pelanggan', amount: 300000, method: 'E-Wallet', status: 'Selesai' },
  { id: 9, date: '2026-05-31', type: 'expense', category: 'Belanja', description: 'Belanja perlengkapan display', amount: 625000, method: 'Transfer Bank', status: 'Dibatalkan' },
  { id: 10, date: '2026-05-30', type: 'income', category: 'Investasi', description: 'Imbal hasil investasi pendek', amount: 450000, method: 'Transfer Bank', status: 'Selesai' },
  { id: 11, date: '2026-05-29', type: 'expense', category: 'Makan', description: 'Konsumsi rapat kecil', amount: 185000, method: 'QRIS', status: 'Selesai' },
  { id: 12, date: '2026-05-28', type: 'income', category: 'Lainnya', description: 'Pemasukan tambahan', amount: 210000, method: 'Cash', status: 'Pending' }
]
