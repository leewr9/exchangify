from django.contrib import admin
from .models import Exchange

class ExchangeAdmin(admin.ModelAdmin):
    list_display = ('cur_unit', 'cur_nm', 'deal_bas_r', 'ttb', 'tts', 'cur_date')
    search_fields = ('cur_unit', 'cur_date')

# Register your models here.
admin.site.register(Exchange, ExchangeAdmin)


