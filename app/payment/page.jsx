'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 -z-10 
          bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent_60%)] blur-3xl" />

        <div className="text-center">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-purple-400 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-300">
            Your booking for <strong>{carName}</strong> is confirmed.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Redirecting to your bookings...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">

      {/* 🌌 BACK GLOW */}
      <div className="absolute inset-0 -z-10 
        bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative group"
      >

        {/* 🔥 OUTER GLOW BORDER */}
        <div className="absolute inset-0 rounded-3xl p-[1px] 
          bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-transparent 
          opacity-70 group-hover:opacity-100 transition duration-500 blur-[1px]" />

        {/* 💎 CARD */}
        <div className="relative rounded-3xl p-8 
          bg-white/[0.05] backdrop-blur-2xl border border-white/15
          shadow-[0_0_30px_rgba(168,85,247,0.15)]
          group-hover:shadow-[0_0_50px_rgba(168,85,247,0.25)]
          transition-all duration-500">

          {/* LIGHT REFLECTION */}
          <div className="absolute inset-0 rounded-3xl opacity-20 
            bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

          {/* HEADER */}
          <h1 className="text-3xl font-bold text-white mb-2">Payment</h1>
          <p className="text-gray-400 mb-8">
            Complete your booking for {carName}
          </p>

          {/* 💰 AMOUNT */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-xl 
              bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-60" />

            <div className="relative rounded-xl p-5 text-center 
              bg-white/[0.05] border border-white/10 backdrop-blur-xl">
              <p className="text-gray-400 text-sm mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-purple-400">₹{amount}</p>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-5">

            {/* INPUT */}
            <div className="space-y-4">

              <input
                required
                placeholder="Cardholder Name"
                className="w-full px-4 py-3 rounded-xl 
                bg-white/[0.06] border border-white/10 text-white placeholder-gray-400
                backdrop-blur-xl outline-none
                focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]
                transition-all duration-300"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />

              <input
                required
                placeholder="Card Number"
                className="w-full px-4 py-3 rounded-xl 
                bg-white/[0.06] border border-white/10 text-white placeholder-gray-400
                backdrop-blur-xl outline-none
                focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]
                transition-all duration-300"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="MM/YY"
                  className="px-4 py-3 rounded-xl 
                  bg-white/[0.06] border border-white/10 text-white placeholder-gray-400
                  backdrop-blur-xl outline-none
                  focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]
                  transition-all duration-300"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                />
                <input
                  required
                  placeholder="CVV"
                  type="password"
                  className="px-4 py-3 rounded-xl 
                  bg-white/[0.06] border border-white/10 text-white placeholder-gray-400
                  backdrop-blur-xl outline-none
                  focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]
                  transition-all duration-300"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                />
              </div>

            </div>

            <p className="text-xs text-gray-500 text-center">
              🔒 Mock payment (no real transaction)
            </p>

            {/* 🚀 BUTTON */}
            <button
              disabled={loading}
              className="relative w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-purple-500 to-blue-500
              border border-transparent overflow-hidden
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-[0_0_25px_rgba(168,85,247,0.6),0_0_45px_rgba(59,130,246,0.5)]"
            >
              <span className="relative z-10">
                {loading ? 'Processing...' : `Pay ₹${amount}`}
              </span>

              {/* SHINE EFFECT */}
              <span className="absolute inset-0 opacity-0 hover:opacity-100 
                bg-gradient-to-r from-transparent via-white/20 to-transparent 
                translate-x-[-100%] hover:translate-x-[100%] transition duration-700" />
            </button>

          </form>

        </div>
      </motion.div>
    </div>
  )
}