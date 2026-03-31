'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Particles = dynamic(() => import('react-tsparticles'), { ssr: false })

export default function ImmersiveBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // cursor glow
  useEffect(() => {
    const glow = document.getElementById('cursor-glow')
    if (!glow) return

    let raf
    const move = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`
      })
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* 🌌 BASE DEPTH */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.12),transparent_40%),
             radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.12),transparent_40%),
             linear-gradient(to_bottom,#020617,#0B1C2C,#020617)]" />

      {/* 🔮 FLOATING BLOBS */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[140px]"
        animate={{ x: [0, 120, -80, 0], y: [0, -100, 80, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '5%' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[130px]"
        animate={{ x: [0, -100, 100, 0], y: [0, 80, -60, 0], scale: [1, 1.05, 0.9, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '10%', right: '5%' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px]"
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 40, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '50%', left: '45%' }}
      />

      {/* ✨ PARTICLES */}
      <Particles
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: {
              value: isMobile ? 20 : 55,
              density: { enable: true, area: 800 },
            },
            color: { value: ['#A855F7', '#3B82F6'] },
            size: {
              value: { min: 1, max: 3 },
            },
            move: {
              enable: true,
              speed: 0.4,
            },
            opacity: {
              value: { min: 0.2, max: 0.5 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.2,
              },
            },
            links: {
              enable: true,
              distance: 130,
              opacity: 0.15,
              color: '#3B82F6',
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
            },
            modes: {
              grab: {
                distance: 140,
                links: { opacity: 0.3 },
              },
            },
          },
        }}
        className="absolute inset-0"
      />

      {/* 🔲 GRID */}
      <div className="absolute inset-0 opacity-[0.03] 
        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),
             linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
        bg-[size:80px_80px]" />

      {/* 🌫 NOISE */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay 
        bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 🟣 CURSOR LIGHT */}
      <div
        id="cursor-glow"
        className="pointer-events-none absolute w-[500px] h-[500px] 
        bg-gradient-to-r from-purple-500/20 to-blue-500/20 
        rounded-full blur-[150px] transition-transform duration-200"
      />

    </div>
  )
}