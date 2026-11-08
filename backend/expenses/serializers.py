from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Expense
        fields = (
            'id', 'client_id', 'farm', 'farm_name', 'category', 'category_display',
            'amount', 'currency', 'date', 'description', 'is_synced',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_synced')

    def validate_farm(self, value):
        if value.farmer != self.context['request'].user:
            raise serializers.ValidationError('You can only add expenses to your own farms.')
        return value
