// app/(main)/user/[slug]/attract/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, MapPin, Clock, DollarSign, Star } from 'lucide-react'
import { getCountryBySlug } from '@/lib/country-utils'
import Image from 'next/image'

type Props = {
  params: Promise<{ slug: string }>
}

export default function AttractionsPage({ params }: Props) {
  const { slug } = use(params)
  const [attractions, setAttractions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const country = getCountryBySlug(data, slug)
        setAttractions(country?.attractions || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttractions()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (attractions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No attractions data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Top Attractions</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {attractions.map((attraction) => (
          <div key={attraction.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            {attraction.images && attraction.images.length > 0 && (
              <div className="relative h-48 w-full">
                <Image
                  src={attraction.images[0]}
                  alt={attraction.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                {attraction.category}
              </span>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{attraction.name}</h3>

              {/* Description */}
              <p className="text-gray-700 mb-4 leading-relaxed">{attraction.description}</p>

              {/* Details Grid */}
              <div className="space-y-2 text-sm">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{attraction.location}</span>
                </div>

                {/* Opening Hours */}
                {attraction.opening_hours && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{attraction.opening_hours}</span>
                  </div>
                )}

                {/* Visit Time */}
                {attraction.estimated_visit_time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Estimated visit: {attraction.estimated_visit_time}</span>
                  </div>
                )}

                {/* Access Type */}
                {attraction.access_type && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{attraction.access_type}</span>
                  </div>
                )}

                {/* Best Time to Visit */}
                {attraction.best_time_to_visit && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span>Best time: {attraction.best_time_to_visit}</span>
                  </div>
                )}
              </div>

              {/* Highlights */}
              {attraction.highlights && attraction.highlights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-2">
                    {attraction.highlights.map((highlight: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {attraction.rules && attraction.rules.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Rules & Guidelines:</p>
                  <ul className="space-y-1">
                    {attraction.rules.map((rule: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}