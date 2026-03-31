'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusConfig = {
  PENDING: {
    style: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  CONFIRMED: {
    style: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  CANCELLED: {
    style: 'bg-red-500/20 text-red-300 border border-red-500/30',
    dot: 'bg-red-400',
  },
  COMPLETED: {
    style: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    dot: 'bg-gray-400',
  },
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`*, cars (name, image_url, brand, type)`)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setBookings(data || [])
      setLoading(false)
    }

    fetchBookings()
  }, [])

  const cancelBooking = async (id) => {
    setCancellingId(id)
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', id)

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
      )
    }
    setCancellingId(null)
    setShowConfirm(null)
  }

  const calcDays = (start, end) =>
    Math.max(1, Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)))

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length
  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((s, b) => s + (b.total_price || 0), 0)

  if (loading)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/50 text-sm">Fetching your bookings...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-white font-semibold text-lg">Something went wrong</p>
          <p className="text-white/40 text-sm mt-2">{error}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-1">My Bookings</h1>
          <p className="text-white/40 text-sm">Track and manage all your car rentals</p>
        </div>

        {/* Stats Bar */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: '📋' },
              { label: 'Confirmed', value: confirmedCount, icon: '✅' },
              { label: 'Total Spent', value: `₹${totalSpent}`, icon: '💳' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-center"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="text-center py-28 rounded-3xl border border-white/10 bg-white/5">
            <p className="text-6xl mb-5">🚗</p>
            <p className="text-white text-xl font-semibold mb-2">No bookings yet</p>
            <p className="text-white/40 text-sm mb-8">
              You haven&apos;t rented any cars yet. Start exploring!
            </p>
            <Link
              href="/cars"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Browse Cars →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const days = calcDays(booking.start_date, booking.end_date)
              const cfg = statusConfig[booking.status] || statusConfig.PENDING
              const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5">

                    {/* Car Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          booking.cars?.image_url ||
                          'https://via.placeholder.com/100x70?text=Car'
                        }
                        alt={booking.cars?.name}
                        className="w-24 h-16 md:w-28 md:h-20 object-cover rounded-xl border border-white/10"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg leading-tight">
                            {booking.cars?.name || 'Car'}
                          </h3>
                          <p className="text-white/40 text-xs mt-0.5">
                            {booking.cars?.brand} · {booking.cars?.type}
                          </p>
                        </div>
                        {/* Status Badge */}
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {booking.status}
                        </span>
                      </div>

                      {/* Date & Price Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                          <span className="text-white/40">📅</span>
                          <span className="text-white/70">
                            {formatDate(booking.start_date)}
                          </span>
                          <span className="text-white/30">→</span>
                          <span className="text-white/70">
                            {formatDate(booking.end_date)}
                          </span>
                          <span className="text-white/30">·</span>
                          <span className="text-blue-400 font-medium">
                            {days} day{days > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-white font-bold text-base">
                          ₹{booking.total_price}
                        </div>
                      </div>
                    </div>

                    {/* Cancel Button */}
                    {canCancel && (
                      <div className="flex-shrink-0">
                        {showConfirm === booking.id ? (
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-white/60 text-xs">Are you sure?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowConfirm(null)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs hover:bg-white/20 transition"
                              >
                                Keep
                              </button>
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/30 transition disabled:opacity-50"
                              >
                                {cancellingId === booking.id ? 'Cancelling...' : 'Yes, Cancel'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowConfirm(booking.id)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 hover:border-red-500/40 transition font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Link */}
        {bookings.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/cars"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
            >
              + Book another car
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}