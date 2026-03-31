import Link from 'next/link'

export default function CarCard({ car }) {
  if (!car) return null

  const price = Number(
    car?.price_per_day ??
    car?.pricePerDay ??
    car?.price ??
    0
  )

  return (
    <div className="group relative p-[1px] rounded-3xl 
    bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500
    transition-all duration-500 ease-out
    hover:scale-[1.03] hover:-translate-y-2">

      {/* INNER CARD */}
      <div className="relative rounded-3xl overflow-hidden
      bg-gradient-to-br from-[#0B1C2C] via-[#0F172A] to-[#020617]
      backdrop-blur-xl border border-white/10
      shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      transition-all duration-500">

        {/* RADIAL LIGHT OVERLAY */}
        <div className="absolute inset-0 opacity-20 pointer-events-none
        bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />

        {/* HOVER GLOW OVERLAY */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500
        bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.25),transparent_60%)]" />

        {/* IMAGE */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            src={
              car?.image_url ||
              car?.imageUrl ||
              "https://images.unsplash.com/photo-1502877338535-766e1452684a"
            }
            alt={car?.name || "Car"}
            className="w-full h-48 object-cover
            transition duration-700 ease-out
            group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1502877338535-766e1452684a"
            }}
          />

          {/* DARK GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* COLOR GLOW OVERLAY */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay
          bg-gradient-to-tr from-purple-500/40 via-transparent to-blue-500/40" />

          {/* LIGHT SWEEP */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700
          bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)]
          translate-x-[-100%] group-hover:translate-x-[100%]" />

          {/* STATUS BADGE */}
          <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium
          backdrop-blur-md border
          ${car?.available 
            ? 'bg-green-400/20 text-green-300 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.7)] animate-pulse' 
            : 'bg-red-400/20 text-red-300 border-red-400/30 shadow-[0_0_20px_rgba(239,68,68,0.7)]'}`}>
            {car?.available ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-5 relative">

          {/* TITLE */}
          <h3 className="font-bold text-lg text-white tracking-wide mb-1
          transition-all duration-300
          group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent">
            {car?.name || 'Unnamed Car'}
          </h3>

          {/* SUBTEXT */}
          <p className="text-gray-400/80 text-sm mb-2">
            {car?.brand || 'Brand'} · {car?.type || 'Type'}
          </p>

          {/* DETAILS */}
          <div className="flex items-center gap-3 text-gray-400 text-xs mb-4">
            <span className="opacity-70">👥 {car?.seats ?? '-'}</span>
            <span className="opacity-70">📍 {car?.location ?? '-'}</span>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center">

            {/* ✅ FIXED PRICE */}
            <div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ₹{price}
              </span>
              <span className="text-gray-400 text-sm ml-1">/day</span>
            </div>

            {/* BUTTON */}
            <Link
              href={`/cars/${car?.id}`}
              className="relative px-4 py-2 rounded-xl text-sm font-medium text-white
              bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500
              shadow-[0_0_20px_rgba(99,102,241,0.5)]
              overflow-hidden
              transition-all duration-300
              hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.8)]">

              {/* SHINE */}
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500
              bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)]
              translate-x-[-100%] hover:translate-x-[100%]" />

              <span className="relative z-10 flex items-center gap-1">
                View Details
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}