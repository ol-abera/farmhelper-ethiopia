from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('farm', 'category', 'amount', 'currency', 'date', 'created_at')
    list_filter = ('category', 'currency')
    search_fields = ('description', 'farm__farm_name')
