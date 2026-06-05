const state = {
  activePage: 'dashboard',
  componentsLoaded: false,
  darkMode: getStoredTheme() === 'dark',
  apiFallbackNotified: false
}

const API_BASE_URL = getApiBaseUrl()
const transactionStatusOptions = ['Selesai', 'Pending', 'Dibatalkan']
let categoryRecords = buildFallbackCategoryRecords()
let paymentMethodRecords = buildFallbackPaymentMethodRecords()

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
  await loadReferenceData()
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

async function apiRequest(path, options = {}) {
  const url = new URL(path, API_BASE_URL)
  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeout || 5000)
  const fetchOptions = {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    signal: controller.signal
  }
  if (options.body) fetchOptions.body = JSON.stringify(options.body)

  try {
    const response = await fetch(url.toString(), fetchOptions)
    const json = await response.json().catch(() => null)
    if (!response.ok || json?.success === false) {
      const error = new Error(json?.message || `API error ${response.status}`)
      error.isApiResponse = true
      throw error
    }
    return unwrapApiData(json)
  } finally {
    window.clearTimeout(timeout)
  }
}

function unwrapApiData(response) {
  if (response && typeof response === 'object' && 'data' in response) return response.data
  return response
}

function getApiArray(data, keys = []) {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.rows)) return data.rows
  return []
}

async function loadReferenceData() {
  await Promise.allSettled([
    loadCategoriesFromApi(),
    loadPaymentMethodsFromApi(),
    loadSettingsFromApi({ applyThemeFromApi: true })
  ])
}

async function loadCategoriesFromApi() {
  const data = await apiRequest('/api/categories', { query: { type: 'all' } })
  const records = getApiArray(data, ['categories']).map(normalizeCategory).filter(Boolean)
  if (!records.length) return

  categoryRecords = records
  syncCategoryArrays()
}

async function loadPaymentMethodsFromApi() {
  const data = await apiRequest('/api/payment-methods')
  const records = getApiArray(data, ['payment_methods', 'paymentMethods']).map(normalizePaymentMethod).filter(Boolean)
  if (!records.length) return

  paymentMethodRecords = records
  replaceArrayContents(paymentMethods, records.map((method) => method.name))
}

async function loadSettingsFromApi(options = {}) {
  const data = await apiRequest('/api/settings')
  const settings = normalizeSettings(data)
  Object.assign(businessProfile, settings)
  if (options.applyThemeFromApi && settings.displayMode) {
    setTheme(settings.displayMode === 'dark' || settings.displayMode === 'Gelap', { persistApi: false })
  }
  return settings
}

function notifyApiFallback(error) {
  if (!state.apiFallbackNotified) {
    state.apiFallbackNotified = true
    showToast('API belum tersedia. Aplikasi memakai data dummy sementara.', 'warning')
  }
  console.warn('Cashflow API fallback:', error)
}

function normalizeCategory(item) {
  if (!item) return null
  return {
    id: Number(item.id),
    name: item.name || item.category || item.label,
    type: item.type,
    isDefault: Boolean(item.is_default ?? item.isDefault)
  }
}

function normalizePaymentMethod(item) {
  if (!item) return null
  return {
    id: Number(item.id),
    name: item.name || item.method || item.label
  }
}

function normalizeTransaction(item) {
  if (!item) return null
  const categoryId = Number(item.category_id ?? item.categoryId ?? item.category?.id)
  const paymentMethodId = Number(item.payment_method_id ?? item.paymentMethodId ?? item.payment_method?.id)
  return {
    id: Number(item.id),
    date: item.date || item.transaction_date || item.transactionDate,
    type: item.type,
    category: item.category || item.category_name || item.category?.name || getCategoryNameById(categoryId),
    categoryId,
    description: item.description || '',
    amount: Number(item.amount || 0),
    method: item.method || item.payment_method || item.payment_method_name || item.paymentMethod || item.payment_method?.name || getPaymentMethodNameById(paymentMethodId),
    paymentMethodId,
    status: item.status || 'Selesai',
    note: item.note || item.notes || ''
  }
}

