from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Harvest
from .serializers import HarvestSerializer


class HarvestViewSet(viewsets.ModelViewSet):
    serializer_class = HarvestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['harvest_date', 'quantity']
    ordering = ['-harvest_date']

    def get_queryset(self):
        qs = Harvest.objects.filter(farm__farmer=self.request.user).select_related('farm')
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        return qs
