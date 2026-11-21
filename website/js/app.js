document.addEventListener('DOMContentLoaded', () => {
  const coinInput = document.getElementById('coinInput');
  const coinSlider = document.getElementById('coinSlider');
  const inrValue = document.getElementById('inrValue');
  const paiseValue = document.getElementById('paiseValue');
  const statusTag = document.getElementById('statusTag');

  function updateCalculator(coins) {
    // Ensure integer
    let val = parseInt(coins, 10);
    if (isNaN(val) || val < 0) val = 0;

    // Fixed math from README:
    // paise = coins / 10
    // inr = coins / 1000
    const paise = Math.floor(val / 10);
    const inr = (val / 1000).toFixed(2);

    inrValue.textContent = `₹${inr}`;
    paiseValue.textContent = `${paise.toLocaleString('en-IN')} paise`;

    // Minimum withdrawal is 10,000 coins (₹10.00)
    if (val >= 10000) {
      statusTag.textContent = 'Eligible for Payout (≥ 10,000 Coins)';
      statusTag.className = 'res-value status-tag';
    } else {
      const remaining = 10000 - val;
      statusTag.textContent = `Need ${remaining.toLocaleString('en-IN')} more coins`;
      statusTag.className = 'res-value status-tag ineligible';
    }
  }

  if (coinInput && coinSlider) {
    coinInput.addEventListener('input', (e) => {
      let val = e.target.value;
      coinSlider.value = val;
      updateCalculator(val);
    });

    coinSlider.addEventListener('input', (e) => {
      let val = e.target.value;
      coinInput.value = val;
      updateCalculator(val);
    });

    updateCalculator(coinInput.value);
  }
});
