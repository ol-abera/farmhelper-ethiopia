from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal


class Expense(models.Model):
    class Category(models.TextChoices):
        SEEDS = 'seeds', _('Seeds')
        FERTILIZER = 'fertilizer', _('Fertilizer')
        LABOR = 'labor', _('Labor')
        IRRIGATION = 'irrigation', _('Irrigation')
        EQUIPMENT = 'equipment', _('Equipment')
        TRANSPORTATION = 'transportation', _('Transportation')
        PESTICIDES = 'pesticides', _('Pesticides')
        OTHER = 'other', _('Other')

    farm = models.ForeignKey(
        'farms.FarmRecord',
        on_delete=models.CASCADE,
        related_name='expenses',
    )
    category = models.CharField(max_length=30, choices=Category.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='ETB')
    date = models.DateField()
    description = models.TextField(blank=True)
    client_id = models.UUIDField(null=True, blank=True, unique=True)
    is_synced = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = _('expense')
        verbose_name_plural = _('expenses')

    def __str__(self):
        return f"{self.get_category_display()} - {self.amount} {self.currency}"
