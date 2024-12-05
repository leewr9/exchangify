from django.db import models

class Exchange(models.Model):
    cur_unit = models.CharField(max_length=10, verbose_name='화폐 단위')
    cur_nm = models.CharField(max_length=100, verbose_name='화폐 이름')
    deal_bas_r = models.FloatField(verbose_name='현재 환율')
    ttb = models.FloatField(default=0.0, verbose_name='사실 때')
    tts = models.FloatField(default=0.0, verbose_name='파실 때')
    cur_date = models.DateField(auto_now_add=True, verbose_name='날짜')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cur_unit', 'cur_date'],
                name='cur_unit_date'
            )
        ]

    def __str__(self):
        return f"{self.cur_unit} {self.cur_nm} - {self.cur_date}"