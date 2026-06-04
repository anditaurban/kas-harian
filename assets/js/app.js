const state = {
  activePage: 'dashboard',
  componentsLoaded: false,
  darkMode: getStoredTheme() === 'dark'
}

const transactionStatusOptions = ['Selesai', 'Pending', 'Dibatalkan']

const iconMap = {
  grid: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect></svg>',
  wallet: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H5a2 2 0 0 1 0-4h13v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h15V7"></path><path d="M16 14h4"></path></svg>',
  plus: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
  tag: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13 11 4H4v7l9 9 7-7Z"></path><path d="M7.5 7.5h.01"></path></svg>',
  report: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path><path d="M14 3v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path></svg>',
  settings: '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path><path d="m19.4 15 .1 2.2-2 1.2-1.9-1a8 8 0 0 1-1.8 1l-.3 2.1h-3l-.3-2.1a8 8 0 0 1-1.8-1l-1.9 1-2-1.2.1-2.2a8.7 8.7 0 0 1-.9-1.8L2 11.5l1.5-1.8a8.7 8.7 0 0 1 .9-1.8l-.1-2.2 2-1.2 1.9 1a8 8 0 0 1 1.8-1l.3-2.1h3l.3 2.1a8 8 0 0 1 1.8 1l1.9-1 2 1.2-.1 2.2c.4.6.7 1.2.9 1.8l1.5 1.8-1.5 1.8c-.2.6-.5 1.2-.9 1.8Z"></path></svg>'
}

document.addEventListener('DOMContentLoaded', initApp)

async function initApp() {
  applyTheme(state.darkMode)
  await loadLayoutComponents()
  renderMenus()
  bindGlobalActions()
  await loadPage('dashboard')
}

async function loadLayoutComponents() {
  const components = [
    { target: 'sidebar-component', path: 'components/sidebar.html' },
    { target: 'topbar-component', path: 'components/topbar.html' },
    { target: 'mobile-menu-component', path: 'components/mobile-menu.html' }
  ]

  await Promise.all(components.map(async (component) => {
    const target = document.getElementById(component.target)
    if (!target) return
    const response = await fetch(component.path)
    target.innerHTML = await response.text()
  }))
  state.componentsLoaded = true
}

function renderMenus() {
  const sidebarMenu = document.getElementById('sidebar-menu')
  const mobileMenu = document.getElementById('mobile-menu')
  if (!sidebarMenu || !mobileMenu) return

  sidebarMenu.innerHTML = menus.map((menu) => `
    <button type="button" data-page="${menu.id}" class="menu-link flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-950 active:scale-[0.98]">
      ${iconMap[menu.icon] || ''}
      <span>${menu.label}</span>
    </button>
  `).join('')

  mobileMenu.innerHTML = menus.map((menu) => `
    <button type="button" data-page="${menu.id}" class="menu-link flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium text-slate-500 transition duration-200 active:scale-[0.98]">
      ${iconMap[menu.icon] || ''}
      <span class="truncate">${menu.id === 'tambah' ? 'Tambah' : menu.label}</span>
    </button>
  `).join('')
}

