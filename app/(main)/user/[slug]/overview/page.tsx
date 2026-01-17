// app/(main)/user/[slug]/overview/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, MapPin, Calendar, DollarSign, Globe, Clock } from 'lucide-react'
import { getCountryBySlug } from '@/lib/country-utils'

type Props = {
  params: Promise<{ slug: string }>
}

export default function OverviewPage({ params }: Props) {
  //  REQUIRED in Next.js 16
  const { slug } = use(params)

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

  if (loading) {
    return (
      <div className="flex py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!country || !country.overview) {
    return (
      <div className="py-12">
        <p className="text-gray-600">
          No overview data available for this country.
        </p>
      </div>
    )
  }

  const { overview } = country

  return (
    <div className="space-y-8">
      {/* Short Description */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-lg text-gray-700 leading-relaxed">
          {overview.short_description}
        </p>
      </section>

      {/* History */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">History</h2>
        <p className="text-gray-700 leading-relaxed">{overview.history}</p>
      </section>

      {/* Culture */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Culture</h2>
        <p className="text-gray-700 leading-relaxed">{overview.culture}</p>
      </section>

      {/* Climate */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Climate</h2>
        <p className="text-gray-700 leading-relaxed">{overview.climate}</p>
      </section>

      {/* Quick Facts */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-5 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
            <p className="font-semibold">{overview.best_time_to_visit}</p>
          </div>

          <div className="bg-green-50 p-5 rounded-xl">
            <DollarSign className="w-5 h-5 text-green-600 mb-2" />
            <p className="font-semibold">{overview.currency}</p>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl">
            <Globe className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold">{overview.language}</p>
          </div>

          <div className="bg-orange-50 p-5 rounded-xl">
            <Clock className="w-5 h-5 text-orange-600 mb-2" />
            <p className="font-semibold">{overview.time_zone}</p>
          </div>

          <div className="bg-pink-50 p-5 rounded-xl">
            <MapPin className="w-5 h-5 text-pink-600 mb-2" />
            <p className="font-semibold">{country.capital}</p>
          </div>
        </div>
      </section>

      {/* Map */}
      {overview.latitude && overview.longitude && (
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>

          <a
            href={`https://www.google.com/maps?q=${overview.latitude},${overview.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            <MapPin className="w-5 h-5" />
            View on Google Maps
          </a>
        </section>
      )}
    </div>
  )
}