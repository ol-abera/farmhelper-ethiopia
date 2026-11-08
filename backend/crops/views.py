from rest_framework import viewsets, permissions
from .models import Crop
from .serializers import CropSerializer


class CropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Crop.objects.filter(is_active=True)
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
