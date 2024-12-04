from django.utils import timezone
from django.shortcuts import render, get_list_or_404
from django.http import JsonResponse
from datetime import datetime, timedelta
from .models import Exchange

def today_chart_view(request):
    start_date = datetime.now() - timedelta(days=30)
    end_date = datetime.now()
    chart_data = get_chart_data(start_date, end_date)

    context = {
        'chart_data': chart_data,
        'timestamp' : timezone.now()
    }
    return render(request, 'main.html', context)

def detail_chart_view(request):
    if request.method != 'GET':
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    
    start_date = datetime.now() - timedelta(days=30)
    end_date = datetime.now()
    main_data = get_chart_data(start_date, end_date, request.GET.get('search'))
    chart_data = get_chart_data(start_date, end_date)

    context = {
        'main_data': main_data,
        'chart_data': chart_data,
        'current_unit': request.GET.get('search'),
        'timestamp' : timezone.now()
    }
    return render(request, 'detail.html', context)

def update_chart_view(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

    start_date = datetime.strptime(request.POST.get('start_date'), '%Y년 %m월 %d일')
    end_date = datetime.strptime(request.POST.get('end_date'), '%Y년 %m월 %d일')
    main_data = get_chart_data(start_date, end_date, request.POST.get('current_unit'))
    chart_data = get_chart_data(start_date, end_date)

    context = {
        'main_data': main_data,
        'chart_data': chart_data,
        'timestamp' : timezone.now()
    }
    return JsonResponse(context, safe=False)

def get_chart_data(start_date, end_date, search_unit=None):
    try:
        exchanges = Exchange.objects.all()

        units = []
        for exc in exchanges:
            if exc.cur_unit in units:
                continue
            units.append(exc.cur_unit)

        chart_data = []

        if search_unit:
            ttb_datas, tts_datas, deal_bas_rs, cur_dates = [], [], [], []
            for exc in Exchange.objects.filter(cur_unit=search_unit, cur_date__gte=start_date, cur_date__lte=end_date).order_by('cur_date'):
                cur_nm_unit = f'{exc.cur_nm} ({exc.cur_unit})'
                cur_unit = exc.cur_unit
                cur_unit_num = exc.cur_unit.split('(')[1][:-1] if '(' in exc.cur_unit else 1
                ttb_datas.append(exc.ttb)
                tts_datas.append(exc.tts)
                deal_bas_rs.append(exc.deal_bas_r)
                cur_dates.append(str(exc.cur_date))
            return get_data(cur_unit, cur_unit_num, cur_nm_unit, deal_bas_rs, cur_dates, ttb_datas, tts_datas)
        
        for unit in units:
            ttb_datas, tts_datas, deal_bas_rs, cur_dates = [], [], [], []

            for exc in Exchange.objects.filter(cur_unit=unit, cur_date__gte=start_date, cur_date__lte=end_date).order_by('cur_date'):
                cur_nm_unit = f'{exc.cur_nm} ({exc.cur_unit})'
                cur_unit = exc.cur_unit
                cur_unit_num = exc.cur_unit.split('(')[1][:-1] if '(' in exc.cur_unit else 1
                ttb_datas.append(exc.ttb)
                tts_datas.append(exc.tts)
                deal_bas_rs.append(exc.deal_bas_r)
                cur_dates.append(str(exc.cur_date))

            if '한국' not in cur_nm_unit:
                chart_data.append(get_data(cur_unit, cur_unit_num, cur_nm_unit, deal_bas_rs, cur_dates, ttb_datas, tts_datas))

        return chart_data
    except Exception as e:
        print(e)
    
    return []

def get_data(cur_unit, cur_unit_num, cur_nm_unit, deal_bas_rs, cur_dates, ttb_datas, tts_datas):
    max_deal_bas_r, max_cur_date = max(zip(deal_bas_rs, cur_dates))
    min_deal_bas_r, min_cur_date = min(zip(deal_bas_rs, cur_dates))
    today_deal_bas_r, today_cur_date = deal_bas_rs[-1], cur_dates[-1]
    avg_deal_bas_r = sum(deal_bas_rs) / len(deal_bas_rs)
    
    return {
        'cur_unit': cur_unit,
        'cur_unit_num': cur_unit_num,
        'cur_nm_unit': cur_nm_unit,
        'ttb_datas': ttb_datas,
        'tts_datas': tts_datas,
        'deal_bas_rs': deal_bas_rs,
        'cur_dates': cur_dates,
        'max_deal_bas_r': max_deal_bas_r,
        'max_cur_date': max_cur_date,
        'min_deal_bas_r': min_deal_bas_r,
        'min_cur_date': min_cur_date,
        'today_deal_bas_r': today_deal_bas_r,
        'today_cur_date': today_cur_date,
        'avg_deal_bas_r': round(avg_deal_bas_r, 2)
    }
