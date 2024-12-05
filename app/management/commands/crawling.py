import requests
import json
from datetime import datetime, timedelta
from decouple import config
from django.core.management.base import BaseCommand
from app.models import Exchange

class Command(BaseCommand):
    def parse(self, data, date):
        for item in data:
            if item['result'] == 1:
                Exchange.objects.update_or_create(
                    cur_unit = item['cur_unit'],
                    cur_nm = item['cur_nm'],
                    deal_bas_r = float(item['deal_bas_r'].replace(',', '')),
                    ttb = float(item['ttb'].replace(',', '')),
                    tts = float(item['tts'].replace(',', '')),
                    cur_date = date
                )

    def handle(self, *args, **kwargs):
        authkey = config('AUTH_KEY')
        start_date = datetime.now() - timedelta(days=365)
        end_date = datetime.now()

        current_date = start_date
        while current_date <= end_date:
            url = f'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={authkey}&searchdate={current_date.strftime('%Y%m%d')}&data=AP01'
            print(current_date.strftime('%Y-%m-%d'))
            print(url)
            try:
                response = requests.get(url)
                data = json.loads(response.text)
                self.parse(data, current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)
            except Exception as e:
                print(e)
