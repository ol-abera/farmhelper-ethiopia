import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Tractor } from 'lucide-react'
import { farmsAPI } from '../../services/api'

export default function FarmsList() {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    farmsAPI.list({ search: search || undefined })
      .then((res) => setFarms(res.data.results || res.data))
      .catch(() => setError('Failed to load farms.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest">Farms</h1>
          <p className="text-sm text-muted">Manage your farm records</p>
        </div>
        <Link
          to="/app/farms/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest"
        >
          <Plus className="h-4 w-4" />
          Add farm
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, variety, location…"
            className="w-full rounded-lg border border-beige bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button type="submit" className="rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-forest hover:bg-beige">
          Search
        </button>
      </form>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : farms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
          <Tractor className="mx-auto h-10 w-10 text-primary/50" />
          <p className="mt-3 font-medium text-forest">No farm records found</p>
          <Link to="/app/farms/new" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Create your first farm
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {farms.map((f) => (
            <Link
              key={f.id}
              to={`/app/farms/${f.id}`}
              className="flex items-center justify-between rounded-xl border border-beige bg-white px-4 py-4 shadow-sm hover:border-primary/30 transition"
            >
              <div>
                <p className="font-semibold text-forest">{f.farm_name}</p>
                <p className="text-sm text-muted">
                  {f.crop_detail?.name || 'Crop'} · {f.area} {f.area_unit}
                  {f.seed_variety ? ` · ${f.seed_variety}` : ''}
                </p>
              </div>
              <div className="text-right text-xs text-muted">
                {f.planting_date && <p>Planted: {f.planting_date}</p>}
                <p className="mt-0.5">{new Date(f.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
