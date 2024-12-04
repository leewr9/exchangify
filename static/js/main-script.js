function change_calc_data_content(chartData) {
    console.log('change_main_data_content')

    const calcSelectTop = document.getElementById('calc-select-top');
    chartData.forEach((data, index) => {
        const option = document.createElement('option');
        option.textContent = data.cur_nm_unit;
        option.className = data.cur_unit;
        option.value = Number(data.today_deal_bas_r / data.cur_unit_num);
        calcSelectTop.appendChild(option);
    });

    const calcTextTop = document.getElementById('calc-text-top');
    const calcTextBottom = document.getElementById('calc-text-bottom');
    calcTextTop.addEventListener('input', function() {
        const rawValue = calcTextTop.value.replace(/,/g, '');
        const formattedValue = Number(rawValue).toLocaleString();
        calcTextBottom.value = `${(calcSelectTop.value * Number(rawValue)).toLocaleString()}원`;
        calcTextTop.value = formattedValue;
    });

    calcSelectTop.addEventListener('change', () => {
        calcTextTop.value = '';
        calcTextBottom.value = '';
        console.log(calcSelectTop.className);
    });
}

function change_today_data_content(chartData) {
    console.log('change_today_data_content')

    const todayChart = document.getElementById('today-chart');
    chartData.forEach((data, index) => {
        const todayDiv = document.createElement('div');
        const todayNm = document.createElement('p');
        const todayDeal = document.createElement('p');
        const todayCanvas = document.createElement('canvas');
        
        todayNm.textContent = data.cur_nm_unit;
        todayNm.style.paddingTop = '20px';
        todayNm.style.paddingLeft = '20px';
        todayDeal.textContent = `${data.today_deal_bas_r.toLocaleString()}원`;
        todayDeal.style.fontSize = '20px';
        todayDeal.style.fontWeight = 'bold';
        todayDeal.style.paddingLeft = '20px';
        todayCanvas.id = `chart-${index}`;
        todayDiv.appendChild(todayNm)
        todayDiv.appendChild(todayDeal)
        todayDiv.appendChild(todayCanvas)
        todayChart.appendChild(todayDiv);

        const todayContext = todayCanvas.getContext('2d');
        new Chart(todayContext, {
            type: 'line', 
            data: {
                    labels: data.cur_dates, 
                    datasets: [{
                            label: data.cur_nm,
                            data: data.deal_bas_rs, 
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            borderColor: 'rgba(75, 192, 192, 0.1)',
                            borderWidth: 1,
                            fill: true,
                            pointRadius: 0
                    }]
            },
            options: {
                plugins: {
                    legend: false,
                    tooltip: true
                },
                scales: {
                    x: {
                            display: false, 
                            grid: {
                                    display: false 
                            }
                    },
                    y: {
                            display: false, 
                            grid: {
                                    display: false 
                            }
                    },
                }
            }
        });

        todayDiv.addEventListener('click', function() {
            const redirectUrl = `/detail/?search=${data.cur_unit}`;
            window.location.href = redirectUrl;
        });
    });
}
