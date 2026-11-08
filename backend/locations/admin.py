from django.contrib import admin
from .models import Region, Zone, Woreda


class ZoneInline(admin.TabularInline):
    model = Zone
    extra = 0


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_om', 'name_am')
    inlines = [ZoneInline]


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'region')
    list_filter = ('region',)


@admin.register(Woreda)
class WoredaAdmin(admin.ModelAdmin):
    list_display = ('name', 'zone')
    list_filter = ('zone__region',)
