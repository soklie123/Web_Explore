// app/(main)/user/[slug]/context/CountryContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCountryBySlug } from '@/lib/country-utils'

const CountryContext = createContext<any>(null)

export function CountryProvider({ 
  children, 
  slug 
}: { 
  children: React.ReactNode
  slug: string 
}) {
  const [country, setCountry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const foundCountry = getCountryBySlug(data, slug)
        setCountry(foundCountry)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [slug])

  return (
    <CountryContext.Provider value={{ country, loading }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (!context) {
    throw new Error('useCountry must be used within CountryProvider')
  }
  return context
}