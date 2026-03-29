'use client'
import Particles from 'react-tsparticles' // assuming library

export default function ParticlesComponent() {
  return (
    <Particles
      options={{
        fullScreen: false, 
        particles: {
          number: {
            value: 140, 
          },
          color: {
            value: ["#ffffff", "#a78bfa", "#60a5fa"], // improved palette
          },
          opacity: {
            value: 0.4, 
          },
          size: {
            value: { min: 1, max: 4 }, // depth feel // improved
          },
          move: {
            enable: true,
            speed: 0.08, // smooth slow movement
            direction: "none",
            outModes: "out",
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // subtle interaction // added
            },
          },
          modes: {
            repulse: {
              distance: 80,
            },
          },
        },

        detectRetina: true,
      }}
    />
  )
}