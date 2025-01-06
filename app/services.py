from .models import Exchange
from datetime import datetime, timedelta
from django.db.models import Max, Min, Avg

# Helper function to parse date strings into datetime objects
def parse_date_string(date_str):
    return datetime.strptime(date_str, '%Y년 %m월 %d일')

# Helper function to get a default date range (30 or 90 days)
def get_date_range(days_ago=90):
    start_date = datetime.now() - timedelta(days=days_ago)
    end_date = datetime.now()
    return start_date, end_date


# Function to get chart data for the specified date range and optional search unit
def fetch_chart_data(start_date, end_date, search_unit=None):
    try:
        # If a search unit is provided, get data for that unit only
        if search_unit:
            return fetch_unit_data(start_date, end_date, search_unit)

        # Filter exchanges by date range, only select the relevant fields to improve performance
        exchanges = Exchange.objects.filter(cur_date__gte=start_date, cur_date__lte=end_date)

        # Get unique currency units directly from the filtered exchanges
        units = exchanges.values_list('cur_unit', flat=True).distinct()

        chart_data = []

        # Get data for all units
        for unit in units:
            unit_data = fetch_unit_data(start_date, end_date, unit)
            if unit_data:
                chart_data.append(unit_data)

        return chart_data
    except Exception as e:
        print(f"Error fetching chart data: {e}")
    
    return []


# Function to get data for a specific currency unit in the specified date range
def fetch_unit_data(start_date, end_date, search_unit):
    # Filter exchange data by unit and date range, only select the relevant fields
    exchanges = Exchange.objects.filter(cur_unit=search_unit, cur_date__gte=start_date, cur_date__lte=end_date).order_by('cur_date')
    print(exchanges)
    # If no data exists for the unit, return an empty list early
    if not exchanges:
        return []

    # Use aggregation to get max/min/avg values directly in the query to reduce loop complexity
    aggregated_data = exchanges.aggregate(
        max_deal_bas_r=Max('deal_bas_r'),
        min_deal_bas_r=Min('deal_bas_r'),
        avg_deal_bas_r=Avg('deal_bas_r')
    )

    # Initialize lists to accumulate the data
    ttb_datas, tts_datas, deal_bas_rs, cur_dates = [], [], [], []

    # Collect data from the filtered exchanges
    for exc in exchanges:
        cur_nm_unit = f'{exc.cur_nm} {exc.cur_unit}'
        cur_unit_num = exc.cur_unit.split('(')[1][:-1] if '(' in exc.cur_unit else 1
        ttb_datas.append(exc.ttb)
        tts_datas.append(exc.tts)
        deal_bas_rs.append(exc.deal_bas_r)
        cur_dates.append(str(exc.cur_date))

    # Skip if the unit name contains '한국' (South Korea)
    if '한국' in cur_nm_unit:
        return []

    # Use the aggregated data to compute the required metrics
    avg_deal_bas_r = round(aggregated_data['avg_deal_bas_r'], 2) if aggregated_data['avg_deal_bas_r'] else 0
    max_deal_bas_r = aggregated_data['max_deal_bas_r']
    min_deal_bas_r = aggregated_data['min_deal_bas_r']
    max_cur_date = str(exchanges.filter(deal_bas_r=max_deal_bas_r).first().cur_date)
    min_cur_date = str(exchanges.filter(deal_bas_r=min_deal_bas_r).first().cur_date)
    today_deal_bas_r = deal_bas_rs[-1]
    today_cur_date = cur_dates[-1]

    # Return the compiled data
    return compile_data(cur_unit=search_unit, cur_unit_num=cur_unit_num, cur_nm_unit=cur_nm_unit,
                        deal_bas_rs=deal_bas_rs, cur_dates=cur_dates, ttb_datas=ttb_datas, tts_datas=tts_datas,
                        max_deal_bas_r=max_deal_bas_r, max_cur_date=max_cur_date, min_deal_bas_r=min_deal_bas_r,
                        min_cur_date=min_cur_date, avg_deal_bas_r=avg_deal_bas_r, today_deal_bas_r=today_deal_bas_r,
                        today_cur_date=today_cur_date)


# Function to compile and return the data for a specific currency unit
def compile_data(cur_unit, cur_unit_num, cur_nm_unit, deal_bas_rs, cur_dates, ttb_datas, tts_datas,
                 max_deal_bas_r, max_cur_date, min_deal_bas_r, min_cur_date, avg_deal_bas_r,
                 today_deal_bas_r, today_cur_date):
    return {
        'cur_unit': cur_unit,
        'cur_unit_num': cur_unit_num,
        'cur_nm_unit': cur_nm_unit,
        'deal_bas_rs': deal_bas_rs,
        'ttb_datas': ttb_datas,
        'tts_datas': tts_datas,
        'cur_dates': cur_dates,
        'max_deal_bas_r': max_deal_bas_r,
        'max_cur_date': max_cur_date,
        'min_deal_bas_r': min_deal_bas_r,
        'min_cur_date': min_cur_date,
        'today_deal_bas_r': today_deal_bas_r,
        'today_cur_date': today_cur_date,
        'avg_deal_bas_r': avg_deal_bas_r
    }
