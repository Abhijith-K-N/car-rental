'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 
      ${scrolled 
        ? 'bg-gradient-to-r from-slate-900/80 via-indigo-900/70 to-purple-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-b border-white/10'
        : 'bg-gradient-to-r from-slate-900/90 via-indigo-900/80 to-purple-900/90 backdrop-blur-lg'
      }`}
    >
      {/* ✅ SHINE OVERLAY */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shine_6s_linear_infinite]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
          href="/" 
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
          drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] 
          transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]"
        >
           CarRent
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* Browse Cars */}
          <Link 
            href="/cars" 
            className={`group relative font-medium transition-all duration-300 
            ${pathname === '/cars' 
              ? 'text-white' 
              : 'text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'}`}
          >
            Browse Cars

            {/* ✅ ANIMATED GRADIENT UNDERLINE */}
            <span
              className={`absolute left-0 -bottom-1 h-[3px] w-full rounded-full 
              ${pathname === '/cars' 
                ? 'opacity-100 scale-x-100' 
                : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}
              
              bg-[linear-gradient(90deg,#3b82f6,#a855f7,#ec4899,#3b82f6)] 
              bg-[length:200%_100%] 
              animate-[gradientMove_3s_linear_infinite] 
              transition-all duration-300`}
            />
          </Link>

          {user ? (
            <>
              {/* My Bookings */}
              <Link 
                href="/my-bookings" 
                className={`group relative font-medium transition-all duration-300 
                ${pathname === '/my-bookings' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'}`}
              >
                My Bookings

                {/* ✅ ANIMATED GRADIENT UNDERLINE */}
                <span
                  className={`absolute left-0 -bottom-1 h-[3px] w-full rounded-full 
                  ${pathname === '/my-bookings' 
                    ? 'opacity-100 scale-x-100' 
                    : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}
                  
                  bg-[linear-gradient(90deg,#3b82f6,#a855f7,#ec4899,#3b82f6)] 
                  bg-[length:200%_100%] 
                  animate-[gradientMove_3s_linear_infinite] 
                  shadow-[0_0_10px_rgba(168,85,247,0.7)] 
                  transition-all duration-300`}
                />
              </Link>

              {userData?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-orange-400 font-semibold transition-all duration-300 hover:text-orange-300"
                >
                  Admin Panel
                </Link>
              )}

              <span className="text-gray-400 text-sm">
                Hi, {userData?.name?.split(' ')[0] || 'User'}
              </span>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm 
                transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-gray-300 font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm 
                transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-300 transition-transform duration-300 hover:scale-110"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out 
        ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          
          <Link href="/cars" className="text-gray-200" onClick={() => setOpen(false)}>Browse Cars</Link>

          {user ? (
            <>
              <Link href="/my-bookings" className="text-gray-200" onClick={() => setOpen(false)}>My Bookings</Link>

              {userData?.role === 'admin' && (
                <Link href="/admin" className="text-orange-400 font-semibold" onClick={() => setOpen(false)}>Admin Panel</Link>
              )}

              <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-200" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/auth/register" className="text-blue-400 font-semibold" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* ✅ KEYFRAMES */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </nav>
  )
}