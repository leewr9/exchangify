# Exchangify

A web application that allows users to look up historical currency exchange rates. The site pulls data from the Korea Eximbank and stores it in the database for easy retrieval and display.

![main](main.png)![detail](detail.png)

## Feature

- Fetches historical exchange rate data from Korea Eximbank
- Stores data in a local database for quick access
- Provides a user-friendly web interface for searching and viewing exchange rates
- Supports manual data import without an API key

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/leewr9/exchangify.git
   cd exchangify
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database**

   ```bash
   python manage.py makemigrations  # Create migration files
   python manage.py migrate         # Apply migrations to the database
   ```

## Usage

### Run the Site Locally

```bash
python manage.py runserver
```

Then, visit http://localhost:8000/ in your browser.

### Collect Exchange Rate Data

To collect historical exchange rate data from the past year, you need to set your **Korea Eximbank API Key (AUTH_KEY)** as an environment variable:

```bash
export AUTH_KEY=your_eximbank_api_key
```

Then, run the crawling command:

```bash
python manage.py crawling
# This script is located at app/management/commands/crawling.py
```

### Without API Key (Load Sample Data)

If you do not have an API key for Korea Eximbank, you can load pre-collected data:

```bash
python manage.py loaddata data.json
# Loads exchange rate data for the period 2023-12-04 to 2024-12-05
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
