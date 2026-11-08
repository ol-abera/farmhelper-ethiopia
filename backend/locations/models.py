from django.db import models


class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_om = models.CharField(max_length=100, blank=True, help_text='Afaan Oromoo')
    name_am = models.CharField(max_length=100, blank=True, help_text='Amharic')

    def __str__(self):
        return self.name


class Zone(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='zones')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('region', 'name')

    def __str__(self):
        return f"{self.name} ({self.region.name})"


class Woreda(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='woredas')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('zone', 'name')

    def __str__(self):
        return self.name
