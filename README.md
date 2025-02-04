# Exchangify

A web application that allows users to look up historical currency exchange rates. The site pulls data from the Korea Eximbank and stores it in the database for easy retrieval and display.

* **Main Page**  
  ![](main.png)
* **Detail Page**  
  ![](detail.png)

## Setup

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/leewr9/site.exchangify.git
   cd site.exchangify
   ```

2. Install the required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```

## Database Setup

1. Create the database models:
   ```bash
   python manage.py makemigrations  # Create migration files
   python manage.py migrate  # Apply the migrations to the database
   ```

2. To collect data (historical exchange rates for the past year):
   ```bash
   python manage.py crawling  # Collect data from one year ago based on today
   # app/management/commands/crawling.py
   ```

### What to do if you don't have an API key for Korea Eximbank?

You can load data manually from a pre-existing file:
   ```bash
   python manage.py loaddata data.json  # Load exchange rate data for the period 2023-12-04 to 2024-12-05
   ```

## Start the Server

To run the development server:
```bash
python manage.py runserver
```

Visit the site at [http://localhost:8000/](http://localhost:8000/).

## License

### This project license:
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-party libraries used in this project:

- **Chart.js**: A simple yet flexible JavaScript charting library.
  - License: MIT License
  - URL: https://github.com/chartjs/Chart.js

- **flatpickr**: A lightweight, powerful datetime picker.
  - License: MIT License
  - URL: https://github.com/flatpickr/flatpickr

- **jQuery**: A fast, small, and feature-rich JavaScript library.
  - License: MIT License
  - URL: https://github.com/jquery/jquery
