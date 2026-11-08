from django.contrib import admin
from .models import Harvest


@admin.register(Harvest)
class HarvestAdmin(admin.ModelAdmin):
    list_display = ('farm', 'harvest_date', 'quantity', 'unit', 'created_at')
    list_filter = ('unit',)
