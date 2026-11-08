"""
Custom User model and Farmer profile for FarmHelper Ethiopia.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user for FarmHelper Ethiopia.
    Username is optional; email is the primary identifier.
    """
    class Role(models.TextChoices):
        FARMER = 'farmer', _('Farmer')
        OFFICER = 'officer', _('Agricultural Officer')
        ADMIN = 'admin', _('Admin')

    class PreferredLanguage(models.TextChoices):
        ENGLISH = 'en', _('English')
        AFAAN_OROMOO = 'om', _('Afaan Oromoo')
        AMHARIC = 'am', _('Amharic')

    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    full_name = models.CharField(max_length=255)
    preferred_language = models.CharField(
        max_length=5,
        choices=PreferredLanguage.choices,
        default=PreferredLanguage.ENGLISH,
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.FARMER,
    )
    region = models.CharField(max_length=100, blank=True)
    zone = models.CharField(max_length=100, blank=True)
    woreda = models.CharField(max_length=100, blank=True)
    kebele = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name or self.email

    @property
    def display_name(self):
        return self.full_name or self.email
