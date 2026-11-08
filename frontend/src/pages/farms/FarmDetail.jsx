import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { farmsAPI } from '../../services/api'

export default function FarmDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [farm, setFarm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    farmsAPI.get(id)
      .then((res) => setFarm(res.data))
      .catch(() => setError('Farm not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    try {
      await farmsAPI.remove(id)
      navigate('/app/farms')
    } catch {
      setError('Could not delete farm.')
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>
  if (error || !farm) return <div className="rounded-lg bg-red-50 p-4 text-red-700">{error || 'Not found'}</div>

  const rows = [
    { label: 'Crop', value: farm.crop_detail?.name },
    { label: 'Area', value: `${farm.area} ${farm.area_unit}` },
    { label: 'Location', value: farm.location_description || '—' },
    { label: 'Planting date', value: farm.planting_date || '—' },
    { label: 'Expected harvest', value: farm.expected_harvest_date || '—' },
    { label: 'Seed variety', value: farm.seed_variety || '—' },
    { label: 'Soil type', value: farm.soil_type || '—' },
    { label: 'Irrigation', value: farm.irrigation_method || '—' },
    { label: 'Notes', value: farm.notes || '—' },
    { label: 'Created', value: new Date(farm.created_at).toLocaleString() },
  ]

  return (
    <div>
      <Link to="/app/farms" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to farms
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest">{farm.farm_name}</h1>
          <p className="text-sm text-muted">{farm.crop_detail?.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/app/farms/${id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-2 text-sm font-medium text-forest hover:bg-beige"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-beige bg-white p-5 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">{r.label}</dt>
              <dd className="mt-0.5 text-sm text-charcoal whitespace-pre-wrap">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-forest">Delete this farm?</h2>
            <p className="mt-2 text-sm text-muted">
              This will permanently remove the farm and its related expenses, harvests, and sales. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-beige"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
