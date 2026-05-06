async function getExchangeRate(base, target) {
  try {
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`
    );

    const data = await response.json();

    if (data && data.rates && data.rates[target]) {
      return data.rates[target];
    }

    return null;
  } catch (error) {
    console.error("Currency conversion error:", error);
    return null;
  }
}

function formatCurrency(value, currency) {
  if (currency === "HUF") {
    return `${Math.round(value).toLocaleString()} HUF`;
  }

  return `${value.toFixed(2)} ${currency}`;
}

async function convertPrices(currency) {
  const priceElements = document.querySelectorAll("[data-price-huf]");

  if (currency === "HUF") {
    priceElements.forEach((el) => {
      const baseHuf = parseFloat(el.getAttribute("data-price-huf"));
      el.textContent = `From ${Math.round(baseHuf).toLocaleString()} HUF`;
    });
    return;
  }

  const rate = await getExchangeRate("HUF", currency);

  if (!rate) {
    alert("Could not load exchange rate. Please try again later.");
    return;
  }

  priceElements.forEach((el) => {
    const baseHuf = parseFloat(el.getAttribute("data-price-huf"));
    const converted = baseHuf * rate;
    el.textContent = `From ${formatCurrency(converted, currency)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currencySelect = document.getElementById("currencySelect");

  if (!currencySelect) return;

  const savedCurrency = localStorage.getItem("siteCurrency") || "HUF";
  currencySelect.value = savedCurrency;

  convertPrices(savedCurrency);

  currencySelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    localStorage.setItem("siteCurrency", selected);
    convertPrices(selected);
  });
});
