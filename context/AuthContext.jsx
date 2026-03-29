'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
useEffect(() => {
  let isMounted = true;

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!isMounted) return;

      setUser(session?.user ?? null)

      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!error) {
          setUserData(data)
        } else {
          console.error(error)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (isMounted) setLoading(false)
    }
  }

  initAuth()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUserData(data)
      } else {
        setUserData(null)
      }
    }
  )

  return () => {
    isMounted = false
    subscription.unsubscribe()
  }
}, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)