from rest_framework import serializers
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)

    class Meta:
        model = Sale
        fields = (
            'id', 'client_id', 'farm', 'farm_name', 'sale_date',
            'quantity', 'unit', 'price_per_unit', 'total_revenue',
            'currency', 'buyer_name', 'notes', 'is_synced',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'total_revenue', 'created_at', 'updated_at', 'is_synced')

    def validate_farm(self, value):
        if value.farmer != self.context['request'].user:
            raise serializers.ValidationError('You can only record sales for your own farms.')
        return value