async function loadPage(pageId) {
  const menu = menus.find((item) => item.id === pageId) || menus[0]
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = renderLoadingSkeleton()
  try {
    const response = await fetch(menu.page)
    if (!response.ok) throw new Error('Halaman tidak dapat dimuat')
    app.innerHTML = await response.text()
    state.activePage = menu.id
    setActiveMenu(menu.id)
    renderPageScripts(menu.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    app.innerHTML = `
      <section class="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
        <p class="text-lg font-semibold text-rose-700">Halaman gagal dimuat</p>
        <p class="mt-2 text-sm text-slate-600">${error.message}. Jalankan melalui local server sederhana agar fetch bekerja.</p>
      </section>
    `
  }
}

function setActiveMenu(pageId) {
  document.querySelectorAll('.menu-link').forEach((button) => {
    const isActive = button.dataset.page === pageId
    button.className = button.closest('#mobile-menu')
      ? `menu-link flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs transition duration-200 active:scale-[0.98] ${isActive ? 'bg-blue-50 font-semibold text-blue-700' : 'font-medium text-slate-500'}`
      : `menu-link flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-200 active:scale-[0.98] ${isActive ? 'bg-blue-600 font-semibold text-white shadow-sm' : 'font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`
  })

  const title = document.getElementById('topbar-title')
  const activeMenu = menus.find((menu) => menu.id === pageId)
  if (title && activeMenu) title.textContent = activeMenu.label
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container')
  if (!toastContainer) return

  const colors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-rose-200 bg-rose-50 text-rose-800'
  }
  const toast = document.createElement('div')
  toast.className = `toast-item rounded-3xl border p-4 text-sm font-semibold shadow-soft ${colors[type] || colors.success}`
  toast.textContent = message
  toastContainer.appendChild(toast)
  window.setTimeout(() => toast.classList.add('toast-hide'), 2600)
  window.setTimeout(() => toast.remove(), 3100)
}

function renderPageScripts(pageId) {
  const scripts = {
    dashboard: renderDashboard,
    transaksi: renderTransactions,
    tambah: handleTransactionForm,
    kategori: renderCategories,
    laporan: renderReport,
    pengaturan: renderSettings
  }
  if (scripts[pageId]) scripts[pageId]()
}

function bindGlobalActions() {
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('[data-modal-overlay]') || event.target.closest('[data-modal-close]')) {
      closeModal()
      return
    }

    const pageButton = event.target.closest('[data-page]')
    if (pageButton) {
      loadPage(pageButton.dataset.page)
      return
    }

    const actionButton = event.target.closest('[data-action]')
    if (actionButton) {
      handleActionButton(actionButton)
      return
    }

    const toastButton = event.target.closest('[data-toast]')
    if (toastButton) showToast(toastButton.dataset.toast, toastButton.dataset.toastType || 'success')
  })
}

function handleActionButton(button) {
  const action = button.dataset.action
  if (action === 'edit-transaction') openTransactionEditModal(Number(button.dataset.transactionId))
  if (action === 'delete-transaction') confirmDeleteTransaction(Number(button.dataset.transactionId))
  if (action === 'edit-category') openCategoryEditModal(button.dataset.categoryType, button.dataset.category)
  if (action === 'delete-category') confirmDeleteCategory(button.dataset.categoryType, button.dataset.category)
}

function renderLoadingSkeleton() {
  return `
    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="loading-skeleton h-32 rounded-3xl"></div>
      <div class="loading-skeleton h-32 rounded-3xl"></div>
      <div class="loading-skeleton h-32 rounded-3xl"></div>
      <div class="loading-skeleton h-32 rounded-3xl"></div>
    </section>
  `
}

function getCompletedTransactions(items = transactions) {
  return items.filter((item) => item.status === 'Selesai')
}

function sumTransactions(items, type) {
  return getCompletedTransactions(items)
    .filter((item) => item.type === type)
    .reduce((total, item) => total + item.amount, 0)
}

function getTodayTransactions() {
  return transactions.filter((item) => item.date === '2026-06-04')
}

function renderDashboard() {
  const todayItems = getTodayTransactions()
  const income = sumTransactions(todayItems, 'income')
  const expense = sumTransactions(todayItems, 'expense')
  const balance = income - expense
  const cards = [
    { label: 'Pemasukan hari ini', value: formatRupiah(income), tone: 'text-emerald-600' },
    { label: 'Pengeluaran hari ini', value: formatRupiah(expense), tone: 'text-rose-600' },
    { label: 'Saldo bersih', value: formatRupiah(balance), tone: 'text-blue-600' },
    { label: 'Total transaksi', value: String(todayItems.length), tone: 'text-slate-950' }
  ]

  setText('dashboard-business', businessProfile.businessName)
  setText('dashboard-income', formatRupiah(income))
  setText('dashboard-expense', formatRupiah(expense))
  setText('dashboard-balance', formatRupiah(balance))

  const cardTarget = document.getElementById('summary-cards')
  if (cardTarget) {
    cardTarget.innerHTML = cards.map((card) => `
      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">${card.label}</p>
        <p class="mt-3 text-2xl font-bold ${card.tone}">${card.value}</p>
      </article>
    `).join('')
  }

  renderChartBars('dashboard-chart', transactions.slice(0, 7))
  renderTableRows('recent-transactions', transactions.slice(0, 5), { showActions: false })
}

