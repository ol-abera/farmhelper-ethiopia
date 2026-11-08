from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HarvestViewSet

router = DefaultRouter()
router.register('', HarvestViewSet, basename='harvest')

urlpatterns = [
    path('', include(router.urls)),
]
