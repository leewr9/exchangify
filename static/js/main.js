// Function to initialize currency calculator content
function defineCalcDataContent(exchangeData) {
  console.log("Initializing calculator data content");

  const selectCurrencyFrom = document.getElementById("currency-from");

  // Populate currency selection options
  exchangeData.forEach((currency, index) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = currency.cur_nm_unit;
    optionElement.className = currency.cur_unit;
    optionElement.value = Number(
      currency.today_deal_bas_r / currency.cur_unit_num,
    );
    selectCurrencyFrom.appendChild(optionElement);
  });

  // Set up event listeners for calculator inputs
  setupCalcEventListeners();
}

// Function to set up calculator input event listeners
function setupCalcEventListeners() {
  const inputAmountFrom = document.getElementById("amount-from");
  const inputAmountTo = document.getElementById("amount-to");
  const selectCurrencyFrom = document.getElementById("currency-from");

  // Format input and calculate converted amount
  inputAmountFrom.addEventListener("input", () => {
    const rawValue = inputAmountFrom.value.replace(/,/g, "");
    const formattedValue = Number(rawValue).toLocaleString();
    inputAmountTo.value = `${(selectCurrencyFrom.value * Number(rawValue)).toLocaleString()}원`;
    inputAmountFrom.value = formattedValue;
  });

  // Reset input values when currency selection changes
  selectCurrencyFrom.addEventListener("change", () => {
    inputAmountFrom.value = "";
    inputAmountTo.value = "";
    console.log(selectCurrencyFrom.className);
  });
}

// Function to display today's exchange data
function displayTodayExchangeData(exchangeData) {
  console.log("Displaying today’s exchange data");

  const chartContainer = document.getElementById("exchange-chart");

  // Create chart and data elements for each currency
  exchangeData.forEach((currency, index) => {
    const currencyElement = createCurrencyElement(currency, index);
    chartContainer.appendChild(currencyElement);

    initializeCurrencyChart(currency, index);
  });
}

// Function to create currency display element
function createCurrencyElement(currency, index) {
  const currencyDiv = document.createElement("div");
  const currencyName = document.createElement("p");
  const currencyRate = document.createElement("p");
  const currencyChart = document.createElement("canvas");

  // Set currency name and styling
  currencyName.textContent = currency.cur_nm_unit;
  currencyName.style.paddingTop = "20px";
  currencyName.style.paddingLeft = "20px";

  // Set currency rate and styling
  currencyRate.textContent = `${currency.today_deal_bas_r.toLocaleString()}원`;
  currencyRate.style.fontSize = "20px";
  currencyRate.style.fontWeight = "bold";
  currencyRate.style.paddingLeft = "20px";

  // Configure chart canvas
  currencyChart.id = `chart-${index}`;

  // Append elements to currency div
  currencyDiv.appendChild(currencyName);
  currencyDiv.appendChild(currencyRate);
  currencyDiv.appendChild(currencyChart);

  // Add click event to redirect to detail page
  currencyDiv.addEventListener("click", () => {
    const detailUrl = `/detail/?search=${currency.cur_unit}`;
    window.location.href = detailUrl;
  });

  return currencyDiv;
}

// Function to initialize chart for a currency
function initializeCurrencyChart(currency, index) {
  const chartCanvas = document.getElementById(`chart-${index}`);
  const chartContext = chartCanvas.getContext("2d");

  new Chart(chartContext, {
    type: "line",
    data: {
      labels: currency.cur_dates,
      datasets: [
        {
          label: currency.cur_nm,
          data: currency.deal_bas_rs,
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          borderColor: "rgba(75, 192, 192, 0.1)",
          borderWidth: 1,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: false,
        tooltip: true,
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
      },
    },
  });
}
