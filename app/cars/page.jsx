'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CarCard from '@/components/CarCard'

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: '', maxPrice: '', search: '' })

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await supabase.from('cars').select('*')
      setCars(data || [])
      setLoading(false)
    }
    fetchCars()
  }, [])

  const filtered = cars.filter((car) => {
    if (filter.type && car.type !== filter.type) return false
    if (filter.maxPrice && car.pricePerDay > Number(filter.maxPrice)) return false
    if (
      filter.search &&
      !car.name.toLowerCase().includes(filter.search.toLowerCase()) &&
      !car.location.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-white tracking-wide mb-6
      transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:bg-clip-text hover:text-transparent">
        Available Cars
      </h1>

      {/* FILTERS */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 mb-6 
      bg-white/5 backdrop-blur-xl border border-white/10 
      p-4 rounded-2xl 
      shadow-[0_10px_30px_rgba(0,0,0,0.4)]
      transition-all duration-300">

        {/* SUBTLE GLOW */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none
        bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-40" />

        <input
          type="text"
          placeholder="Search by name or city..."
          className="relative flex-1 min-w-[180px] px-4 py-2 text-sm
          bg-white/10 text-white placeholder-gray-400
          border border-white/10 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500
          shadow-inner shadow-white/5"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />

        <select
          className="relative px-4 py-2 text-sm
          bg-white/10 text-white
          border border-white/10 rounded-xl
          focus:outline-none"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="" className="bg-[#020617]">All Types</option>
          <option value="SUV" className="bg-[#020617]">SUV</option>
          <option value="Sedan" className="bg-[#020617]">Sedan</option>
          <option value="Hatchback" className="bg-[#020617]">Hatchback</option>
          <option value="Luxury" className="bg-[#020617]">Luxury</option>
        </select>

        <select
          className="relative px-4 py-2 text-sm
          bg-white/10 text-white
          border border-white/10 rounded-xl
          focus:outline-none"
          value={filter.maxPrice}
          onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
        >
          <option value="" className="bg-[#020617]">Any Price</option>
          <option value="50" className="bg-[#020617]">Under ₹50/day</option>
          <option value="100" className="bg-[#020617]">Under ₹100/day</option>
          <option value="200" className="bg-[#020617]">Under ₹200/day</option>
        </select>

        <button
          onClick={() => setFilter({ type: '', maxPrice: '', search: '' })}
          className="relative text-blue-400 text-sm transition-all duration-300
          hover:text-blue-300 hover:underline underline-offset-4"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading cars...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p>No cars found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}