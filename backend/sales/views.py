from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Sale
from .serializers import SaleSerializer


class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sale_date', 'total_revenue']
    ordering = ['-sale_date']

    def get_queryset(self):
        qs = Sale.objects.filter(farm__farmer=self.request.user).select_related('farm')
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        return qs
