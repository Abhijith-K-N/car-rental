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
        .eq('id', id)
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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!car) return <div className="text-center py-20 text-gray-400">Car not found.</div>

  const specs = [
    { label: 'Brand', value: car.brand },
    { label: 'Type', value: car.type },
    { label: 'Seats', value: `${car.seats} seats` },
    { label: 'Location', value: car.location },
    { label: 'Status', value: car.available ? '✅ Available' : '❌ Not Available' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0B1C2C] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        <Link href="/cars" className="text-blue-400 text-sm hover:underline mb-6 inline-block">
          ← Back to Cars
        </Link>

        {/* IMAGE */}
        <div className="relative rounded-3xl overflow-hidden mb-10">
          <img
            src={car.image_url || 'https://via.placeholder.com/800x400?text=Car+Image'}
            alt={car.name}
            className="w-full h-80 object-cover"
          />

          {/* DARK OVERLAY FOR READABILITY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          {/* TITLE OVER IMAGE */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {car.name}
            </h1>
            <p className="text-gray-300">
              {car.brand} · {car.type}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT: DETAILS */}
          <div className="space-y-6">

            <div className="grid grid-cols-2 gap-4">
              {specs.map((s) => (
                <div key={s.label}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-1">{s.label}</p>
                  <p className="font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: BOOKING CARD */}
          <div className="relative p-[1px] rounded-3xl 
          bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-indigo-500/40">

            <div className="rounded-3xl p-6 h-fit
            bg-gradient-to-br from-[#0B1C2C] to-[#020617]
            border border-white/10 backdrop-blur-xl">

              {/* PRICE */}
              <p className="text-3xl font-bold text-white mb-1">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  ₹{car.price_per_day}
                </span>
                <span className="text-gray-300 text-base font-normal ml-1">/day</span>
              </p>

              <p className="text-gray-400 text-sm mb-6">
                Total depends on rental duration
              </p>

              {/* BUTTON */}
              <button
                onClick={handleBook}
                disabled={!car.available}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300
                ${
                  car.available
                    ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
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
      </div>
    </div>
  )
}