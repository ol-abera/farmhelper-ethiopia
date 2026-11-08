from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmRecordViewSet

router = DefaultRouter()
router.register('', FarmRecordViewSet, basename='farm')

urlpatterns = [
    path('', include(router.urls)),
]
