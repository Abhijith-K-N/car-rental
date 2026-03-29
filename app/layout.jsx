import { AuthProvider } from '../context/AuthContext'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'CarRent — Your Trusted Car Rental',
  description: 'Rent a car easily and quickly',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020617]">

        <AuthProvider>
          {/* Navbar */}
          <Navbar />

          <main>
            {children}
          </main>
        </AuthProvider>

      </body>
    </html>
  )
}