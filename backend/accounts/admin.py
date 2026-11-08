from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'preferred_language', 'region', 'is_active', 'created_at')
    list_filter = ('role', 'preferred_language', 'is_active', 'region')
    search_fields = ('email', 'full_name', 'phone', 'region', 'woreda')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('full_name', 'phone', 'preferred_language')}),
        (_('Location'), {'fields': ('region', 'zone', 'woreda', 'kebele')}),
        (_('Permissions'), {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'role'),
        }),
    )
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
