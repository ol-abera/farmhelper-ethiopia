from rest_framework import serializers
from .models import Crop


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = (
            'id', 'name', 'scientific_name', 'description',
            'suitable_conditions', 'planting_period', 'growth_stages',
            'harvest_period', 'recommended_practices', 'is_active',
        )
