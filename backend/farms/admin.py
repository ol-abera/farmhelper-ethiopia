from django.contrib import admin
from .models import FarmRecord


@admin.register(FarmRecord)
class FarmRecordAdmin(admin.ModelAdmin):
    list_display = ('farm_name', 'farmer', 'crop', 'area', 'area_unit', 'planting_date', 'created_at')
    list_filter = ('crop', 'area_unit', 'irrigation_method')
    search_fields = ('farm_name', 'farmer__full_name', 'farmer__email', 'seed_variety')
    raw_id_fields = ('farmer', 'crop')
