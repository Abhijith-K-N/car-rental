import { AuthProvider } from '../context/AuthContext'
import Navbar from '@/components/Navbar'
import ImmersiveBackground from '@/components/ImmersiveBackground'
import './globals.css'

export const metadata = {
  title: 'CarRent — Your Trusted Car Rental',
  description: 'Rent a car easily and quickly',
  icons: {
    icon: '/favicon.ico',        // default
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body className="min-h-screen bg-[#020617] relative">

  <AuthProvider>

    <ImmersiveBackground />

    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
    </div>

  </AuthProvider>

</body>
    </html>
  )
}