function renderTransactions() {
  renderTransactionTable(transactions)
  const search = document.getElementById('transaction-search')
  const type = document.getElementById('transaction-type-filter')
  const status = document.getElementById('transaction-status-filter')
  ;[search, type, status].forEach((control) => {
    if (control) control.addEventListener('input', filterTransactions)
  })
}

function renderTransactionTable(items) {
  const target = document.getElementById('transaction-table-body')
  if (!target) return
  target.innerHTML = items.length ? items.map((item) => transactionRow(item)).join('') : emptyRow('Tidak ada transaksi yang cocok.', 7)
}

function filterTransactions() {
  const searchValue = (document.getElementById('transaction-search')?.value || '').toLowerCase()
  const typeValue = document.getElementById('transaction-type-filter')?.value || 'all'
  const statusValue = document.getElementById('transaction-status-filter')?.value || 'all'
  const filtered = transactions.filter((item) => {
    const matchSearch = [item.description, item.category, item.method].join(' ').toLowerCase().includes(searchValue)
    const matchType = typeValue === 'all' || item.type === typeValue
    const matchStatus = statusValue === 'all' || item.status === statusValue
    return matchSearch && matchType && matchStatus
  })
  renderTransactionTable(filtered)
}

function handleTransactionForm() {
  const form = document.getElementById('transaction-form')
  const typeSelect = document.getElementById('transaction-type')
  const methodSelect = document.getElementById('payment-method')

  if (methodSelect) {
    methodSelect.innerHTML = paymentMethods.map((method) => `<option value="${method}">${method}</option>`).join('')
  }
  updateCategoryOptions()
  if (typeSelect) typeSelect.addEventListener('change', updateCategoryOptions)

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      showToast('Transaksi dummy berhasil disimpan.', 'success')
      form.reset()
      updateCategoryOptions()
    })
    form.addEventListener('reset', () => {
      window.setTimeout(updateCategoryOptions, 0)
      showToast('Form transaksi dikosongkan.', 'warning')
    })
  }
}

function updateCategoryOptions() {
  const type = document.getElementById('transaction-type')?.value || 'income'
  const categorySelect = document.getElementById('transaction-category')
  const categories = type === 'income' ? incomeCategories : expenseCategories
  if (categorySelect) {
    categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join('')
  }
}

function renderCategories() {
  bindCategoryForm()
  renderCategoryGroup('income-category-list', incomeCategories, 'income', 'Pemasukan', 'bg-emerald-50 text-emerald-700')
  renderCategoryGroup('expense-category-list', expenseCategories, 'expense', 'Pengeluaran', 'bg-rose-50 text-rose-700')
  setText('income-category-count', `${incomeCategories.length} kategori`)
  setText('expense-category-count', `${expenseCategories.length} kategori`)
}

function bindCategoryForm() {
  const form = document.getElementById('category-form')
  if (!form || form.dataset.bound === 'true') return
  form.dataset.bound = 'true'
  form.addEventListener('submit', handleCategoryForm)
}

function handleCategoryForm(event) {
  event.preventDefault()
  const type = document.getElementById('new-category-type')?.value || 'income'
  const nameInput = document.getElementById('new-category-name')
  const categoryName = nameInput?.value.trim() || ''
  const categories = getCategoryList(type)

  if (!categoryName) {
    showToast('Nama kategori wajib diisi.', 'warning')
    return
  }
  if (categories.some((category) => category.toLowerCase() === categoryName.toLowerCase())) {
    showToast('Kategori dengan nama tersebut sudah ada.', 'warning')
    return
  }

  categories.push(categoryName)
  if (nameInput) nameInput.value = ''
  renderCategories()
  showToast('Kategori baru berhasil ditambahkan.', 'success')
}

