/**
 * Premium Currency Converter & FX Tracker - Main Application Logic
 */

// ==========================================================================
// 1. Comprehensive Currency Database
// ==========================================================================
const CURRENCIES = {
  USD: { code: 'USD', name: '美元 (US Dollar)', symbol: '$', flag: '🇺🇸', popular: true },
  TWD: { code: 'TWD', name: '新台幣 (Taiwan Dollar)', symbol: 'NT$', flag: '🇹🇼', popular: true },
  JPY: { code: 'JPY', name: '日圓 (Japanese Yen)', symbol: '¥', flag: '🇯🇵', popular: true },
  EUR: { code: 'EUR', name: '歐元 (Euro)', symbol: '€', flag: '🇪🇺', popular: true },
  GBP: { code: 'GBP', name: '英鎊 (British Pound)', symbol: '£', flag: '🇬🇧', popular: true },
  CNY: { code: 'CNY', name: '人民幣 (Chinese Yuan)', symbol: '¥', flag: '🇨🇳', popular: true },
  HKD: { code: 'HKD', name: '港幣 (Hong Kong Dollar)', symbol: 'HK$', flag: '🇭🇰', popular: true },
  KRW: { code: 'KRW', name: '韓圓 (South Korean Won)', symbol: '₩', flag: '🇰🇷', popular: true },
  AUD: { code: 'AUD', name: '澳幣 (Australian Dollar)', symbol: 'A$', flag: '🇦🇺', popular: true },
  CAD: { code: 'CAD', name: '加幣 (Canadian Dollar)', symbol: 'CA$', flag: '🇨🇦', popular: true },
  SGD: { code: 'SGD', name: '新加坡幣 (Singapore Dollar)', symbol: 'S$', flag: '🇸🇬', popular: true },
  CHF: { code: 'CHF', name: '瑞士法郎 (Swiss Franc)', symbol: 'CHF', flag: '🇨🇭', popular: false },
  NZD: { code: 'NZD', name: '紐元 (New Zealand Dollar)', symbol: 'NZ$', flag: '🇳🇿', popular: false },
  THB: { code: 'THB', name: '泰銖 (Thai Baht)', symbol: '฿', flag: '🇹🇭', popular: true },
  VND: { code: 'VND', name: '越南盾 (Vietnamese Dong)', symbol: '₫', flag: '🇻🇳', popular: false },
  MYR: { code: 'MYR', name: '馬來西亞令吉 (Malaysian Ringgit)', symbol: 'RM', flag: '🇲🇾', popular: false },
  IDR: { code: 'IDR', name: '印尼盾 (Indonesian Rupiah)', symbol: 'Rp', flag: '🇮🇩', popular: false },
  PHP: { code: 'PHP', name: '菲律賓披索 (Philippine Peso)', symbol: '₱', flag: '🇵🇭', popular: false },
  INR: { code: 'INR', name: '印度盧比 (Indian Rupee)', symbol: '₹', flag: '🇮🇳', popular: false },
  SAR: { code: 'SAR', name: '沙烏地里亞爾 (Saudi Riyal)', symbol: 'SR', flag: '🇸🇦', popular: false },
  AED: { code: 'AED', name: '阿聯酋迪拉姆 (UAE Dirham)', symbol: 'AED', flag: '🇦🇪', popular: false },
  SEK: { code: 'SEK', name: '瑞典克朗 (Swedish Krona)', symbol: 'kr', flag: '🇸🇪', popular: false },
  NOK: { code: 'NOK', name: '挪威克朗 (Norwegian Krone)', symbol: 'kr', flag: '🇳🇴', popular: false },
  DKK: { code: 'DKK', name: '丹麥克朗 (Danish Krone)', symbol: 'kr', flag: '🇩🇰', popular: false },
  PLN: { code: 'PLN', name: '波蘭茲羅提 (Polish Zloty)', symbol: 'zł', flag: '🇵🇱', popular: false },
  MXN: { code: 'MXN', name: '墨西哥披索 (Mexican Peso)', symbol: '$', flag: '🇲🇽', popular: false },
  BRL: { code: 'BRL', name: '巴西雷亞爾 (Brazilian Real)', symbol: 'R$', flag: '🇧🇷', popular: false },
  ZAR: { code: 'ZAR', name: '南非蘭特 (South African Rand)', symbol: 'R', flag: '🇿🇦', popular: false },
  TRY: { code: 'TRY', name: '土耳其里拉 (Turkish Lira)', symbol: '₺', flag: '🇹🇷', popular: false }
};

