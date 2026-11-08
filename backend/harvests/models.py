from django.db import models
from django.utils.translation import gettext_lazy as _


class Harvest(models.Model):
    class Unit(models.TextChoices):
        QUINTAL = 'quintal', _('Quintal')
        KILOGRAM = 'kg', _('Kilogram')
        TON = 'ton', _('Ton')

    farm = models.ForeignKey(
        'farms.FarmRecord',
        on_delete=models.CASCADE,
        related_name='harvests',
    )
    harvest_date = models.DateField()
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=20, choices=Unit.choices, default=Unit.QUINTAL)
    quality_notes = models.TextField(blank=True)
    client_id = models.UUIDField(null=True, blank=True, unique=True)
    is_synced = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-harvest_date']
        verbose_name = _('harvest')
        verbose_name_plural = _('harvests')

    def __str__(self):
        return f"{self.quantity} {self.unit} - {self.farm.farm_name}"
