function updateData() {
    $.ajax({
        url: '/update/',  
        type: 'POST',
        data: {
            'start_date': startDate.input.value,  
            'end_date': endDate.input.value,  
            'current_unit': searchData,
            'csrfmiddlewaretoken': csrf_token,  
        },
        success: function(response) {
            console.log('Server Request:', response);
            change_chart_data_content(response.chart_data);
            change_main_data_content(response.main_data);
        },
        error: function(xhr, status, error) {
            console.error('AJAX Request Fail:', error);
        }
    });
}

function getDayAgo(day) {
    const date = new Date(); 
    date.setDate(date.getDate() - day);
    return date;            
}

const startDate = flatpickr('#start-date', {
    locale: 'ko',
    defaultDate: getDayAgo(30),
    dateFormat: 'Y년 m월 d일',
    onChange: function(selectedDates, dateStr, instance) {
        updateData();
    }
});

const endDate = flatpickr('#end-date', {
    locale: 'ko',
    defaultDate: 'today',
    dateFormat: 'Y년 m월 d일',
    onChange: function(selectedDates, dateStr, instance) {
        updateData();
    }
});

const monthButton = document.getElementById('month');
const threeMonthButton = document.getElementById('three-month');
const sixMonthButton = document.getElementById('six-month');
const yearButton = document.getElementById('year');

monthButton.addEventListener('click', function() {
    startDate.setDate(getDayAgo(30));
    endDate.setDate('today');
    updateData();
});

threeMonthButton.addEventListener('click', function() {
    startDate.setDate(getDayAgo(90))
    endDate.setDate('today')
    updateData();
});

sixMonthButton.addEventListener('click', function() {
    startDate.setDate(getDayAgo(180))
    endDate.setDate('today')
    updateData();
});

yearButton.addEventListener('click', function() {
    startDate.setDate(getDayAgo(365))
    endDate.setDate('today')
    updateData();
});