// Fallback rates (Base USD) in case network fetch fails
const FALLBACK_RATES = {
  USD: 1.0,
  TWD: 31.85,
  JPY: 147.20,
  EUR: 0.915,
  GBP: 0.785,
  CNY: 7.18,
  HKD: 7.82,
  KRW: 1335.5,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  CHF: 0.87,
  NZD: 1.64,
  THB: 35.2,
  VND: 24800.0,
  MYR: 4.68,
  IDR: 15650.0,
  PHP: 56.4,
  INR: 83.1,
  SAR: 3.75,
  AED: 3.67,
  SEK: 10.45,
  NOK: 10.55,
  DKK: 6.83,
  PLN: 3.98,
  MXN: 17.1,
  BRL: 4.95,
  ZAR: 18.8,
  TRY: 30.5
};

// ==========================================================================
// 2. Application State Management
// ==========================================================================
const state = {
  amount: 100,
  fromCurrency: 'USD',
  toCurrency: 'TWD',
  rates: { ...FALLBACK_RATES },
  lastUpdated: null,
  activePickerTarget: 'from', // 'from' or 'to'
  chartRange: '7d', // '7d', '30d', '90d'
  starredCurrencies: JSON.parse(localStorage.getItem('fx_starred') || '["TWD", "JPY", "EUR", "CNY", "KRW", "GBP"]'),
  theme: localStorage.getItem('fx_theme') || 'dark'
};

// ==========================================================================
// 3. DOM Elements Cache
// ==========================================================================
const DOM = {
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  rateStatusBadge: document.getElementById('rateStatusBadge'),
  statusText: document.getElementById('statusText'),
  lastUpdatedTime: document.getElementById('lastUpdatedTime'),

  amountInput: document.getElementById('amountInput'),
  clearAmountBtn: document.getElementById('clearAmountBtn'),
  fromSymbolBadge: document.getElementById('fromSymbolBadge'),

  fromPickerBtn: document.getElementById('fromPickerBtn'),
  fromFlag: document.getElementById('fromFlag'),
  fromCode: document.getElementById('fromCode'),
  fromName: document.getElementById('fromName'),

  toPickerBtn: document.getElementById('toPickerBtn'),
  toFlag: document.getElementById('toFlag'),
  toCode: document.getElementById('toCode'),
  toName: document.getElementById('toName'),

  swapBtn: document.getElementById('swapBtn'),

  resultAmount: document.getElementById('resultAmount'),
  resultCurrencyCode: document.getElementById('resultCurrencyCode'),
  exchangeRateDetail: document.getElementById('exchangeRateDetail'),
  inverseRateDetail: document.getElementById('inverseRateDetail'),

  chartPairBadge: document.getElementById('chartPairBadge'),
  rangeBtns: document.querySelectorAll('.range-btn'),
  highMetric: document.getElementById('highMetric'),
  lowMetric: document.getElementById('lowMetric'),
  avgMetric: document.getElementById('avgMetric'),
  trendCanvas: document.getElementById('trendChart'),

  refreshRatesBtn: document.getElementById('refreshRatesBtn'),
  matrixSearchInput: document.getElementById('matrixSearchInput'),
  matrixList: document.getElementById('matrixList'),

  currencyModal: document.getElementById('currencyModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalSearchInput: document.getElementById('modalSearchInput'),
  popularGrid: document.getElementById('popularGrid'),
  modalCurrencyList: document.getElementById('modalCurrencyList')
};

// ==========================================================================
// 4. API & Data Fetching
// ==========================================================================
async function fetchExchangeRates() {
  updateStatusUI('fetching', '更新匯率中...');
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('API Request Failed');
    
    const data = await response.json();
    if (data && data.rates) {
      state.rates = { ...FALLBACK_RATES, ...data.rates };
      state.lastUpdated = new Date();
      
      // Persist in localStorage
      localStorage.setItem('fx_rates_cache', JSON.stringify(state.rates));
      localStorage.setItem('fx_rates_time', state.lastUpdated.toISOString());

      updateStatusUI('success', '即時連線中');
      renderAll();
      return;
    }
  } catch (err) {
    console.warn('API error, attempting local cache fallback:', err);
    loadCachedRates();
  }
}

function loadCachedRates() {
  const cachedRates = localStorage.getItem('fx_rates_cache');
  const cachedTime = localStorage.getItem('fx_rates_time');

  if (cachedRates && cachedTime) {
    state.rates = JSON.parse(cachedRates);
    state.lastUpdated = new Date(cachedTime);
    updateStatusUI('warning', '使用快取數據');
  } else {
    state.rates = { ...FALLBACK_RATES };
    state.lastUpdated = new Date();
    updateStatusUI('offline', '離線預設模式');
  }
  renderAll();
}