function renderCategoryGroup(targetId, categories, categoryType, type, badgeClass) {
  const target = document.getElementById(targetId)
  if (!target) return
  target.innerHTML = categories.map((category) => `
    <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-slate-900">${escapeHtml(category)}</h3>
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}">${type}</span>
      </div>
      <p class="mt-3 text-sm text-slate-500">Kategori cashflow ${type.toLowerCase()}.</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" data-action="edit-category" data-category-type="${categoryType}" data-category="${escapeHtml(category)}" class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">Edit</button>
        <button type="button" data-action="delete-category" data-category-type="${categoryType}" data-category="${escapeHtml(category)}" class="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]">Hapus</button>
      </div>
    </article>
  `).join('')
}

function renderReport() {
  const startInput = document.getElementById('report-start-date')
  const endInput = document.getElementById('report-end-date')
  if (startInput && !startInput.value) startInput.value = '2026-05-28'
  if (endInput && !endInput.value) endInput.value = '2026-06-04'
  filterReportByDate()
  ;[startInput, endInput].forEach((input) => {
    if (input) input.addEventListener('input', filterReportByDate)
  })
}

function filterReportByDate() {
  const start = document.getElementById('report-start-date')?.value || '0000-01-01'
  const end = document.getElementById('report-end-date')?.value || '9999-12-31'
  const filtered = transactions.filter((item) => item.date >= start && item.date <= end)
  const income = sumTransactions(filtered, 'income')
  const expense = sumTransactions(filtered, 'expense')
  setText('report-income', formatRupiah(income))
  setText('report-expense', formatRupiah(expense))
  setText('report-balance', formatRupiah(income - expense))
  setText('report-total', String(filtered.length))
  renderCategorySummary(filtered)
  renderTableRows('report-table-body', filtered, { showActions: false })
}

function renderSettings() {
  setValue('business-name', businessProfile.businessName)
  setValue('business-owner', businessProfile.owner)
  setValue('currency', businessProfile.currency)
  setValue('date-format', businessProfile.dateFormat)
  const darkMode = document.getElementById('dark-mode')
  const notifications = document.getElementById('notifications')
  if (darkMode) {
    darkMode.checked = state.darkMode
    darkMode.addEventListener('change', () => {
      setTheme(darkMode.checked)
      showToast(darkMode.checked ? 'Mode gelap diaktifkan.' : 'Mode terang diaktifkan.', 'success')
    })
  }
  if (notifications) notifications.checked = businessProfile.notifications

  const form = document.getElementById('settings-form')
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      setTheme(document.getElementById('dark-mode')?.checked || false)
      showToast('Pengaturan dummy berhasil disimpan.', 'success')
    })
  }
}

function setTheme(isDark) {
  state.darkMode = isDark
  businessProfile.displayMode = isDark ? 'Gelap' : 'Terang'
  try {
    localStorage.setItem('cashflow-theme', isDark ? 'dark' : 'light')
  } catch (error) {
    // Storage can be unavailable in restricted browser contexts.
  }
  applyTheme(isDark)
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark)
}

function getStoredTheme() {
  try {
    return localStorage.getItem('cashflow-theme') || 'light'
  } catch (error) {
    return 'light'
  }
}

function renderCategorySummary(items) {
  const target = document.getElementById('category-summary')
  if (!target) return
  const summary = {}
  getCompletedTransactions(items).forEach((item) => {
    summary[item.category] = (summary[item.category] || 0) + item.amount
  })
  const rows = Object.entries(summary).sort((a, b) => b[1] - a[1])
  target.innerHTML = rows.length ? rows.map(([category, amount]) => `
    <div class="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span class="text-sm font-semibold text-slate-700">${category}</span>
      <span class="text-sm font-bold text-slate-950">${formatRupiah(amount)}</span>
    </div>
  `).join('') : '<p class="text-sm text-slate-500">Belum ada data pada periode ini.</p>'
}

