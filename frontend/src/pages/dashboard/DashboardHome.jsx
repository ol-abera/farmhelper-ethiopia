import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tractor, Wallet, TrendingUp, Sprout, Plus } from 'lucide-react'
import { dashboardAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardAPI.summary()
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="py-12 text-center text-muted">Loading dashboard…</div>
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
  }

  const stats = [
    { label: 'Farms', value: data.farm_count, icon: Tractor, color: 'text-primary' },
    { label: 'Area (ha)', value: data.total_area_hectares, icon: Sprout, color: 'text-fresh' },
    { label: 'Expenses (ETB)', value: Number(data.total_expenses).toLocaleString(), icon: Wallet, color: 'text-amber' },
    { label: 'Sales (ETB)', value: Number(data.total_sales).toLocaleString(), icon: TrendingUp, color: 'text-primary' },
  ]

  const hasFarms = data.farm_count > 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest">
          Welcome, {data.farmer_name || user?.full_name}
        </h1>
        <p className="mt-1 text-muted">Here is an overview of your farm activity.</p>
      </div>

      {!hasFarms ? (
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-10 text-center">
          <Tractor className="mx-auto h-12 w-12 text-primary/60" />
          <h2 className="mt-4 text-lg font-semibold text-forest">No farms yet</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            Create your first farm record to start tracking area, expenses, harvests, and sales.
          </p>
          <Link
            to="/app/farms/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest"
          >
            <Plus className="h-4 w-4" />
            Add first farm
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-beige bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted">{s.label}</p>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="mt-2 text-2xl font-bold text-forest">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-beige bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-forest">Estimated profit</h2>
              <span className="text-xs text-muted">From recorded sales − expenses</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${Number(data.estimated_profit) >= 0 ? 'text-primary' : 'text-red-600'}`}>
              {Number(data.estimated_profit).toLocaleString()} ETB
            </p>
            <p className="mt-1 text-xs text-muted">{data.note}</p>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-forest">Recent farms</h2>
              <Link to="/app/farms" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {data.recent_farms.map((f) => (
                <Link
                  key={f.id}
                  to={`/app/farms/${f.id}`}
                  className="flex items-center justify-between rounded-xl border border-beige bg-white px-4 py-3 shadow-sm hover:border-primary/30 transition"
                >
                  <div>
                    <p className="font-medium text-forest">{f.farm_name}</p>
                    <p className="text-xs text-muted">{f.crop} · {f.area} {f.area_unit}</p>
                  </div>
                  <span className="text-xs text-muted">
                    {f.planting_date || 'No planting date'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/app/farms/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest"
            >
              <Plus className="h-4 w-4" />
              Add farm
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