function normalizeSettings(item) {
  const settings = item || {}
  return {
    businessName: settings.business_name ?? settings.businessName ?? businessProfile.businessName,
    owner: settings.owner_name ?? settings.owner ?? settings.ownerName ?? businessProfile.owner,
    currency: settings.currency ?? businessProfile.currency,
    dateFormat: settings.date_format ?? settings.dateFormat ?? businessProfile.dateFormat,
    displayMode: settings.display_mode ?? settings.displayMode ?? businessProfile.displayMode,
    notifications: Boolean(settings.notifications_enabled ?? settings.notifications ?? businessProfile.notifications)
  }
}

function normalizeDashboardSummary(item, fallback) {
  const summary = item || {}
  const income = Number(summary.total_income ?? summary.totalIncome ?? summary.income ?? fallback.income)
  const expense = Number(summary.total_expense ?? summary.totalExpense ?? summary.expense ?? fallback.expense)
  return {
    income,
    expense,
    balance: Number(summary.net_balance ?? summary.netBalance ?? summary.balance ?? income - expense),
    total: Number(summary.total_transactions ?? summary.totalTransactions ?? summary.total ?? fallback.total)
  }
}

function syncCategoryArrays() {
  replaceArrayContents(incomeCategories, categoryRecords.filter((category) => category.type === 'income').map((category) => category.name))
  replaceArrayContents(expenseCategories, categoryRecords.filter((category) => category.type === 'expense').map((category) => category.name))
}

function replaceArrayContents(target, values) {
  target.splice(0, target.length, ...values)
}

function buildFallbackCategoryRecords() {
  return [
    ...incomeCategories.map((name, index) => ({ id: index + 1, name, type: 'income', isDefault: true })),
    ...expenseCategories.map((name, index) => ({ id: incomeCategories.length + index + 1, name, type: 'expense', isDefault: true }))
  ]
}

function buildFallbackPaymentMethodRecords() {
  return paymentMethods.map((name, index) => ({ id: index + 1, name }))
}

function getCategoryRecord(type, name) {
  return categoryRecords.find((category) => category.type === type && category.name === name)
}

function getCategoryNameById(id) {
  return categoryRecords.find((category) => category.id === id)?.name || ''
}

function getPaymentMethodNameById(id) {
  return paymentMethodRecords.find((method) => method.id === id)?.name || ''
}

function getPaymentMethodRecord(name) {
  return paymentMethodRecords.find((method) => method.name === name)
}

