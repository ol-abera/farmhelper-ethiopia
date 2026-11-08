from rest_framework import serializers
from .models import Harvest


class HarvestSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)

    class Meta:
        model = Harvest
        fields = (
            'id', 'client_id', 'farm', 'farm_name', 'harvest_date',
            'quantity', 'unit', 'quality_notes', 'is_synced',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_synced')

    def validate_farm(self, value):
        if value.farmer != self.context['request'].user:
            raise serializers.ValidationError('You can only record harvests for your own farms.')
        return value