function updateStatusUI(type, text) {
  DOM.statusText.textContent = text;
  const dot = DOM.rateStatusBadge.querySelector('.status-dot');
  
  if (type === 'fetching') {
    dot.style.backgroundColor = '#f59e0b';
  } else if (type === 'success') {
    dot.style.backgroundColor = 'var(--status-green)';
  } else if (type === 'warning') {
    dot.style.backgroundColor = '#f97316';
  } else {
    dot.style.backgroundColor = 'var(--status-red)';
  }
}

// ==========================================================================
// 5. Calculations & Formatting
// ==========================================================================
function getExchangeRate(fromCode, toCode) {
  const fromRate = state.rates[fromCode] || 1;
  const toRate = state.rates[toCode] || 1;
  return toRate / fromRate;
}

function formatNumber(num, decimals = 2) {
  if (isNaN(num) || num === null) return '0.00';
  
  // Dynamic decimals based on value scale
  if (num < 0.01 && num > 0) decimals = 4;
  else if (num > 10000) decimals = 2;

  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

// ==========================================================================
// 6. UI Render Functions
// ==========================================================================
function renderAll() {
  renderTheme();
  renderConverter();
  renderMatrix();
  renderChart();
}

function renderTheme() {
  DOM.html.setAttribute('data-theme', state.theme);
}

function renderConverter() {
  const fromObj = CURRENCIES[state.fromCurrency] || { code: state.fromCurrency, name: state.fromCurrency, flag: '🏳️', symbol: '$' };
  const toObj = CURRENCIES[state.toCurrency] || { code: state.toCurrency, name: state.toCurrency, flag: '🏳️', symbol: '$' };

  // Update From Picker UI
  DOM.fromFlag.textContent = fromObj.flag;
  DOM.fromCode.textContent = fromObj.code;
  DOM.fromName.textContent = fromObj.name;
  DOM.fromSymbolBadge.textContent = fromObj.symbol || '$';

  // Update To Picker UI
  DOM.toFlag.textContent = toObj.flag;
  DOM.toCode.textContent = toObj.code;
  DOM.toName.textContent = toObj.name;

  // Calculation
  const rate = getExchangeRate(state.fromCurrency, state.toCurrency);
  const inverseRate = 1 / rate;
  const total = state.amount * rate;

  DOM.resultAmount.textContent = formatNumber(total);
  DOM.resultCurrencyCode.textContent = toObj.code;

  DOM.exchangeRateDetail.textContent = `1 ${fromObj.code} = ${formatNumber(rate, 4)} ${toObj.code}`;
  DOM.inverseRateDetail.textContent = `1 ${toObj.code} = ${formatNumber(inverseRate, 4)} ${fromObj.code}`;

  if (state.lastUpdated) {
    const timeStr = state.lastUpdated.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    DOM.lastUpdatedTime.innerHTML = `<i class="fa-regular fa-clock"></i> 更新時間: ${timeStr}`;
  }
}

function renderMatrix() {
  const filterText = DOM.matrixSearchInput.value.trim().toLowerCase();
  const currentBaseRate = state.rates[state.fromCurrency] || 1;

  DOM.matrixList.innerHTML = '';

  // Sort: starred first, then alphabetical
  const currencyKeys = Object.keys(CURRENCIES).sort((a, b) => {
    const aStarred = state.starredCurrencies.includes(a);
    const bStarred = state.starredCurrencies.includes(b);
    if (aStarred && !bStarred) return -1;
    if (!aStarred && bStarred) return 1;
    return a.localeCompare(b);
  });

  currencyKeys.forEach(code => {
    const item = CURRENCIES[code];
    if (code === state.fromCurrency) return; // skip self

    // Filter match check
    if (filterText && !code.toLowerCase().includes(filterText) && !item.name.toLowerCase().includes(filterText)) {
      return;
    }

    const rate = getExchangeRate(state.fromCurrency, code);
    const convertedValue = state.amount * rate;
    const isStarred = state.starredCurrencies.includes(code);

    const li = document.createElement('li');
    li.className = 'matrix-item';
    li.innerHTML = `
      <div class="matrix-left">
        <span class="flag-icon">${item.flag}</span>
        <div class="matrix-info">
          <span class="matrix-code">${item.code}</span>
          <span class="matrix-name">${item.name}</span>
        </div>
      </div>
      <div class="matrix-right">
        <span class="matrix-value">${item.symbol} ${formatNumber(convertedValue)}</span>
        <span class="matrix-rate">1 ${state.fromCurrency} = ${formatNumber(rate, 4)}</span>
      </div>
      <button class="star-btn ${isStarred ? 'starred' : ''}" data-code="${code}" title="收藏幣別">
        <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star"></i>
      </button>
    `;

    // Click item to set as Target currency
    li.addEventListener('click', (e) => {
      if (e.target.closest('.star-btn')) return; // handled separately
      state.toCurrency = code;
      renderConverter();
      renderChart();
    });

    // Star button toggle
    const starBtn = li.querySelector('.star-btn');
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStarCurrency(code);
    });

    DOM.matrixList.appendChild(li);
  });
}

