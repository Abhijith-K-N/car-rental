'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

import { Car, DollarSign, Shield, Clock, MapPin, Star } from 'lucide-react'

const Particles = dynamic(() => import('@/components/Particles'), { ssr: false })

export default function LandingPage() {
  const [search, setSearch] = useState({ location: '', pickup: '', drop: '' })
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(search)
    router.push(`/cars?${params.toString()}`)
  }

  const features = [
    { icon: <Car size={20} />, title: 'Wide Vehicle Range', desc: 'From budget cars to luxury rides.', link: '/cars' },
    { icon: <DollarSign size={20} />, title: 'Transparent Pricing', desc: 'No hidden charges.', link: '/cars' },
    { icon: <Shield size={20} />, title: 'Secure Booking', desc: 'Safe and verified vehicles.', link: '/cars' },
    { icon: <Clock size={20} />, title: 'Instant Booking', desc: 'Book in seconds.', link: '/cars' },
    { icon: <MapPin size={20} />, title: 'Multiple Locations', desc: 'Pickup across cities.', link: '/cars' },
    { icon: <Star size={20} />, title: 'Top Rated Service', desc: 'Trusted by thousands.', link: '/cars' },
  ]

  return (
    <div>

      {/* ================= HERO ================= */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Rent Cars <span className="text-emerald-500">Effortlessly</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg mb-6"
            >
              Find the perfect car at the best price. Simple booking.
            </motion.p>

            <Link href="/cars" className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
              Explore Cars
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
          >
            <form onSubmit={handleSearch} className="grid gap-4">
              <input
                placeholder="Location"
                className="h-11 px-3 rounded-lg bg-gray-50 border border-gray-200"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="h-11 px-3 rounded-lg bg-gray-50 border border-gray-200" />
                <input type="date" className="h-11 px-3 rounded-lg bg-gray-50 border border-gray-200" />
              </div>
              <button className="h-11 bg-emerald-500 text-white rounded-lg">Search Cars</button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-24">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose <span className="text-emerald-600">CarRent?</span>
          </h2>
          <p className="text-gray-500 mt-3">
            Designed for speed, reliability, and a seamless experience.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-8">

          {features.map((item, i) => (
            <Link href="/cars" key={item.title} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl 
                bg-white/80 backdrop-blur-sm
                border border-gray-100
                hover:border-emerald-300
                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                transition-all duration-300"
              >

                <div className="w-12 h-12 flex items-center justify-center 
                rounded-xl bg-emerald-50 text-emerald-600 mb-5 
                group-hover:scale-110 transition">
                  {item.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm mb-6">
                  {item.desc}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-600 font-medium">
                    Browse Cars
                  </span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition">
                    →
                  </span>
                </div>

                <div className="absolute top-0 left-0 w-full h-[2px] 
                bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent 
                opacity-0 group-hover:opacity-100 transition"></div>

              </motion.div>
            </Link>
          ))}

        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="bg-emerald-50 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to hit the road?
        </h2>
        <Link href="/cars" className="px-8 py-3 bg-emerald-600 text-white rounded-xl">
          Browse Cars
        </Link>
      </div>
      {/* ================= FOOTER ================= */}
<footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4">
  <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

    {/* BRAND */}
    <div>
      <h3 className="text-xl font-bold text-white mb-3">
        CarRent
      </h3>
      <p className="text-sm text-gray-400">
        Rent cars effortlessly with the best prices and seamless booking experience.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h4 className="text-white font-semibold mb-3">Quick Links</h4>
      <ul className="space-y-2 text-sm">
        <li><Link href="/cars" className="hover:text-emerald-400">Browse Cars</Link></li>
        <li><Link href="/pricing" className="hover:text-emerald-400">Pricing</Link></li>
        <li><Link href="/booking" className="hover:text-emerald-400">Booking</Link></li>
      </ul>
    </div>

    {/* SUPPORT */}
    <div>
      <h4 className="text-white font-semibold mb-3">Support</h4>
      <ul className="space-y-2 text-sm">
        <li><Link href="/help" className="hover:text-emerald-400">Help Center</Link></li>
        <li><Link href="/contact" className="hover:text-emerald-400">Contact Us</Link></li>
        <li><Link href="/terms" className="hover:text-emerald-400">Terms & Conditions</Link></li>
      </ul>
    </div>

    {/* NEWSLETTER */}
    <div>
      <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
      <p className="text-sm text-gray-400 mb-3">
        Get latest offers and updates.
      </p>

      <div className="flex">
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-3 py-2 text-sm rounded-l-lg 
          bg-gray-800 border border-gray-700 text-white 
          focus:outline-none"
        />
        <button
          className="px-4 bg-emerald-500 text-white text-sm rounded-r-lg 
          hover:bg-emerald-600 transition"
        >
          Join
        </button>
      </div>
    </div>
  </div>

  {/* BOTTOM */}
  <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} CarRent. All rights reserved.
  </div>
</footer>

    </div>
  )
}