// Updates the main chart and related data display based on the provided exchange data
function updateMainDataContent(exchangeData) {
    console.log('Updating main data content');

    // Update today's rate section
    const todayRateElement = document.getElementById('rate-today');
    updateRateElement(todayRateElement, exchangeData.today_deal_bas_r, exchangeData.today_cur_date);

    // Update minimum rate section
    const minRateElement = document.getElementById('rate-min');
    updateRateElement(minRateElement, exchangeData.min_deal_bas_r, exchangeData.min_cur_date);

    // Update maximum rate section
    const maxRateElement = document.getElementById('rate-max');
    updateRateElement(maxRateElement, exchangeData.max_deal_bas_r, exchangeData.max_cur_date);

    // Update average rate section
    const avgRateElement = document.getElementById('rate-avg');
    avgRateElement.textContent = exchangeData.avg_deal_bas_r;

    // Create and render the main chart
    const mainChartElement = document.getElementById('main-chart');
    mainChartElement.innerHTML = ''; // Clear existing content

    const chartCanvas = document.createElement('canvas');
    const chartTitle = document.createElement('p');
    chartTitle.textContent = exchangeData.cur_nm_unit;

    mainChartElement.appendChild(chartTitle);
    mainChartElement.appendChild(chartCanvas);

    const options = {
        plugins: { tooltip: true },
        responsive: true,
        maintainAspectRatio: false,
    };

    renderLineChart(chartCanvas.getContext('2d'), {
        labels: exchangeData.cur_dates,
        datasets: [
            createDataset('현재 환율', exchangeData.deal_bas_rs, 'rgba(54, 162, 235, 0.2)', 'rgb(54, 162, 235)', false, 3),
            createDataset('파실 때', exchangeData.ttb_datas, 'rgba(255, 99, 132, 0.2)', 'rgb(255, 99, 132)', false, 3),
            createDataset('사실 때', exchangeData.tts_datas, 'rgba(75, 192, 192, 0.2)', 'rgb(75, 192, 192)', false, 3)
        ]
    }, options);
}

// Updates the content of a rate display element
function updateRateElement(element, rate, date) {
    element.innerHTML = '';
    const rateParagraph = document.createElement('p');
    rateParagraph.textContent = `${rate} (${date})`;
    element.appendChild(rateParagraph);
}

// Updates the side charts with the provided exchange data
function updateSideChartContent(exchangeDataList) {
    console.log('Updating side chart content');
    clearChartContent();

    const sideChartContainer = document.getElementById('side-chart');

    exchangeDataList.forEach((data, index) => {
        const sideChartDiv = document.createElement('div');
        const sideChartTitle = document.createElement('p');
        const sideChartCanvas = document.createElement('canvas');

        sideChartTitle.textContent = data.cur_nm_unit;
        sideChartCanvas.id = `chart-${index}`;

        sideChartDiv.appendChild(sideChartTitle);
        sideChartDiv.appendChild(sideChartCanvas);
        sideChartContainer.appendChild(sideChartDiv);

        const options = {
            plugins: { legend: false, tooltip: true },
            scales: {
                x: { display: false, grid: { display: false } },
            },
        };

        renderLineChart(sideChartCanvas.getContext('2d'), {
            labels: data.cur_dates,
            datasets: [
                createDataset(data.cur_nm, data.deal_bas_rs, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)', true, 0)
            ]
        }, options);

        sideChartDiv.addEventListener('click', () => {
            updateMainDataContent(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Clears all chart and rate display content
function clearChartContent() {
    console.log('Clearing chart content');

    const elementsToClear = [
        'main-chart',
        'side-chart',
        'rate-today',
        'rate-min',
        'rate-max',
        'rate-avg'
    ];

    elementsToClear.forEach(id => {
        const element = document.getElementById(id);
        element.innerHTML = '';
    });
}

// Renders a line chart in the provided context with the given data
function renderLineChart(context, { labels, datasets }, options) {
    new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options,
    });
}

// Creates a dataset for a chart
function createDataset(label, data, backgroundColor, borderColor, fill, pointRadius) {
    return {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        fill: fill,
        pointRadius: pointRadius
    };
}

// Initialize the page on load
window.onload = function() {
    updateSideChartContent(exchangeData);
    updateMainDataContent(searchData);
};
