from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal


class Sale(models.Model):
    class Unit(models.TextChoices):
        QUINTAL = 'quintal', _('Quintal')
        KILOGRAM = 'kg', _('Kilogram')
        TON = 'ton', _('Ton')

    farm = models.ForeignKey(
        'farms.FarmRecord',
        on_delete=models.CASCADE,
        related_name='sales',
    )
    sale_date = models.DateField()
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=20, choices=Unit.choices, default=Unit.QUINTAL)
    price_per_unit = models.DecimalField(max_digits=12, decimal_places=2)
    total_revenue = models.DecimalField(max_digits=14, decimal_places=2, editable=False)
    currency = models.CharField(max_length=3, default='ETB')
    buyer_name = models.CharField(max_length=150, blank=True)
    notes = models.TextField(blank=True)
    client_id = models.UUIDField(null=True, blank=True, unique=True)
    is_synced = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-sale_date']
        verbose_name = _('sale')
        verbose_name_plural = _('sales')

    def save(self, *args, **kwargs):
        self.total_revenue = (self.quantity or Decimal('0')) * (self.price_per_unit or Decimal('0'))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} {self.unit} @ {self.price_per_unit} - {self.farm.farm_name}"
