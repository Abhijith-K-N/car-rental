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

const statusStyle = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
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

  useEffect(() => {
    if (!loading) {
      if (!user || userData?.role !== 'admin') router.push('/')
      else {
        fetchCars()
        fetchBookings()
      }
    }
  }, [user, userData, loading])

  const fetchCars = async () => {
    const { data } = await supabase.from('cars').select('*')
    setCars(data || [])
  }

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
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

    const payload = {
      ...form,
      seats: Number(form.seats),
      price_per_day: Number(form.price_per_day),
      image_url,
    }

    if (editId) {
      await supabase.from('cars').update(payload).eq('id', editId)
    } else {
      await supabase.from('cars').insert([payload])
    }

    setForm(emptyForm)
    setEditId(null)
    setImageFile(null)
    await fetchCars()
    setSubmitting(false)
    setTab('cars')
  }

  const handleEdit = (car) => {
    setForm({
      name: car.name,
      brand: car.brand,
      type: car.type,
      seats: car.seats,
      price_per_day: car.price_per_day,
      location: car.location,
      image_url: car.image_url || '',
      available: car.available,
    })
    setEditId(car.id)
    setTab('add-car')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this car permanently?')) return
    await supabase.from('cars').delete().eq('id', id)
    fetchCars()
  }

  const updateBookingStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }

  const confirmedRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((s, b) => s + (b.total_price || 0), 0)

  const tabs = ['overview', 'cars', 'add-car', 'bookings']

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'cars' &&
        cars.map((car) => (
          <div key={car.id}>
            {car.name} - ₹{car.price_per_day}
            <button onClick={() => handleEdit(car)}>Edit</button>
            <button onClick={() => handleDelete(car.id)}>Delete</button>
          </div>
        ))}

      {tab === 'add-car' && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price_per_day}
            onChange={(e) =>
              setForm({ ...form, price_per_day: e.target.value })
            }
          />

          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

          <button type="submit">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}

      {tab === 'bookings' &&
        bookings.map((b) => (
          <div key={b.id}>
            {b.car_name} - ₹{b.total_price}
            <select
              value={b.status}
              onChange={(e) =>
                updateBookingStatus(b.id, e.target.value)
              }
            >
              {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
    </div>
  )
}