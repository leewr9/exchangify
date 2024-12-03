from django.db import models

class Exchange(models.Model):
    cur_unit = models.CharField(max_length=10)
    ttb = models.FloatField(default=0.0)
    tts = models.FloatField(default=0.0)
    deal_bas_r = models.FloatField()
    cur_nm = models.CharField(max_length=100)
    cur_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.cur_nm} ({self.cur_date})"
    
    def __dict__(self):
        return {
            'cur_unit': self.cur_unit,
            'cur_nm': self.cur_nm,
            'ttbs': [],
            'ttss': [],
            'deal_bas_rs': [],
            'cur_dates': []
        }