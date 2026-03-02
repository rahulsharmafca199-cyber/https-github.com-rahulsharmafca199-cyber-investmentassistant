// Investment Assistant - Main Application Logic

const holdings = [];

// DOM references
const form = document.getElementById('investment-form');
const holdingsList = document.getElementById('holdings-list');
const totalValueEl = document.getElementById('total-value');
const totalGainLossEl = document.getElementById('total-gain-loss');
const returnPctEl = document.getElementById('return-pct');
const calcBtn = document.getElementById('calc-btn');
const calcResult = document.getElementById('calc-result');

/** Format a number as USD currency */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/** Render all holdings and update summary */
function renderHoldings() {
  let totalCost = 0;
  let totalCurrentValue = 0;

  holdingsList.innerHTML = '';

  if (holdings.length === 0) {
    holdingsList.innerHTML = '<p class="empty-state">No investments yet. Add your first one above!</p>';
  } else {
    holdings.forEach((h, index) => {
      const cost = h.shares * h.buyPrice;
      const currentValue = h.shares * h.currentPrice;
      const gain = currentValue - cost;
      const gainPct = ((gain / cost) * 100).toFixed(2);
      const gainClass = gain >= 0 ? 'positive' : 'negative';
      const gainSign = gain >= 0 ? '+' : '';

      totalCost += cost;
      totalCurrentValue += currentValue;

      const item = document.createElement('div');
      item.className = 'holding-item';
      item.innerHTML = `
        <div class="holding-info">
          <div class="ticker">${h.ticker.toUpperCase()}</div>
          <div class="shares">${h.shares} shares @ ${formatCurrency(h.buyPrice)}</div>
        </div>
        <div class="holding-value">
          <div class="current">${formatCurrency(currentValue)}</div>
          <div class="gain ${gainClass}">${gainSign}${formatCurrency(gain)} (${gainSign}${gainPct}%)</div>
        </div>
        <button class="remove-btn" data-index="${index}" aria-label="Remove ${h.ticker}">✕</button>
      `;
      holdingsList.appendChild(item);
    });
  }

  // Update summary
  const totalGain = totalCurrentValue - totalCost;
  const returnPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : 0;

  totalValueEl.textContent = formatCurrency(totalCurrentValue);

  totalGainLossEl.textContent = (totalGain >= 0 ? '+' : '') + formatCurrency(totalGain);
  totalGainLossEl.className = 'value ' + (totalGain >= 0 ? 'positive' : 'negative');

  returnPctEl.textContent = (totalGain >= 0 ? '+' : '') + returnPct + '%';
  returnPctEl.className = 'value ' + (totalGain >= 0 ? 'positive' : 'negative');
}

/** Handle form submission to add a new holding */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const ticker = document.getElementById('ticker').value.trim();
  const shares = parseFloat(document.getElementById('shares').value);
  const buyPrice = parseFloat(document.getElementById('buy-price').value);
  const currentPrice = parseFloat(document.getElementById('current-price').value);

  if (!ticker || isNaN(shares) || isNaN(buyPrice) || isNaN(currentPrice)) return;
  if (shares <= 0 || buyPrice <= 0 || currentPrice <= 0) return;

  holdings.push({ ticker, shares, buyPrice, currentPrice });
  renderHoldings();
  form.reset();
});

/** Remove a holding when the remove button is clicked */
holdingsList.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-btn');
  if (!btn) return;
  const index = parseInt(btn.dataset.index, 10);
  holdings.splice(index, 1);
  renderHoldings();
});

/** Compound interest calculator */
calcBtn.addEventListener('click', () => {
  const principal = parseFloat(document.getElementById('calc-principal').value);
  const rate = parseFloat(document.getElementById('calc-rate').value);
  const years = parseInt(document.getElementById('calc-years').value, 10);

  if (isNaN(principal) || isNaN(rate) || isNaN(years) || principal <= 0 || rate <= 0 || years <= 0) {
    calcResult.innerHTML = '<span style="color:#c53030">Please fill in all fields with positive values.</span>';
    calcResult.classList.remove('hidden');
    return;
  }

  const futureValue = principal * Math.pow(1 + rate / 100, years);
  const totalGain = futureValue - principal;

  calcResult.innerHTML = `
    <strong>Future Value: ${formatCurrency(futureValue)}</strong>
    Total Gain: ${formatCurrency(totalGain)}<br/>
    Effective Return: ${((totalGain / principal) * 100).toFixed(2)}%
  `;
  calcResult.classList.remove('hidden');
});

// Initialize
renderHoldings();
