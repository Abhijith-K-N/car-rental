'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Car, DollarSign, Shield, Clock, MapPin, Star } from 'lucide-react'

export default function LandingPage() {
  const [search, setSearch] = useState({ location: '', pickup: '', drop: '' })
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(search)
    router.push(`/cars?${params.toString()}`)
  }

  const handleNewsletterJoin = () => {
    if (!email || !email.includes('@')) return
    setToast(email)
    setEmail('')
    setTimeout(() => {
      setToast('')
      router.push('/')
    }, 2500)
  }

  const features = [
    { icon: <Car size={20} />, title: 'Wide Vehicle Range', desc: 'From budget cars to luxury rides.' },
    { icon: <DollarSign size={20} />, title: 'Transparent Pricing', desc: 'No hidden charges.' },
    { icon: <Shield size={20} />, title: 'Secure Booking', desc: 'Safe and verified vehicles.' },
    { icon: <Clock size={20} />, title: 'Instant Booking', desc: 'Book in seconds.' },
    { icon: <MapPin size={20} />, title: 'Multiple Locations', desc: 'Pickup across cities.' },
    { icon: <Star size={20} />, title: 'Top Rated Service', desc: 'Trusted by thousands.' },
  ]

  return (
    <div>

      {/* ================= HERO ================= */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.18),transparent_60%)] blur-3xl" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            >
              Rent Cars <span className="text-purple-400">Effortlessly</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg mb-6"
            >
              Find the perfect car at the best price. Simple booking.
            </motion.p>

            <Link
              href="/cars"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white border border-transparent hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300"
            >
              Explore Cars
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-xl"
          >
            <form onSubmit={handleSearch} className="grid gap-4">
              <input
                placeholder="Location"
                className="h-11 px-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  className="h-11 px-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  value={search.pickup}
                  onChange={(e) => setSearch({ ...search, pickup: e.target.value })}
                />
                <input
                  type="date"
                  className="h-11 px-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  value={search.drop}
                  onChange={(e) => setSearch({ ...search, drop: e.target.value })}
                />
              </div>
              <button className="h-11 rounded-lg text-white bg-gradient-to-r from-purple-500 to-blue-500 border border-transparent hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300">
                Search Cars
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)] blur-3xl" />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">
            Why Choose <span className="text-purple-400">CarRent?</span>
          </h2>
          <p className="text-gray-400 mt-3">Designed for speed, reliability, and a seamless experience.</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <Link href="/cars" key={item.title} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative p-[1px] rounded-3xl bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-transparent hover:from-purple-500 hover:via-blue-500 transition-all duration-500"
              >
                <div className="relative h-full rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-xl border border-white/15 hover:translate-y-[-6px] hover:scale-[1.03] transition-all duration-500 shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:shadow-[0_0_45px_rgba(168,85,247,0.35)] overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_40%)]" />
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-purple-200 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{item.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-400 font-medium">Browse Cars</span>
                    <span className="text-purple-400 group-hover:translate-x-2 transition-all duration-300">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="relative py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_60%)] blur-3xl" />
        <h2 className="text-3xl font-bold text-white mb-4">Ready to hit the road?</h2>
        <Link
          href="/cars"
          className="inline-flex px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white border border-transparent hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-all duration-300"
        >
          Browse Cars
        </Link>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative mt-10 border-t border-white/10 backdrop-blur-xl bg-white/[0.03]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.1),transparent_60%)] blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">C</div>
                <span className="text-white font-bold text-xl">CarRent</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Hassle-free car rentals across India. Transparent pricing, instant booking, no surprises.
              </p>
              <div className="flex flex-wrap gap-2">
                {['✅ Verified Cars', '🔒 Secure Payments', '⚡ Instant Booking'].map((badge) => (
                  <span key={badge} className="text-xs text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Browse Cars', href: '/cars' },
                  { label: 'My Bookings', href: '/my-bookings' },
                  { label: 'Login', href: '/auth/login' },
                  { label: 'Register', href: '/auth/register' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-white/40 hover:text-purple-400 transition flex items-center gap-1.5 group">
                      <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Car Types */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Car Types</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Sedan', emoji: '🚗' },
                  { label: 'SUV', emoji: '🚙' },
                  { label: 'Hatchback', emoji: '🚘' },
                  { label: 'Luxury', emoji: '✨' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={`/cars?type=${item.label}`} className="text-white/40 hover:text-purple-400 transition flex items-center gap-2">
                      <span>{item.emoji}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
              <p className="text-white/40 text-sm mb-4 leading-relaxed">
                Get exclusive deals, new car alerts, and rental tips straight to your inbox.
              </p>
              <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-purple-500/50 transition">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewsletterJoin()}
                  className="flex-1 px-4 py-2.5 text-sm bg-white/5 text-white placeholder-white/30 focus:outline-none"
                />
                <button
                  onClick={handleNewsletterJoin}
                  className="px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
                >
                  Join
                </button>
              </div>
              <p className="text-white/25 text-xs mt-3">No spam. Unsubscribe anytime.</p>

              <div className="mt-6">
                <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Available Cities</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'].map((city) => (
                    <span key={city} className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} CarRent. All rights reserved. Built with ❤️ in India.
            </p>
            <div className="flex gap-5 text-xs text-white/30">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                <Link key={link} href="#" className="hover:text-purple-400 transition">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-purple-500/30 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] text-white text-sm font-medium whitespace-nowrap"
          >
            <span className="text-2xl">📬</span>
            <span>
              Updates will be sent to{' '}
              <span className="text-purple-300 font-semibold">{toast}</span>
            </span>
          </motion.div>
        </div>
      )}

    </div>
  )
}