function renderChartBars(targetId, items) {
  const target = document.getElementById(targetId)
  if (!target) return
  const maxAmount = Math.max(...items.map((item) => item.amount), 1)
  target.innerHTML = items.map((item) => {
    const height = Math.max(18, Math.round((item.amount / maxAmount) * 150))
    const tone = item.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
    return `
      <div class="flex flex-1 flex-col items-center justify-end gap-2">
        <div class="chart-bar w-full max-w-10 rounded-t-2xl ${tone}" style="height: ${height}px"></div>
        <span class="text-[11px] font-medium text-slate-400">${item.date.slice(5)}</span>
      </div>
    `
  }).join('')
}

function renderTableRows(targetId, items, options = {}) {
  const target = document.getElementById(targetId)
  if (!target) return
  const showActions = options.showActions !== false
  target.innerHTML = items.length
    ? items.map((item) => transactionRow(item, { showActions })).join('')
    : emptyRow('Belum ada transaksi.', showActions ? 7 : 6)
}

function transactionRow(item, options = {}) {
  const showActions = options.showActions !== false
  return `
    <tr class="border-t border-slate-100 hover:bg-slate-50/80">
      <td class="whitespace-nowrap px-4 py-4 text-sm text-slate-700">${formatDate(item.date)}</td>
      <td class="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800">${escapeHtml(item.category)}</td>
      <td class="min-w-56 px-4 py-4 text-sm text-slate-600">${escapeHtml(item.description)}</td>
      <td class="whitespace-nowrap px-4 py-4">${typeBadge(item.type)}</td>
      <td class="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-950">${formatRupiah(item.amount)}</td>
      <td class="whitespace-nowrap px-4 py-4">${statusBadge(item.status)}</td>
      ${showActions ? `<td class="whitespace-nowrap px-4 py-4 text-sm">
        <div class="flex gap-2">
          <button type="button" data-action="edit-transaction" data-transaction-id="${item.id}" class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">Edit</button>
          <button type="button" data-action="delete-transaction" data-transaction-id="${item.id}" class="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]">Hapus</button>
        </div>
      </td>` : ''}
    </tr>
  `
}

