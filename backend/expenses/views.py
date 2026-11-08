from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'category']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        qs = Expense.objects.filter(farm__farmer=self.request.user).select_related('farm')
        farm_id = self.request.query_params.get('farm')
        category = self.request.query_params.get('category')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        if category:
            qs = qs.filter(category=category)
        return qs
