from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropViewSet

router = DefaultRouter()
router.register('', CropViewSet, basename='crop')

urlpatterns = [
    path('', include(router.urls)),
]
