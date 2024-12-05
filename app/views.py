from django.utils import timezone
from django.shortcuts import render
from django.http import JsonResponse
from datetime import datetime, timedelta
from .services import get_chart_data, get_unit_data, get_data

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
