'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const emptyForm = {
  name: '',
  brand: '',
  type: 'Sedan',
  seats: 5,
  price_per_day: '',
  location: '',
  image_url: '',
  available: true,
}

const statusConfig = {
  PENDING:   { style: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', dot: 'bg-yellow-400' },
  CONFIRMED: { style: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', dot: 'bg-emerald-400' },
  CANCELLED: { style: 'bg-red-500/20 text-red-300 border border-red-500/30', dot: 'bg-red-400' },
  COMPLETED: { style: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', dot: 'bg-gray-400' },
}

export default function AdminPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState('overview')
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (!loading) {
      if (!user || userData?.role !== 'admin') router.push('/')
      else { fetchCars(); fetchBookings() }
    }
  }, [user, userData, loading])

  const fetchCars = async () => {
    const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
    setCars(data || [])
  }

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, cars(name, image_url)')
      .order('created_at', { ascending: false })
    setBookings(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    let image_url = form.image_url

    if (imageFile) {
      const { data: upload } = await supabase.storage
        .from('car-images')
        .upload(`${Date.now()}_${imageFile.name}`, imageFile)
      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(upload.path)
      image_url = publicUrl
    }

    const payload = { ...form, seats: Number(form.seats), price_per_day: Number(form.price_per_day), image_url }

    if (editId) await supabase.from('cars').update(payload).eq('id', editId)
    else await supabase.from('cars').insert([payload])

    setForm(emptyForm); setEditId(null); setImageFile(null)
    await fetchCars()
    setSubmitting(false)
    setTab('cars')
  }

  const handleEdit = (car) => {
    setForm({
      name: car.name, brand: car.brand, type: car.type, seats: car.seats,
      price_per_day: car.price_per_day, location: car.location,
      image_url: car.image_url || '', available: car.available,
    })
    setEditId(car.id)
    setTab('add-car')
  }

  const handleDelete = async (id) => {
    await supabase.from('cars').delete().eq('id', id)
    setDeleteId(null)
    fetchCars()
  }

  const updateBookingStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const confirmedRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((s, b) => s + (b.total_price || 0), 0)

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition'

  const tabItems = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'cars',     label: '🚗 Fleet' },
    { id: 'add-car',  label: editId ? '✏️ Edit Car' : '➕ Add Car' },
    { id: 'bookings', label: '📋 Bookings' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm mt-1">Manage your fleet and bookings</p>
          </div>
          <span className="bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold px-4 py-2 rounded-full">
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {tabItems.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🚗', label: 'Total Cars',    value: cars.length },
                { icon: '📋', label: 'Total Bookings', value: bookings.length },
                { icon: '✅', label: 'Confirmed',      value: bookings.filter((b) => b.status === 'CONFIRMED').length },
                { icon: '💰', label: 'Revenue',        value: `₹${confirmedRevenue}` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-white font-bold text-lg mb-5">Recent Bookings</h2>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => {
                  const cfg = statusConfig[b.status] || statusConfig.PENDING
                  return (
                    <div key={b.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        {b.cars?.image_url && (
                          <img src={b.cars.image_url} className="w-10 h-7 object-cover rounded-lg border border-white/10" alt="" />
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">{b.cars?.name || b.car_name}</p>
                          <p className="text-white/40 text-xs">{b.start_date} → {b.end_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold text-sm">₹{b.total_price}</span>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {b.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {bookings.length === 0 && (
                  <p className="text-white/30 text-sm text-center py-6">No bookings yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FLEET ── */}
        {tab === 'cars' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">Fleet ({cars.length} cars)</h2>
              <button
                onClick={() => { setForm(emptyForm); setEditId(null); setTab('add-car') }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                + Add Car
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Car', 'Type', 'Location', 'Price/Day', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.image_url || 'https://via.placeholder.com/60x40?text=Car'}
                            className="w-14 h-10 object-cover rounded-xl border border-white/10"
                            alt={car.name}
                          />
                          <div>
                            <p className="text-white font-semibold">{car.name}</p>
                            <p className="text-white/40 text-xs">{car.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">{car.type}</td>
                      <td className="px-6 py-4 text-white/60">{car.location}</td>
                      <td className="px-6 py-4 text-blue-400 font-bold">₹{car.price_per_day}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${car.available ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                          {car.available ? 'Available' : 'Rented'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(car)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                          >
                            Edit
                          </button>
                          {deleteId === car.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs">Sure?</span>
                              <button onClick={() => handleDelete(car.id)} className="text-red-400 text-xs hover:text-red-300 font-medium">Yes</button>
                              <button onClick={() => setDeleteId(null)} className="text-white/40 text-xs hover:text-white/60">No</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(car.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cars.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-3">🚗</p>
                  <p>No cars in the fleet yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADD / EDIT CAR ── */}
        {tab === 'add-car' && (
          <div className="max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h2 className="text-white font-bold text-xl mb-7">
                {editId ? '✏️ Edit Car' : '➕ Add New Car'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Car Name</label>
                    <input required placeholder="e.g. Toyota Camry" className={inputClass}
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Brand</label>
                    <input required placeholder="e.g. Toyota" className={inputClass}
                      value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Type</label>
                    <select className={inputClass} value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      {['Sedan', 'SUV', 'Hatchback', 'Luxury'].map((t) => (
                        <option key={t} className="bg-gray-900">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Seats</label>
                    <input type="number" min={1} max={12} required className={inputClass}
                      value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Price / Day (₹)</label>
                    <input type="number" min={1} required placeholder="e.g. 80" className={inputClass}
                      value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Location</label>
                    <input required placeholder="e.g. Mumbai" className={inputClass}
                      value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Car Image</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-300 file:text-xs file:font-medium hover:file:bg-blue-500/30 transition" />
                  <p className="text-white/30 text-xs mt-2">Or paste an image URL:</p>
                  <input placeholder="https://..." className={`${inputClass} mt-1.5`}
                    value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${form.available ? 'bg-blue-600 border-blue-600' : 'border-white/30 bg-transparent'}`}
                    onClick={() => setForm({ ...form, available: !form.available })}>
                    {form.available && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-white/60 text-sm group-hover:text-white/80 transition">
                    Available for booking
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition">
                    {submitting ? 'Saving...' : editId ? 'Update Car' : 'Add Car'}
                  </button>
                  <button type="button"
                    onClick={() => { setForm(emptyForm); setEditId(null); setTab('cars') }}
                    className="px-5 bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'bookings' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">All Bookings ({bookings.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Car', 'Customer', 'Dates', 'Days', 'Amount', 'Status', 'Update'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const cfg = statusConfig[b.status] || statusConfig.PENDING
                    const days = b.start_date && b.end_date
                      ? Math.max(1, Math.ceil((new Date(b.end_date) - new Date(b.start_date)) / (1000 * 60 * 60 * 24)))
                      : '—'
                    return (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {b.cars?.image_url && (
                              <img src={b.cars.image_url} className="w-12 h-8 object-cover rounded-lg border border-white/10" alt="" />
                            )}
                            <span className="text-white font-medium">{b.cars?.name || b.car_name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/60">{b.user_name || b.user_id?.slice(0, 8) + '...'}</td>
                        <td className="px-6 py-4 text-white/60 whitespace-nowrap text-xs">
                          {b.start_date} → {b.end_date}
                        </td>
                        <td className="px-6 py-4 text-white/60">{days}</td>
                        <td className="px-6 py-4 text-blue-400 font-bold">₹{b.total_price}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1 w-fit text-xs font-medium px-2.5 py-1 rounded-full ${cfg.style}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500/50"
                          >
                            {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((s) => (
                              <option key={s} className="bg-gray-900">{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-3">📋</p>
                  <p>No bookings yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}