'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'

export default function BookingPage() {
  const { carId } = useParams()
  const { user, userData } = useAuth()
  const router = useRouter()

  const [car, setCar] = useState(null)
  const [form, setForm] = useState({ startDate: '', endDate: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchCar = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId) // use Number(carId) if integer
        .single()

      if (!error) setCar(data)
      else setCar(null)
    }

    fetchCar()
  }, [carId, user])

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0
    const diff = new Date(form.endDate) - new Date(form.startDate)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const totalPrice = car ? calcDays() * car.price_per_day : 0

  const checkConflict = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('car_id', carId)
      .in('status', ['PENDING', 'CONFIRMED'])

    if (error || !data) return false

    const start = new Date(form.startDate)
    const end = new Date(form.endDate)

    return data.some((b) => {
      return start <= new Date(b.end_date) && end >= new Date(b.start_date)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.startDate || !form.endDate)
      return setError('Please select both dates')

    if (new Date(form.startDate) >= new Date(form.endDate))
      return setError('Return date must be after pickup date')

    setLoading(true)

    const conflict = await checkConflict()
    if (conflict) {
      setLoading(false)
      return setError('Car already booked for selected dates')
    }

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user.id,
          user_name: userData?.name || 'Unknown',
          car_id: carId,
          car_name: car.name,
          car_image: car.image_url || '',
          start_date: form.startDate,
          end_date: form.endDate,
          total_price: totalPrice,
          days: calcDays(),
          status: 'PENDING',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (insertError) {
      setLoading(false)
      return setError('Booking failed')
    }

    router.push(
      `/payment?bookingId=${booking.id}&amount=${totalPrice}&carName=${car.name}`
    )

    setLoading(false)
  }

  if (!car)
    return <div className="text-center py-20 text-gray-500">Loading car details...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Book {car.name}
      </h1>

      <p className="text-gray-500 mb-8">
        ₹{car.price_per_day}/day · {car.location}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-8 space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="date"
            required
            min={form.startDate || new Date().toISOString().split('T')[0]}
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {calcDays() > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            ₹{car.price_per_day} × {calcDays()} = ₹{totalPrice}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          {loading ? 'Checking availability...' : 'Proceed to Payment →'}
        </button>
      </form>
    </div>
  )
}