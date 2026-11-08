from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from decimal import Decimal
from farms.models import FarmRecord
from expenses.models import Expense
from sales.models import Sale
from harvests.models import Harvest


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        farms = FarmRecord.objects.filter(farmer=user)
        farm_count = farms.count()
        total_area = sum((f.area_in_hectares for f in farms), Decimal('0'))

        expenses_agg = Expense.objects.filter(farm__farmer=user).aggregate(
            total=Sum('amount'),
            count=Count('id'),
        )
        sales_agg = Sale.objects.filter(farm__farmer=user).aggregate(
            total=Sum('total_revenue'),
            count=Count('id'),
        )
        harvest_count = Harvest.objects.filter(farm__farmer=user).count()

        total_expenses = expenses_agg['total'] or Decimal('0')
        total_sales = sales_agg['total'] or Decimal('0')
        estimated_profit = total_sales - total_expenses

        recent_farms = farms.select_related('crop').order_by('-created_at')[:5]
        recent_data = [
            {
                'id': f.id,
                'farm_name': f.farm_name,
                'crop': f.crop.name if f.crop else None,
                'area': str(f.area),
                'area_unit': f.area_unit,
                'planting_date': f.planting_date,
                'created_at': f.created_at,
            }
            for f in recent_farms
        ]

        # Simple monthly summary (last 6 months based on expense/sale dates)
        from django.utils import timezone
        from datetime import timedelta
        six_months_ago = timezone.now().date() - timedelta(days=180)

        monthly_expenses = (
            Expense.objects.filter(farm__farmer=user, date__gte=six_months_ago)
            .values('date__year', 'date__month')
            .annotate(total=Sum('amount'))
            .order_by('date__year', 'date__month')
        )
        monthly_sales = (
            Sale.objects.filter(farm__farmer=user, sale_date__gte=six_months_ago)
            .values('sale_date__year', 'sale_date__month')
            .annotate(total=Sum('total_revenue'))
            .order_by('sale_date__year', 'sale_date__month')
        )

        return Response({
            'farmer_name': user.full_name or user.email,
            'farm_count': farm_count,
            'total_area_hectares': str(round(total_area, 2)),
            'total_expenses': str(total_expenses),
            'total_sales': str(total_sales),
            'estimated_profit': str(estimated_profit),
            'expense_count': expenses_agg['count'] or 0,
            'sale_count': sales_agg['count'] or 0,
            'harvest_count': harvest_count,
            'recent_farms': recent_data,
            'monthly_expenses': [
                {'year': m['date__year'], 'month': m['date__month'], 'total': str(m['total'])}
                for m in monthly_expenses
            ],
            'monthly_sales': [
                {'year': m['sale_date__year'], 'month': m['sale_date__month'], 'total': str(m['total'])}
                for m in monthly_sales
            ],
            'note': 'Profit is calculated only from recorded sales and expenses.',
        })
