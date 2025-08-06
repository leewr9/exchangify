// Function to handle the AJAX request to update the data
function fetchDataFromServer() {
  $.ajax({
    url: "/update/",
    type: "POST",
    data: {
      start_date: startDatePicker.input.value,
      end_date: endDatePicker.input.value,
      current_unit: currentUnit,
      csrfmiddlewaretoken: csrfToken,
    },
    success: function (response) {
      console.log("Server Request:", response);
      updateSideChartContent(response.exchange_data);
      updateMainDataContent(response.search_data);
    },
    error: function (xhr, status, error) {
      console.error("AJAX Request Fail:", error);
    },
  });
}

// Utility function to get the date of 'n' days ago
function getDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

// Initialize flatpickr for the start date with Korean locale and default to 30 days ago
const startDatePicker = flatpickr("#start-date", {
  locale: "ko",
  defaultDate: getDateDaysAgo(30),
  dateFormat: "Y년 m월 d일",
  onChange: function () {
    fetchDataFromServer();
  },
});

// Initialize flatpickr for the end date with Korean locale and default to today
const endDatePicker = flatpickr("#end-date", {
  locale: "ko",
  defaultDate: "today",
  dateFormat: "Y년 m월 d일",
  onChange: function () {
    fetchDataFromServer();
  },
});

// Button click event listeners to set predefined date ranges
const monthButton = document.getElementById("btn-one-month");
const threeMonthButton = document.getElementById("btn-three-months");
const sixMonthButton = document.getElementById("btn-six-months");
const yearButton = document.getElementById("btn-one-year");

// Set date range to one month when the corresponding button is clicked
monthButton.addEventListener("click", function () {
  setDateRange(30);
  fetchDataFromServer();
});

// Set date range to three months when the corresponding button is clicked
threeMonthButton.addEventListener("click", function () {
  setDateRange(90);
  fetchDataFromServer();
});

// Set date range to six months when the corresponding button is clicked
sixMonthButton.addEventListener("click", function () {
  setDateRange(180);
  fetchDataFromServer();
});

// Set date range to one year when the corresponding button is clicked
yearButton.addEventListener("click", function () {
  setDateRange(365);
  fetchDataFromServer();
});

// Helper function to update both start and end date pickers
function setDateRange(daysAgo) {
  startDatePicker.setDate(getDateDaysAgo(daysAgo));
  endDatePicker.setDate("today");
}
