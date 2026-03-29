'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function CarDetailPage() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id) // use Number(id) if your id is integer
        .single()

      if (error) {
        console.error('Error fetching car:', error)
        setCar(null)
      } else {
        setCar(data)
      }

      setLoading(false)
    }

    fetchCar()
  }, [id])

  const handleBook = () => {
    if (!user) return router.push('/auth/login')
    router.push(`/booking/${id}`)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>
  if (!car) return <div className="text-center py-20 text-gray-500">Car not found.</div>

  const specs = [
    { label: 'Brand', value: car.brand },
    { label: 'Type', value: car.type },
    { label: 'Seats', value: `${car.seats} seats` },
    { label: 'Location', value: car.location },
    { label: 'Status', value: car.available ? '✅ Available' : '❌ Not Available' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/cars" className="text-blue-600 text-sm hover:underline mb-4 block">
        ← Back to Cars
      </Link>

      <img
        src={car.image_url || 'https://via.placeholder.com/800x400?text=Car+Image'}
        alt={car.name}
        className="w-full h-80 object-cover rounded-2xl mb-8"
      />

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{car.name}</h1>
          <p className="text-gray-500 mb-6">
            {car.brand} · {car.type}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {specs.map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="font-semibold text-gray-700">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <p className="text-3xl font-bold text-blue-600 mb-1">
            ₹{car.price_per_day}
            <span className="text-gray-400 text-base font-normal">/day</span>
          </p>

          <p className="text-gray-500 text-sm mb-6">
            Total depends on rental duration
          </p>

          <button
            onClick={handleBook}
            disabled={!car.available}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              car.available
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {car.available ? '🚗 Book Now' : 'Not Available'}
          </button>

          {!user && (
            <p className="text-center text-gray-400 text-xs mt-3">
              You&apos;ll be prompted to login
            </p>
          )}
        </div>
      </div>
    </div>
  )
}