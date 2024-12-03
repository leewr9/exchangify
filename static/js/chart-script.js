function change_chart_data_content(chartData) {
  console.log('change_chart_data_content')
  clear_chart_data_content()

  const sideChart = document.getElementById('side-chart');
  chartData.forEach((data, index) => {
    const sideDiv = document.createElement('div');
    const sideP = document.createElement('p');
    const sideCanvas = document.createElement('canvas');
    
    sideP.textContent = data.cur_nm_unit
    sideCanvas.id = `chart-${index}`;
    sideDiv.appendChild(sideP)
    sideDiv.appendChild(sideCanvas)
    sideChart.appendChild(sideDiv);

    const sideContext = sideCanvas.getContext('2d');
    new Chart(sideContext, {
      type: 'line', 
      data: {
          labels: data.cur_dates, 
          datasets: [{
              label: data.cur_nm,
              data: data.deal_bas_rs, 
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
        }
      }
    });

    sideDiv.addEventListener('click', function() {
      const toDay = document.getElementById('information-today');
      const todayData = document.createElement('p');
      todayData.textContent = data.today_deal_bas_r + ' (' + data.today_cur_date + ')';
      toDay.innerHTML = ''; 
      toDay.appendChild(todayData); 
      
      const minDay = document.getElementById('information-min-day');
      const minData = document.createElement('p');
      minData.textContent = data.min_deal_bas_r + ' (' + data.min_cur_date + ')';
      minDay.innerHTML = ''; 
      minDay.appendChild(minData); 
      
      const maxDay = document.getElementById('information-max-day');
      const maxData = document.createElement('p');
      maxData.textContent = data.max_deal_bas_r + ' (' + data.max_cur_date + ')';
      maxDay.innerHTML = ''; 
      maxDay.appendChild(maxData); 
      
      const avgData = document.getElementById('information-avg-day');
      avgData.innerHTML = data.avg_deal_bas_r; 

      const mainCanvas = sideCanvas.cloneNode(true); 
      const mainP = sideP.cloneNode(true);
      const chartInstance = Chart.getChart(sideCanvas.id);
      if (!chartInstance) {
          console.error("Chart not found for", canvas.id);
          return;
      }
    
      const mainContext = mainCanvas.getContext('2d');
      new Chart(mainContext, {
          type: chartInstance.config.type,
          data: {
            labels: data.cur_dates, 
            datasets: [{
                label: '현재 환율',
                data: data.deal_bas_rs, 
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }, {
              label: '파실 때',
              data: data.ttb_datas, 
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
            }, {
              label: '사실 때',
              data: data.tts_datas, 
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              tooltip: true,
            },
            responsive: true, 
            maintainAspectRatio: false
          }
      });

      const mainChart = document.getElementById('main-chart');
      mainChart.innerHTML = ''; 
      mainChart.appendChild(mainP); 
      mainChart.appendChild(mainCanvas); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function clear_chart_data_content() {
  console.log('clear_chart_data_content')

  const mainChart = document.getElementById('main-chart');
  const sideChart = document.getElementById('side-chart');
  const toDay = document.getElementById('information-today');
  const minDay = document.getElementById('information-min-day');
  const maxDay = document.getElementById('information-max-day');
  const avgData = document.getElementById('information-avg-day');

  mainChart.innerHTML = ''; 
  sideChart.innerHTML = ''; 
  toDay.innerHTML = ''; 
  minDay.innerHTML = ''; 
  maxDay.innerHTML = ''; 
  avgData.innerHTML = ''; 
}