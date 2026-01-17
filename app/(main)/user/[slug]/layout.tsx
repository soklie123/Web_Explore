'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Share2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CountryNavigation from '@/app/(main)/user/[slug]/components/CountryNavigation'
import FavoriteButton from '../components/function/FavoriteButton'
import { getCountryBySlug } from '@/lib/country-utils'

type Props = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default function CountryLayout({ children, params }: Props) {
  const router = useRouter()
  const { slug } = use(params)
  
  const [country, setCountry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/countries')
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }

        const data = await response.json()
        const foundCountry = getCountryBySlug(data, slug)

        if (!foundCountry) {
          setError('Country not found')
        } else {
          setCountry(foundCountry)
        }
      } catch (err: any) {
        console.error('Error fetching country:', err)
        setError(err.message || 'Failed to load country data')
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading country data...</p>
        </div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600 mb-4">{error || 'Country not found'}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="relative h-96 w-full rounded-xl overflow-hidden">
        <Image 
          src={country.flag || '/default-country.jpg'} 
          alt={country.name} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="absolute top-6 right-6 flex items-center gap-3">
          <img 
            src={country.flag} 
            alt={`${country.name} flag`} 
            className="w-12 h-8 shadow-lg rounded object-cover" 
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{country.name}</h1>
          <p className="text-sm font-medium mb-4">Capital: {country.capital}</p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <FavoriteButton slug={slug} inline={true} showLabel={true} />
            </button>

            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      <CountryNavigation slug={slug} />

      <section className="max-w-4xl mx-auto px-6 py-8">{children}</section>
    </main>
  )
}