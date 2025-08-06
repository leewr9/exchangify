from django.utils import timezone
from django.shortcuts import render
from django.http import JsonResponse
from .services import fetch_chart_data, parse_date_string, get_date_range


# View to display the chart for today with a default range of 90 days
def render_today_chart(request):
    start_date, end_date = get_date_range(90)
    exchange_data = fetch_chart_data(start_date, end_date)

    context = {"exchange_data": exchange_data, "timestamp": timezone.now()}
    return render(request, "main.html", context)


# View to render a detailed chart based on search parameters
def render_detail_chart(request):
    if request.method != "GET":
        return JsonResponse(
            {"status": "error", "message": "Invalid request"}, status=400
        )

    start_date, end_date = get_date_range(30)
    search_param = request.GET.get("search")
    search_data = fetch_chart_data(start_date, end_date, search_param)
    exchange_data = fetch_chart_data(start_date, end_date)

    context = {
        "search_data": search_data,
        "exchange_data": exchange_data,
        "current_unit": search_param,
        "timestamp": timezone.now(),
    }
    return render(request, "detail.html", context)


# View to update chart data based on the selected date range and unit
def update_chart_data(request):
    if request.method != "POST":
        return JsonResponse(
            {"status": "error", "message": "Invalid request"}, status=400
        )

    start_date = parse_date_string(request.POST.get("start_date"))
    end_date = parse_date_string(request.POST.get("end_date"))
    current_unit = request.POST.get("current_unit")

    search_data = fetch_chart_data(start_date, end_date, current_unit)
    exchange_data = fetch_chart_data(start_date, end_date)

    context = {
        "search_data": search_data,
        "exchange_data": exchange_data,
        "timestamp": timezone.now(),
    }
    return JsonResponse(context, safe=False)
