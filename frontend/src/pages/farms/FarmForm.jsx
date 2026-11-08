import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { farmsAPI, cropsAPI } from '../../services/api'
import { ArrowLeft } from 'lucide-react'

export default function FarmForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [crops, setCrops] = useState([])
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      area_unit: 'ha',
      irrigation_method: 'rainfed',
    },
  })

  useEffect(() => {
    cropsAPI.list().then((res) => {
      const list = res.data.results || res.data
      setCrops(list)
    })
  }, [])

  useEffect(() => {
    if (isEdit) {
      farmsAPI.get(id).then((res) => {
        const f = res.data
        reset({
          farm_name: f.farm_name,
          crop: f.crop,
          location_description: f.location_description || '',
          area: f.area,
          area_unit: f.area_unit,
          planting_date: f.planting_date || '',
          expected_harvest_date: f.expected_harvest_date || '',
          seed_variety: f.seed_variety || '',
          soil_type: f.soil_type || '',
          irrigation_method: f.irrigation_method || 'rainfed',
          notes: f.notes || '',
        })
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data) => {
    setServerError('')
    const payload = {
      ...data,
      area: Number(data.area),
      crop: Number(data.crop),
      planting_date: data.planting_date || null,
      expected_harvest_date: data.expected_harvest_date || null,
    }
    try {
      if (isEdit) {
        await farmsAPI.update(id, payload)
      } else {
        await farmsAPI.create(payload)
      }
      navigate('/app/farms')
    } catch (err) {
      const msg = err.response?.data
      setServerError(typeof msg === 'object' ? JSON.stringify(msg) : 'Save failed.')
    }
  }

  return (
    <div>
      <Link to="/app/farms" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to farms
      </Link>
      <h1 className="text-2xl font-bold text-forest">{isEdit ? 'Edit farm' : 'Add farm'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-xl space-y-4">
        {serverError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}

        <div>
          <label className="block text-sm font-medium">Farm name *</label>
          <input
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            {...register('farm_name', { required: 'Required' })}
          />
          {errors.farm_name && <p className="mt-1 text-xs text-red-600">{errors.farm_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Crop *</label>
          <select
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            {...register('crop', { required: 'Required' })}
          >
            <option value="">Select crop</option>
            {crops.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.crop && <p className="mt-1 text-xs text-red-600">{errors.crop.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Field size *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('area', { required: 'Required', min: { value: 0.01, message: 'Must be positive' } })}
            />
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Unit</label>
            <select
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('area_unit')}
            >
              <option value="ha">Hectares</option>
              <option value="acre">Acres</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Location description</label>
          <input
            placeholder="Village, field name, or landmark"
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            {...register('location_description')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Planting date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('planting_date')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Expected harvest</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('expected_harvest_date')}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Seed variety</label>
            <input
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('seed_variety')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Soil type</label>
            <input
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              {...register('soil_type')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Irrigation</label>
          <select
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            {...register('irrigation_method')}
          >
            <option value="rainfed">Rainfed</option>
            <option value="irrigation">Irrigation</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            {...register('notes')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : isEdit ? 'Update farm' : 'Create farm'}
          </button>
          <Link to="/app/farms" className="rounded-lg border border-beige px-5 py-2.5 text-sm font-medium text-muted hover:bg-beige">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
