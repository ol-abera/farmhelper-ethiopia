from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal


class FarmRecord(models.Model):
    class AreaUnit(models.TextChoices):
        HECTARE = 'ha', _('Hectares')
        ACRE = 'acre', _('Acres')

    class IrrigationMethod(models.TextChoices):
        RAINFED = 'rainfed', _('Rainfed')
        IRRIGATION = 'irrigation', _('Irrigation')
        MIXED = 'mixed', _('Mixed')

    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='farms',
    )
    crop = models.ForeignKey(
        'crops.Crop',
        on_delete=models.PROTECT,
        related_name='farm_records',
    )
    farm_name = models.CharField(max_length=150)
    location_description = models.CharField(max_length=255, blank=True, help_text='Village or field description')
    area = models.DecimalField(max_digits=10, decimal_places=2)
    area_unit = models.CharField(max_length=10, choices=AreaUnit.choices, default=AreaUnit.HECTARE)
    planting_date = models.DateField(null=True, blank=True)
    expected_harvest_date = models.DateField(null=True, blank=True)
    seed_variety = models.CharField(max_length=100, blank=True)
    soil_type = models.CharField(max_length=100, blank=True)
    irrigation_method = models.CharField(
        max_length=20,
        choices=IrrigationMethod.choices,
        blank=True,
        default=IrrigationMethod.RAINFED,
    )
    notes = models.TextField(blank=True)
    # Offline sync support
    client_id = models.UUIDField(null=True, blank=True, unique=True, help_text='Client-generated ID for offline records')
    is_synced = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('farm record')
        verbose_name_plural = _('farm records')
        indexes = [
            models.Index(fields=['farmer', '-created_at']),
            models.Index(fields=['client_id']),
        ]

    def __str__(self):
        return f"{self.farm_name} ({self.crop.name})"

    @property
    def area_in_hectares(self):
        if self.area_unit == self.AreaUnit.ACRE:
            return self.area * Decimal('0.404686')
        return self.area
