from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import FarmRecord
from .serializers import FarmRecordSerializer


class IsOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.farmer == request.user


class FarmRecordViewSet(viewsets.ModelViewSet):
    serializer_class = FarmRecordSerializer
    permission_classes = [IsOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['farm_name', 'seed_variety', 'location_description', 'notes']
    ordering_fields = ['created_at', 'planting_date', 'farm_name', 'area']
    ordering = ['-created_at']

    def get_queryset(self):
        return FarmRecord.objects.filter(farmer=self.request.user).select_related('crop', 'farmer')
