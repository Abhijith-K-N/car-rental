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

  // ...filter logic and JSX stays exactly the same
  // Note: use car.price_per_day instead of car.pricePerDay

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Cars</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <input
          type="text"
          placeholder="Search by name or city..."
          className="border rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-[180px]"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <select
          className="border rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Luxury">Luxury</option>
        </select>
        <select
          className="border rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none"
          value={filter.maxPrice}
          onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
        >
          <option value="">Any Price</option>
          <option value="50">Under ₹50/day</option>
          <option value="100">Under ₹100/day</option>
          <option value="200">Under ₹200/day</option>
        </select>
        <button
          onClick={() => setFilter({ type: '', maxPrice: '', search: '' })}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading cars...</div>
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