function openTransactionEditModal(transactionId) {
  const transaction = transactions.find((item) => item.id === transactionId)
  if (!transaction) return

  openModal(`
    <form id="edit-transaction-form" class="grid gap-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label for="edit-transaction-date" class="mb-2 block text-sm font-semibold text-slate-700">Tanggal</label>
          <input id="edit-transaction-date" type="date" value="${transaction.date}" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
        </div>
        <div>
          <label for="edit-transaction-type" class="mb-2 block text-sm font-semibold text-slate-700">Jenis transaksi</label>
          <select id="edit-transaction-type" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            <option value="income" ${transaction.type === 'income' ? 'selected' : ''}>Pemasukan</option>
            <option value="expense" ${transaction.type === 'expense' ? 'selected' : ''}>Pengeluaran</option>
          </select>
        </div>
        <div>
          <label for="edit-transaction-category" class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select id="edit-transaction-category" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"></select>
        </div>
        <div>
          <label for="edit-transaction-amount" class="mb-2 block text-sm font-semibold text-slate-700">Nominal</label>
          <input id="edit-transaction-amount" type="number" min="0" value="${transaction.amount}" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
        </div>
        <div>
          <label for="edit-transaction-method" class="mb-2 block text-sm font-semibold text-slate-700">Metode pembayaran</label>
          <select id="edit-transaction-method" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            ${paymentMethods.map((method) => `<option value="${escapeHtml(method)}" ${transaction.method === method ? 'selected' : ''}>${escapeHtml(method)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label for="edit-transaction-status" class="mb-2 block text-sm font-semibold text-slate-700">Status</label>
          <select id="edit-transaction-status" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            ${transactionStatusOptions.map((status) => `<option value="${status}" ${transaction.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
        <div class="md:col-span-2">
          <label for="edit-transaction-description" class="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
          <input id="edit-transaction-description" type="text" value="${escapeHtml(transaction.description)}" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
        </div>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" data-modal-close class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">Batal</button>
        <button type="submit" class="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]">Simpan Perubahan</button>
      </div>
    </form>
  `, 'Edit Transaksi', 'Perubahan tersimpan sementara di data dummy browser.')

  updateEditTransactionCategoryOptions(transaction.type, transaction.category)
  const typeSelect = document.getElementById('edit-transaction-type')
  const form = document.getElementById('edit-transaction-form')
  if (typeSelect) {
    typeSelect.addEventListener('change', () => updateEditTransactionCategoryOptions(typeSelect.value))
  }
  if (form) {
    form.addEventListener('submit', (event) => saveTransactionEdit(event, transactionId))
  }
}

function updateEditTransactionCategoryOptions(type, selectedCategory = '') {
  const categorySelect = document.getElementById('edit-transaction-category')
  const categories = type === 'income' ? incomeCategories : expenseCategories
  if (!categorySelect) return
  categorySelect.innerHTML = categories.map((category) => `
    <option value="${escapeHtml(category)}" ${category === selectedCategory ? 'selected' : ''}>${escapeHtml(category)}</option>
  `).join('')
}

function saveTransactionEdit(event, transactionId) {
  event.preventDefault()
  const transaction = transactions.find((item) => item.id === transactionId)
  if (!transaction) return

  transaction.date = document.getElementById('edit-transaction-date').value
  transaction.type = document.getElementById('edit-transaction-type').value
  transaction.category = document.getElementById('edit-transaction-category').value
  transaction.amount = Number(document.getElementById('edit-transaction-amount').value)
  transaction.method = document.getElementById('edit-transaction-method').value
  transaction.status = document.getElementById('edit-transaction-status').value
  transaction.description = document.getElementById('edit-transaction-description').value.trim()

  closeModal()
  refreshActivePageData()
  showToast('Transaksi berhasil diperbarui.', 'success')
}

function confirmDeleteTransaction(transactionId) {
  const transaction = transactions.find((item) => item.id === transactionId)
  if (!transaction) return
  openConfirmModal({
    title: 'Hapus Transaksi',
    message: `Transaksi "${transaction.description}" akan dihapus dari data dummy sesi ini.`,
    confirmLabel: 'Hapus Transaksi',
    onConfirm: () => deleteTransaction(transactionId)
  })
}

function deleteTransaction(transactionId) {
  const index = transactions.findIndex((item) => item.id === transactionId)
  if (index === -1) return
  transactions.splice(index, 1)
  closeModal()
  refreshActivePageData()
  showToast('Transaksi berhasil dihapus.', 'danger')
}

function openCategoryEditModal(categoryType, category) {
  if (category === 'Lainnya') {
    showToast('Kategori Lainnya digunakan sebagai fallback dan tidak bisa diedit.', 'warning')
    return
  }

  const title = categoryType === 'income' ? 'Edit Kategori Pemasukan' : 'Edit Kategori Pengeluaran'
  openModal(`
    <form id="edit-category-form" class="grid gap-4">
      <div>
        <label for="edit-category-name" class="mb-2 block text-sm font-semibold text-slate-700">Nama kategori</label>
        <input id="edit-category-name" type="text" value="${escapeHtml(category)}" required class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
      </div>
      <div class="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        Transaksi dengan kategori ini akan ikut diperbarui agar laporan tetap konsisten.
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" data-modal-close class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">Batal</button>
        <button type="submit" class="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]">Simpan Perubahan</button>
      </div>
    </form>
  `, title, 'Perubahan kategori tersimpan sementara di data dummy browser.')

  const form = document.getElementById('edit-category-form')
  if (form) {
    form.addEventListener('submit', (event) => saveCategoryEdit(event, categoryType, category))
  }
}

function saveCategoryEdit(event, categoryType, originalCategory) {
  event.preventDefault()
  const categoryName = document.getElementById('edit-category-name').value.trim()
  const categories = getCategoryList(categoryType)
  if (!categoryName) {
    showToast('Nama kategori wajib diisi.', 'warning')
    return
  }
  if (categories.some((category) => category.toLowerCase() === categoryName.toLowerCase() && category !== originalCategory)) {
    showToast('Kategori dengan nama tersebut sudah ada.', 'warning')
    return
  }

  const index = categories.indexOf(originalCategory)
  if (index === -1) return
  categories[index] = categoryName
  transactions.forEach((transaction) => {
    if (transaction.type === categoryType && transaction.category === originalCategory) {
      transaction.category = categoryName
    }
  })

  closeModal()
  renderCategories()
  showToast('Kategori berhasil diperbarui.', 'success')
}

function confirmDeleteCategory(categoryType, category) {
  if (category === 'Lainnya') {
    showToast('Kategori Lainnya digunakan sebagai fallback dan tidak bisa dihapus.', 'warning')
    return
  }
  openConfirmModal({
    title: 'Hapus Kategori',
    message: `Kategori "${category}" akan dihapus. Transaksi terkait akan dipindahkan ke kategori Lainnya.`,
    confirmLabel: 'Hapus Kategori',
    onConfirm: () => deleteCategory(categoryType, category)
  })
}

function deleteCategory(categoryType, category) {
  const categories = getCategoryList(categoryType)
  const index = categories.indexOf(category)
  if (index === -1) return
  categories.splice(index, 1)
  transactions.forEach((transaction) => {
    if (transaction.type === categoryType && transaction.category === category) {
      transaction.category = 'Lainnya'
    }
  })

  closeModal()
  renderCategories()
  showToast('Kategori berhasil dihapus.', 'danger')
}

function getCategoryList(categoryType) {
  return categoryType === 'income' ? incomeCategories : expenseCategories
}

function refreshActivePageData() {
  if (state.activePage === 'transaksi') filterTransactions()
  if (state.activePage === 'dashboard') renderDashboard()
  if (state.activePage === 'laporan') filterReportByDate()
}

function openConfirmModal({ title, message, confirmLabel, onConfirm }) {
  openModal(`
    <div class="grid gap-5">
      <p class="text-sm leading-6 text-slate-600">${escapeHtml(message)}</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" data-modal-close class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">Batal</button>
        <button type="button" id="confirm-modal-action" class="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]">${confirmLabel}</button>
      </div>
    </div>
  `, title, 'Aksi ini hanya mengubah data dummy pada sesi browser.')

  const confirmButton = document.getElementById('confirm-modal-action')
  if (confirmButton) confirmButton.addEventListener('click', onConfirm)
}

function openModal(content, title, description) {
  const root = getModalRoot()
  root.innerHTML = `
    <div data-modal-overlay class="fixed inset-0 z-[70] flex min-h-screen items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center">
      <section class="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-soft md:p-6" role="dialog" aria-modal="true">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-950">${escapeHtml(title)}</h2>
            <p class="mt-1 text-sm text-slate-500">${escapeHtml(description)}</p>
          </div>
          <button type="button" data-modal-close class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 active:scale-[0.98]" aria-label="Tutup modal">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        ${content}
      </section>
    </div>
  `
}

function closeModal() {
  const root = document.getElementById('modal-root')
  if (root) root.innerHTML = ''
}

function getModalRoot() {
  let root = document.getElementById('modal-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'modal-root'
    document.body.appendChild(root)
  }
  return root
}

function typeBadge(type) {
  return type === 'income'
    ? '<span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Pemasukan</span>'
    : '<span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Pengeluaran</span>'
}

function statusBadge(status) {
  const className = {
    Selesai: 'bg-blue-50 text-blue-700',
    Pending: 'bg-amber-50 text-amber-700',
    Dibatalkan: 'bg-rose-50 text-rose-700'
  }[status] || 'bg-slate-50 text-slate-700'
  return `<span class="rounded-full px-3 py-1 text-xs font-semibold ${className}">${status}</span>`
}

function emptyRow(message, colspan) {
  return `<tr><td colspan="${colspan}" class="px-4 py-10 text-center text-sm text-slate-500">${message}</td></tr>`
}

function formatDate(value) {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function setText(id, value) {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}

function setValue(id, value) {
  const element = document.getElementById(id)
  if (element) element.value = value
}
