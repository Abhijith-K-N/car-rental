import Link from 'next/link'

export default function CarCard({ car }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden 
    border border-gray-200 
    shadow-[0_4px_20px_rgba(0,0,0,0.04)]
    hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
    transition-all duration-300">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={car.imageUrl || "https://images.unsplash.com/photo-1502877338535-766e1452684a"}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1502877338535-766e1452684a"
          }}
        />

        {/* STATUS BADGE */}
        <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium backdrop-blur
          ${car.available 
            ? 'bg-emerald-100/90 text-emerald-700' 
            : 'bg-red-100/90 text-red-600'}`}>
          {car.available ? 'Available' : 'Rented'}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {car.name}
        </h3>

        {/* SUBTEXT */}
        <p className="text-gray-500 text-sm mb-2">
          {car.brand} · {car.type}
        </p>

        {/* DETAILS */}
        <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
          <span>👥 {car.seats}</span>
          <span>📍 {car.location}</span>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center">

          {/* PRICE */}
          <div>
            <span className="text-emerald-600 font-bold text-lg">
              ₹{car.pricePerDay}
            </span>
            <span className="text-gray-400 text-sm ml-1">/day</span>
          </div>

          {/* BUTTON */}
          <Link
            href={`/cars/${car.id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium 
            bg-emerald-500 text-white 
            hover:bg-emerald-600 
            transition"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  )
}