from rest_framework import serializers
from .models import FarmRecord
from crops.serializers import CropSerializer


class FarmRecordSerializer(serializers.ModelSerializer):
    crop_detail = CropSerializer(source='crop', read_only=True)
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)

    class Meta:
        model = FarmRecord
        fields = (
            'id', 'client_id', 'farm_name', 'crop', 'crop_detail',
            'farmer', 'farmer_name', 'location_description',
            'area', 'area_unit', 'planting_date', 'expected_harvest_date',
            'seed_variety', 'soil_type', 'irrigation_method', 'notes',
            'is_synced', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'farmer', 'created_at', 'updated_at', 'is_synced')

    def create(self, validated_data):
        validated_data['farmer'] = self.context['request'].user
        return super().create(validated_data)
