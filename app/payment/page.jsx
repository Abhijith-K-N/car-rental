'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const amount = searchParams.get('amount')
  const carName = searchParams.get('carName')

  const { user } = useAuth()
  const router = useRouter()

  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('User not logged in')
      return
    }

    setLoading(true)

    try {
      // ✅ Insert payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: bookingId,
            user_id: user.id,
            amount: Number(amount),
            status: 'PAID',
          },
        ])

      if (paymentError) throw paymentError

      // ✅ Update booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'CONFIRMED' })
        .eq('id', bookingId)

      if (bookingError) throw bookingError

      setPaid(true)

      setTimeout(() => {
        router.push('/my-bookings')
      }, 2500)

    } catch (err) {
      console.error('Payment Error:', err.message)
      alert('Payment failed. Try again.')
    }

    setLoading(false)
  }

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500">
            Your booking for <strong>{carName}</strong> is confirmed.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Redirecting to your bookings...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
      <p className="text-gray-500 mb-8">
        Complete your booking for {carName}
      </p>

      <div className="bg-white rounded-2xl shadow-sm p-8">

        {/* Amount */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-500 text-sm mb-1">Total Amount</p>
          <p className="text-4xl font-bold text-emerald-600">₹{amount}</p>
        </div>

        <form onSubmit={handlePay} className="space-y-4">

          <input
            required
            placeholder="Cardholder Name"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
          />

          <input
            required
            placeholder="Card Number"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="MM/YY"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
            />
            <input
              required
              placeholder="CVV"
              type="password"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            />
          </div>

          <p className="text-xs text-gray-400 text-center">
            🔒 Mock payment (no real transaction)
          </p>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700"
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>

        </form>
      </div>
    </div>
  )
}