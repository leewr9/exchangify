import requests
import json
from datetime import datetime, timedelta
from decouple import config
from django.core.management.base import BaseCommand
from app.models import Exchange
import time


class Command(BaseCommand):
    help = "Fetch exchange rate data and store it in the database"

    def parse_exchange_data(self, data, date):
        """
        Parse and update Exchange data into the database.
        """
        exchange_objects = []
        for item in data:
            if item["result"] == 1:
                exchange_objects.append(
                    Exchange(
                        cur_unit=item["cur_unit"],
                        cur_nm=item["cur_nm"],
                        deal_bas_r=float(item["deal_bas_r"].replace(",", "")),
                        ttb=float(item["ttb"].replace(",", "")),
                        tts=float(item["tts"].replace(",", "")),
                        cur_date=date,
                    )
                )
        if exchange_objects:
            # Bulk create or update to avoid multiple database hits
            Exchange.objects.bulk_create(exchange_objects, ignore_conflicts=True)

    def fetch_exchange_data(self, current_date):
        """
        Fetch exchange rate data from the API for a specific date.
        """
        authkey = config("AUTH_KEY")
        url = f'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={authkey}&searchdate={current_date.strftime("%Y%m%d")}&data=AP01'
        try:
            print(f"Fetching data for {current_date.strftime('%Y-%m-%d')} from {url}")
            response = requests.get(url)
            response.raise_for_status()  # Raises an HTTPError if the response was an error
            return json.loads(response.text)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for {current_date.strftime('%Y-%m-%d')}: {e}")
            return None

    def handle(self, *args, **kwargs):
        """
        Handle the management command.
        """
        start_date = datetime.now() - timedelta(days=365)
        end_date = datetime.now()

        current_date = start_date
        while current_date <= end_date:
            data = self.fetch_exchange_data(current_date)
            if data:
                self.parse_exchange_data(data, current_date.strftime("%Y-%m-%d"))
            current_date += timedelta(days=1)
            # Optional: To avoid hitting API too quickly, add a small delay
            time.sleep(0.1)