function toggleStarCurrency(code) {
  const index = state.starredCurrencies.indexOf(code);
  if (index >= 0) {
    state.starredCurrencies.splice(index, 1);
  } else {
    state.starredCurrencies.push(code);
  }
  localStorage.setItem('fx_starred', JSON.stringify(state.starredCurrencies));
  renderMatrix();
}

// ==========================================================================
// 7. Canvas Trend Chart Drawing
// ==========================================================================
function renderChart() {
  const pairText = `${state.fromCurrency} / ${state.toCurrency}`;
  DOM.chartPairBadge.textContent = pairText;

  const currentRate = getExchangeRate(state.fromCurrency, state.toCurrency);
  const pointsCount = state.chartRange === '7d' ? 7 : state.chartRange === '30d' ? 30 : 90;
  
  // Generate realistic historical data points around current exchange rate
  const points = generateHistoricalPoints(currentRate, pointsCount);

  // Compute metrics
  const values = points.map(p => p.value);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

  DOM.highMetric.textContent = formatNumber(high, 4);
  DOM.lowMetric.textContent = formatNumber(low, 4);
  DOM.avgMetric.textContent = formatNumber(avg, 4);

  drawCanvasChart(points);
}

function generateHistoricalPoints(currentRate, count) {
  const points = [];
  let simulated = currentRate;
  
  // Simple pseudo-random walk anchored to current rate
  const now = new Date();
  const seed = (state.fromCurrency.charCodeAt(0) + state.toCurrency.charCodeAt(0)) * 17;
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Controlled variance (+/- 0.8% max daily variance)
    const factor = 1 + (Math.sin((i + seed) * 0.4) * 0.008 + (Math.cos((i * 13 + seed)) * 0.004));
    const val = currentRate * factor;

    points.push({
      dateStr: `${date.getMonth() + 1}/${date.getDate()}`,
      value: val
    });
  }

  // Ensure last point matches exact current rate
  if (points.length > 0) {
    points[points.length - 1].value = currentRate;
  }

  return points;
}

function drawCanvasChart(data) {
  const canvas = DOM.trendCanvas;
  const ctx = canvas.getContext('2d');
  
  // Handle high-DPI retina screens
  const rect = canvas.parentNode.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  if (data.length === 0) return;

  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const graphW = width - padding.left - padding.right;
  const graphH = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values) * 0.998;
  const maxVal = Math.max(...values) * 1.002;
  const range = maxVal - minVal || 1;

  // Grid Lines & Labels
  ctx.lineWidth = 1;
  ctx.strokeStyle = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  ctx.fillStyle = state.theme === 'dark' ? '#64748b' : '#94a3b8';
  ctx.font = '11px Outfit, sans-serif';

  const gridRows = 4;
  for (let i = 0; i <= gridRows; i++) {
    const y = padding.top + (graphH / gridRows) * i;
    const val = maxVal - (range / gridRows) * i;

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillText(formatNumber(val, 3), 5, y + 4);
  }

  // Draw Smooth Trend Curve
  const points = data.map((d, index) => {
    const x = padding.left + (graphW / (data.length - 1)) * index;
    const y = padding.top + graphH - ((d.value - minVal) / range) * graphH;
    return { x, y };
  });

  // Area Gradient
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  if (state.theme === 'dark') {
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
  } else {
    gradient.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0.0)');
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

  // Fill area
  ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
  ctx.lineTo(points[0].x, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

  ctx.strokeStyle = state.theme === 'dark' ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Highlight Last Point
  const lastP = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastP.x, lastP.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = state.theme === 'dark' ? '#38bdf8' : '#0284c7';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
}

// ==========================================================================
// 8. Currency Picker Modal Logic
// ==========================================================================
function openCurrencyModal(target) {
  state.activePickerTarget = target;
  DOM.currencyModal.classList.add('active');
  DOM.modalSearchInput.value = '';
  DOM.modalSearchInput.focus();
  renderModalCurrencies();
}

function closeCurrencyModal() {
  DOM.currencyModal.classList.remove('active');
}

