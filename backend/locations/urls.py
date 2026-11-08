from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Region


@api_view(['GET'])
@permission_classes([AllowAny])
def region_list(request):
    regions = Region.objects.all().values('id', 'name', 'name_om', 'name_am')
    return Response(list(regions))


urlpatterns = [
    path('regions/', region_list, name='region-list'),
]
