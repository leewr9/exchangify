function getDayAgo(day) {
    const date = new Date(); 
    date.setDate(date.getDate() - day);
    return date;            
}

const startDate = flatpickr("#start-date", {
    locale: "ko",
    defaultDate: getDayAgo(30),
    dateFormat: "Y년 m월 d일",
    onChange: function(selectedDates, dateStr, instance) {
        $.ajax({
            url: '/update/',  
            type: 'POST',
            data: {
                'start_date': dateStr,  
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
});

const endDate = flatpickr("#end-date", {
    locale: "ko",
    defaultDate: "today",
    dateFormat: "Y년 m월 d일",
    onChange: function(selectedDates, dateStr, instance) {
        $.ajax({
            url: '/update/',  
            type: 'POST',
            data: {
                'start_date': startDate.input.value,  
                'end_date': dateStr, 
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
});

window.onload = function() {
    change_chart_data_content(chartData);
    change_main_data_content(mainData);
};
            
            
            
            
            
            
            
            
            