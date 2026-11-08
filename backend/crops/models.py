from django.db import models
from django.utils.translation import gettext_lazy as _


class Crop(models.Model):
    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    suitable_conditions = models.TextField(blank=True, help_text='Demo/sample info until verified locally')
    planting_period = models.CharField(max_length=255, blank=True)
    growth_stages = models.TextField(blank=True)
    harvest_period = models.CharField(max_length=255, blank=True)
    recommended_practices = models.TextField(blank=True, help_text='Sample content only')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = _('crop')
        verbose_name_plural = _('crops')

    def __str__(self):
        return self.name
