from django.contrib import admin
from .models import Crop


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'scientific_name', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'scientific_name')
