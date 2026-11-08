from django.contrib import admin
from .models import Sale


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('farm', 'sale_date', 'quantity', 'unit', 'price_per_unit', 'total_revenue', 'buyer_name')
    list_filter = ('unit',)
