# Exchangify

A web application that allows users to look up historical currency exchange rates. The site pulls data from the Korea Eximbank and stores it in the database for easy retrieval and display.

- **Main Page**  
    ![](main.png)
- **Detail Page**  
    ![](detail.png)

## Usage
1. **Clone the repository**
    ```bash
    git clone https://github.com/leewr9/exchangify.git
    cd exchangify

2. **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3. **Start the Local Server**
    ```bash
    python manage.py runserver
    ```

Visit the site at [http://localhost:8000/](http://localhost:8000/).

### Database Setup
1. **Create the database models**
    ```bash
    python manage.py makemigrations  # Create migration files
    python manage.py migrate  # Apply the migrations to the database
    ```

2. **To collect data (historical exchange rates for the past year)**
    ```bash
    python manage.py crawling  # Collect data from one year ago based on today
    # app/management/commands/crawling.py
    ```

#### What to do if you don't have an API key for Korea Eximbank?
```bash
python manage.py loaddata data.json  # Load exchange rate data for the period 2023-12-04 to 2024-12-05
```
        

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
