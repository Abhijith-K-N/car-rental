'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusStyle = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setBookings(data || [])
      else setBookings([])

      setLoading(false)
    }

    fetchBookings()
  }, [user])

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return

    await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', id)

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'CANCELLED' } : b
      )
    )
  }

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading bookings...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-lg">You have no bookings yet.</p>
          <Link href="/cars" className="text-blue-600 hover:underline mt-2 block">
            Browse available cars →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {booking.car_image && (
                  <img
                    src={booking.car_image}
                    alt={booking.car_name}
                    className="w-20 h-14 object-cover rounded-xl"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {booking.car_name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">
                    📅 {booking.start_date} → {booking.end_date} ({booking.days} day{booking.days > 1 ? 's' : ''})
                  </p>
                  <p className="text-blue-600 font-semibold mt-1">
                    ₹{booking.total_price}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle[booking.status]}`}
                >
                  {booking.status}
                </span>

                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}