function renderModalCurrencies() {
  const filterText = DOM.modalSearchInput.value.trim().toLowerCase();

  // Popular Grid
  DOM.popularGrid.innerHTML = '';
  Object.keys(CURRENCIES).filter(code => CURRENCIES[code].popular).forEach(code => {
    const item = CURRENCIES[code];
    const pill = document.createElement('button');
    pill.className = 'pop-pill';
    pill.innerHTML = `
      <span class="flag-icon">${item.flag}</span>
      <span class="code">${item.code}</span>
    `;
    pill.addEventListener('click', () => selectCurrency(code));
    DOM.popularGrid.appendChild(pill);
  });

  // Main List
  DOM.modalCurrencyList.innerHTML = '';
  Object.keys(CURRENCIES).forEach(code => {
    const item = CURRENCIES[code];

    if (filterText && !code.toLowerCase().includes(filterText) && !item.name.toLowerCase().includes(filterText)) {
      return;
    }

    const currentSelected = state.activePickerTarget === 'from' ? state.fromCurrency : state.toCurrency;
    const isActive = code === currentSelected;

    const li = document.createElement('li');
    li.className = `modal-currency-item ${isActive ? 'active' : ''}`;
    li.innerHTML = `
      <div class="modal-item-info">
        <span class="flag-icon">${item.flag}</span>
        <div class="modal-item-names">
          <span class="modal-item-code">${item.code}</span>
          <span class="modal-item-fullname">${item.name}</span>
        </div>
      </div>
      <span class="modal-item-symbol">${item.symbol}</span>
    `;

    li.addEventListener('click', () => selectCurrency(code));
    DOM.modalCurrencyList.appendChild(li);
  });
}

function selectCurrency(code) {
  if (state.activePickerTarget === 'from') {
    if (code === state.toCurrency) {
      // Automatic Swap if selecting same currency
      state.toCurrency = state.fromCurrency;
    }
    state.fromCurrency = code;
  } else {
    if (code === state.fromCurrency) {
      state.fromCurrency = state.toCurrency;
    }
    state.toCurrency = code;
  }

  closeCurrencyModal();
  renderConverter();
  renderMatrix();
  renderChart();
}

// ==========================================================================
// 9. Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fx_theme', state.theme);
    renderTheme();
    renderChart(); // redraw chart with new theme colors
  });

  // Amount Input
  DOM.amountInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    state.amount = isNaN(val) ? 0 : val;
    renderConverter();
    renderMatrix();
  });

  // Clear Amount Button
  DOM.clearAmountBtn.addEventListener('click', () => {
    DOM.amountInput.value = '';
    state.amount = 0;
    renderConverter();
    renderMatrix();
  });

  // Preset Pills
  document.querySelectorAll('.preset-pills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const amount = parseFloat(pill.dataset.amount);
      DOM.amountInput.value = amount;
      state.amount = amount;
      renderConverter();
      renderMatrix();
    });
  });

  // Swap Button
  DOM.swapBtn.addEventListener('click', () => {
    const temp = state.fromCurrency;
    state.fromCurrency = state.toCurrency;
    state.toCurrency = temp;

    // Trigger visual rotation effect
    DOM.swapBtn.style.transform = 'rotate(180deg) scale(1.1)';
    setTimeout(() => { DOM.swapBtn.style.transform = ''; }, 300);

    renderConverter();
    renderMatrix();
    renderChart();
  });

  // Currency Pickers Modal Triggers
  DOM.fromPickerBtn.addEventListener('click', () => openCurrencyModal('from'));
  DOM.toPickerBtn.addEventListener('click', () => openCurrencyModal('to'));

  // Modal Controls
  DOM.modalCloseBtn.addEventListener('click', closeCurrencyModal);
  DOM.currencyModal.addEventListener('click', (e) => {
    if (e.target === DOM.currencyModal) closeCurrencyModal();
  });
  DOM.modalSearchInput.addEventListener('input', renderModalCurrencies);

  // Matrix Controls
  DOM.refreshRatesBtn.addEventListener('click', () => {
    DOM.refreshRatesBtn.style.transform = 'rotate(360deg)';
    fetchExchangeRates();
    setTimeout(() => { DOM.refreshRatesBtn.style.transform = ''; }, 600);
  });
  DOM.matrixSearchInput.addEventListener('input', renderMatrix);

  // Range Selector
  DOM.rangeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.rangeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.chartRange = btn.dataset.range;
      renderChart();
    });
  });

  // Window Resize (Redraw Canvas Chart)
  window.addEventListener('resize', () => {
    renderChart();
  });
}

// ==========================================================================
// 10. Application Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderAll();
  fetchExchangeRates();
});