function getTransactionPayloadFromForm(prefix = '') {
  const type = document.getElementById(`${prefix}transaction-type`)?.value || 'income'
  const categoryName = document.getElementById(`${prefix}transaction-category`)?.value || ''
  const methodName = document.getElementById(`${prefix}payment-method`)?.value || document.getElementById(`${prefix}transaction-method`)?.value || ''
  return {
    transaction_date: document.getElementById(`${prefix}transaction-date`)?.value,
    type,
    category_id: getCategoryRecord(type, categoryName)?.id,
    description: document.getElementById(`${prefix}transaction-description`)?.value.trim(),
    amount: Number(document.getElementById(`${prefix}transaction-amount`)?.value || 0),
    payment_method_id: getPaymentMethodRecord(methodName)?.id,
    status: document.getElementById(`${prefix}transaction-status`)?.value || 'Selesai',
    note: document.getElementById(`${prefix}transaction-note`)?.value || ''
  }
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

async function renderDashboard() {
  const todayItems = getTodayTransactions()
  const fallbackSummary = {
    income: sumTransactions(todayItems, 'income'),
    expense: sumTransactions(todayItems, 'expense'),
    balance: sumTransactions(todayItems, 'income') - sumTransactions(todayItems, 'expense'),
    total: todayItems.length
  }
  let summary = fallbackSummary
  let recentItems = transactions.slice(0, 5)
  let chartItems = transactions.slice(0, 7)

  try {
    const [summaryData, recentData, chartData] = await Promise.all([
      apiRequest('/api/dashboard/summary', { query: { date: '2026-06-04' } }),
      apiRequest('/api/dashboard/recent', { query: { limit: 5 } }),
      apiRequest('/api/dashboard/chart', { query: { date: '2026-06-04' } })
    ])
    summary = normalizeDashboardSummary(summaryData, fallbackSummary)
    recentItems = getApiArray(recentData, ['transactions', 'recent']).map(normalizeTransaction).filter(Boolean)
    chartItems = getApiArray(chartData, ['chart', 'cashflow'])
  } catch (error) {
    notifyApiFallback(error)
  }

  const cards = [
    { label: 'Pemasukan hari ini', value: formatRupiah(summary.income), tone: 'text-emerald-600' },
    { label: 'Pengeluaran hari ini', value: formatRupiah(summary.expense), tone: 'text-rose-600' },
    { label: 'Saldo bersih', value: formatRupiah(summary.balance), tone: 'text-blue-600' },
    { label: 'Total transaksi', value: String(summary.total), tone: 'text-slate-950' }
  ]

  setText('dashboard-business', businessProfile.businessName)
  setText('dashboard-income', formatRupiah(summary.income))
  setText('dashboard-expense', formatRupiah(summary.expense))
  setText('dashboard-balance', formatRupiah(summary.balance))

  const cardTarget = document.getElementById('summary-cards')
  if (cardTarget) {
    cardTarget.innerHTML = cards.map((card) => `
      <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">${card.label}</p>
        <p class="mt-3 text-2xl font-bold ${card.tone}">${card.value}</p>
      </article>
    `).join('')
  }

  renderChartBars('dashboard-chart', chartItems)
  renderTableRows('recent-transactions', recentItems, { showActions: false })
}

async function renderTransactions() {
  try {
    const items = await loadTransactionsFromApi({ type: 'all', status: 'all', limit: 100, offset: 0 })
    renderTransactionTable(items)
  } catch (error) {
    notifyApiFallback(error)
    renderTransactionTable(transactions)
  }

  const search = document.getElementById('transaction-search')
  const type = document.getElementById('transaction-type-filter')
  const status = document.getElementById('transaction-status-filter')
  ;[search, type, status].forEach((control) => {
    if (control) {
      control.addEventListener('input', filterTransactions)
      control.addEventListener('change', filterTransactions)
    }
  })
}

function renderTransactionTable(items) {
  const target = document.getElementById('transaction-table-body')
  if (!target) return
  target.innerHTML = items.length ? items.map((item) => transactionRow(item)).join('') : emptyRow('Tidak ada transaksi yang cocok.', 7)
}

async function filterTransactions() {
  const searchValue = (document.getElementById('transaction-search')?.value || '').toLowerCase()
  const typeValue = document.getElementById('transaction-type-filter')?.value || 'all'
  const statusValue = document.getElementById('transaction-status-filter')?.value || 'all'

  try {
    const items = await loadTransactionsFromApi({
      keyword: searchValue,
      type: typeValue,
      status: statusValue,
      limit: 100,
      offset: 0
    })
    renderTransactionTable(items)
  } catch (error) {
    notifyApiFallback(error)
    const filtered = transactions.filter((item) => {
      const matchSearch = [item.description, item.category, item.method].join(' ').toLowerCase().includes(searchValue)
      const matchType = typeValue === 'all' || item.type === typeValue
      const matchStatus = statusValue === 'all' || item.status === statusValue
      return matchSearch && matchType && matchStatus
    })
    renderTransactionTable(filtered)
  }
}

async function loadTransactionsFromApi(query = {}) {
  const data = await apiRequest('/api/transactions', { query })
  const items = getApiArray(data, ['transactions']).map(normalizeTransaction).filter(Boolean)
  mergeTransactions(items)
  return items
}

function mergeTransactions(items) {
  items.forEach((item) => {
    const index = transactions.findIndex((transaction) => transaction.id === item.id)
    if (index >= 0) {
      Object.assign(transactions[index], item)
    } else {
      transactions.push(item)
    }
  })
}

function addFallbackTransaction(payload) {
  const nextId = Math.max(0, ...transactions.map((transaction) => Number(transaction.id) || 0)) + 1
  transactions.unshift(buildTransactionFromPayload(payload, nextId))
}

function buildTransactionFromPayload(payload, id) {
  const nextId = id || Math.max(0, ...transactions.map((transaction) => Number(transaction.id) || 0)) + 1
  return {
    id: nextId,
    date: payload.transaction_date,
    type: payload.type,
    category: getCategoryNameById(payload.category_id),
    categoryId: payload.category_id,
    description: payload.description,
    amount: Number(payload.amount),
    method: getPaymentMethodNameById(payload.payment_method_id),
    paymentMethodId: payload.payment_method_id,
    status: payload.status || 'Selesai',
    note: payload.note || ''
  }
}

function applyFallbackTransactionUpdate(transactionId, payload) {
  const transaction = transactions.find((item) => item.id === transactionId)
  if (!transaction) return
  Object.assign(transaction, {
    date: payload.transaction_date,
    type: payload.type,
    category: getCategoryNameById(payload.category_id),
    categoryId: payload.category_id,
    description: payload.description,
    amount: Number(payload.amount),
    method: getPaymentMethodNameById(payload.payment_method_id),
    paymentMethodId: payload.payment_method_id,
    status: payload.status || 'Selesai',
    note: payload.note || transaction.note || ''
  })
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
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const payload = getTransactionPayloadFromForm()
      try {
        const data = await apiRequest('/api/transactions', {
          method: 'POST',
          body: payload
        })
        const createdTransaction = normalizeTransaction(data)
        const transactionId = Number(data?.id ?? data?.transaction_id ?? data?.transactionId)
        mergeTransactions([
          createdTransaction?.date ? createdTransaction : buildTransactionFromPayload(payload, transactionId)
        ])
        showToast('Transaksi berhasil disimpan ke API.', 'success')
        form.reset()
        updateCategoryOptions()
      } catch (error) {
        if (error.isApiResponse) {
          showToast(error.message, 'danger')
          return
        }
        notifyApiFallback(error)
        addFallbackTransaction(payload)
        showToast('Transaksi disimpan sementara ke data dummy.', 'warning')
        form.reset()
        updateCategoryOptions()
      }
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

async function renderCategories() {
  bindCategoryForm()
  try {
    await loadCategoriesFromApi()
  } catch (error) {
    notifyApiFallback(error)
  }
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

async function handleCategoryForm(event) {
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

  try {
    await apiRequest('/api/categories', {
      method: 'POST',
      body: { name: categoryName, type }
    })
    await loadCategoriesFromApi()
    showToast('Kategori berhasil ditambahkan ke API.', 'success')
  } catch (error) {
    if (error.isApiResponse) {
      showToast(error.message, 'danger')
      return
    }
    notifyApiFallback(error)
    categories.push(categoryName)
    categoryRecords.push({
      id: Math.max(0, ...categoryRecords.map((category) => category.id || 0)) + 1,
      name: categoryName,
      type,
      isDefault: false
    })
    showToast('Kategori ditambahkan sementara ke data dummy.', 'warning')
  }

  if (nameInput) nameInput.value = ''
  await renderCategories()
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

async function filterReportByDate() {
  const start = document.getElementById('report-start-date')?.value || '0000-01-01'
  const end = document.getElementById('report-end-date')?.value || '9999-12-31'

  try {
    const [summaryData, categoryData, transactionData] = await Promise.all([
      apiRequest('/api/reports/summary', { query: { start_date: start, end_date: end } }),
      apiRequest('/api/reports/categories', { query: { start_date: start, end_date: end } }),
      apiRequest('/api/reports/transactions', { query: { start_date: start, end_date: end } })
    ])
    const transactionsFromApi = getApiArray(transactionData, ['transactions']).map(normalizeTransaction).filter(Boolean)
    const summary = normalizeDashboardSummary(summaryData, {
      income: 0,
      expense: 0,
      balance: 0,
      total: transactionsFromApi.length
    })
    setText('report-income', formatRupiah(summary.income))
    setText('report-expense', formatRupiah(summary.expense))
    setText('report-balance', formatRupiah(summary.balance))
    setText('report-total', String(summary.total))
    renderCategorySummaryRows(getApiArray(categoryData, ['categories', 'summary']))
    renderTableRows('report-table-body', transactionsFromApi, { showActions: false })
  } catch (error) {
    notifyApiFallback(error)
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
}

async function renderSettings() {
  try {
    await loadSettingsFromApi({ applyThemeFromApi: true })
  } catch (error) {
    notifyApiFallback(error)
  }

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
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const payload = {
        business_name: document.getElementById('business-name')?.value.trim(),
        owner_name: document.getElementById('business-owner')?.value.trim(),
        currency: document.getElementById('currency')?.value,
        date_format: document.getElementById('date-format')?.value,
        display_mode: document.getElementById('dark-mode')?.checked ? 'dark' : 'light',
        notifications_enabled: Boolean(document.getElementById('notifications')?.checked)
      }

      try {
        const data = await apiRequest('/api/settings', {
          method: 'PUT',
          body: payload
        })
        Object.assign(businessProfile, normalizeSettings(data || payload))
        showToast('Pengaturan berhasil disimpan ke API.', 'success')
      } catch (error) {
        if (error.isApiResponse) {
          showToast(error.message, 'danger')
          return
        }
        notifyApiFallback(error)
        Object.assign(businessProfile, normalizeSettings(payload))
        showToast('Pengaturan disimpan sementara di browser.', 'warning')
      }

      setTheme(payload.display_mode === 'dark')
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

function getApiBaseUrl() {
  try {
    return localStorage.getItem('cashflow-api-base-url') || 'http://localhost:3000'
  } catch (error) {
    return 'http://localhost:3000'
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

function renderCategorySummaryRows(rows) {
  const target = document.getElementById('category-summary')
  if (!target) return
  target.innerHTML = rows.length ? rows.map((row) => {
    const category = row.category || row.category_name || row.name || '-'
    const amount = Number(row.total_amount ?? row.amount ?? row.total ?? 0)
    return `
      <div class="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
        <span class="text-sm font-semibold text-slate-700">${escapeHtml(category)}</span>
        <span class="text-sm font-bold text-slate-950">${formatRupiah(amount)}</span>
      </div>
    `
  }).join('') : '<p class="text-sm text-slate-500">Belum ada data pada periode ini.</p>'
}

function renderChartBars(targetId, items) {
  const target = document.getElementById(targetId)
  if (!target) return
  const normalizedItems = items.map((item) => ({
    date: item.date || item.transaction_date || item.transactionDate || '',
    type: item.type,
    amount: Number(item.amount ?? item.income_total ?? item.total_income ?? item.income ?? item.expense_total ?? item.total_expense ?? item.expense ?? 0),
    expense: Number(item.expense_total ?? item.total_expense ?? item.expense ?? 0),
    income: Number(item.income_total ?? item.total_income ?? item.income ?? 0)
  }))
  const maxAmount = Math.max(...normalizedItems.map((item) => item.amount), 1)
  target.innerHTML = normalizedItems.map((item) => {
    const height = Math.max(18, Math.round((item.amount / maxAmount) * 150))
    const tone = item.type === 'expense' || item.expense > item.income ? 'bg-rose-500' : 'bg-emerald-500'
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

async function saveTransactionEdit(event, transactionId) {
  event.preventDefault()
  const transaction = transactions.find((item) => item.id === transactionId)
  if (!transaction) return

  const payload = getTransactionPayloadFromForm('edit-')

  try {
    const data = await apiRequest(`/api/transactions/${transactionId}`, {
      method: 'PUT',
      body: payload
    })
    const updatedTransaction = normalizeTransaction(data)
    if (updatedTransaction?.date) {
      mergeTransactions([updatedTransaction])
    } else {
      applyFallbackTransactionUpdate(transactionId, payload)
    }
    showToast('Transaksi berhasil diperbarui di API.', 'success')
  } catch (error) {
    if (error.isApiResponse) {
      showToast(error.message, 'danger')
      return
    }
    notifyApiFallback(error)
    applyFallbackTransactionUpdate(transactionId, payload)
    showToast('Transaksi diperbarui sementara di data dummy.', 'warning')
  }

  closeModal()
  await refreshActivePageData()
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

async function deleteTransaction(transactionId) {
  const index = transactions.findIndex((item) => item.id === transactionId)
  if (index === -1) return

  try {
    await apiRequest(`/api/transactions/${transactionId}`, { method: 'DELETE' })
    showToast('Transaksi berhasil dihapus dari API.', 'success')
  } catch (error) {
    if (error.isApiResponse) {
      showToast(error.message, 'danger')
      return
    }
    notifyApiFallback(error)
    showToast('Transaksi dihapus sementara dari data dummy.', 'warning')
  }

  transactions.splice(index, 1)
  closeModal()
  await refreshActivePageData()
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

async function saveCategoryEdit(event, categoryType, originalCategory) {
  event.preventDefault()
  const categoryName = document.getElementById('edit-category-name').value.trim()
  const categories = getCategoryList(categoryType)
  const categoryRecord = getCategoryRecord(categoryType, originalCategory)
  if (!categoryName) {
    showToast('Nama kategori wajib diisi.', 'warning')
    return
  }
  if (categories.some((category) => category.toLowerCase() === categoryName.toLowerCase() && category !== originalCategory)) {
    showToast('Kategori dengan nama tersebut sudah ada.', 'warning')
    return
  }

  try {
    if (!categoryRecord?.id) throw new Error('Kategori tidak ditemukan di API.')
    await apiRequest(`/api/categories/${categoryRecord.id}`, {
      method: 'PUT',
      body: { name: categoryName }
    })
    await loadCategoriesFromApi()
    showToast('Kategori berhasil diperbarui di API.', 'success')
  } catch (error) {
    if (error.isApiResponse) {
      showToast(error.message, 'danger')
      return
    }
    notifyApiFallback(error)
    const index = categories.indexOf(originalCategory)
    if (index === -1) return
    categories[index] = categoryName
    const recordIndex = categoryRecords.findIndex((category) => category.type === categoryType && category.name === originalCategory)
    if (recordIndex >= 0) categoryRecords[recordIndex].name = categoryName
    transactions.forEach((transaction) => {
      if (transaction.type === categoryType && transaction.category === originalCategory) {
        transaction.category = categoryName
      }
    })
    showToast('Kategori diperbarui sementara di data dummy.', 'warning')
  }

  closeModal()
  await renderCategories()
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

async function deleteCategory(categoryType, category) {
  const categories = getCategoryList(categoryType)
  const index = categories.indexOf(category)
  if (index === -1) return
  const categoryRecord = getCategoryRecord(categoryType, category)

  try {
    if (!categoryRecord?.id) throw new Error('Kategori tidak ditemukan di API.')
    await apiRequest(`/api/categories/${categoryRecord.id}`, { method: 'DELETE' })
    await loadCategoriesFromApi()
    showToast('Kategori berhasil dihapus dari API.', 'success')
  } catch (error) {
    if (error.isApiResponse) {
      showToast(error.message, 'danger')
      return
    }
    notifyApiFallback(error)
    categories.splice(index, 1)
    categoryRecords = categoryRecords.filter((item) => !(item.type === categoryType && item.name === category))
    transactions.forEach((transaction) => {
      if (transaction.type === categoryType && transaction.category === category) {
        transaction.category = 'Lainnya'
      }
    })
    showToast('Kategori dihapus sementara dari data dummy.', 'warning')
  }

  closeModal()
  await renderCategories()
}

function getCategoryList(categoryType) {
  return categoryType === 'income' ? incomeCategories : expenseCategories
}

async function refreshActivePageData() {
  if (state.activePage === 'transaksi') await filterTransactions()
  if (state.activePage === 'dashboard') await renderDashboard()
  if (state.activePage === 'laporan') await filterReportByDate()
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
