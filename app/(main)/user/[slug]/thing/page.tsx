// app/(main)/user/[slug]/thing/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, MapPin, Clock, TrendingUp } from 'lucide-react'
import { getCountryBySlug } from '@/lib/country-utils'

type Props = {
  params: Promise<{ slug: string }>
}

export default function ThingsToDoPage({ params }: Props) {
  
  const { slug } = use(params)

  const [thingsToDo, setThingsToDo] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchThingsToDo = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const country = getCountryBySlug(data, slug)
        setThingsToDo(country?.thingsToDo || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchThingsToDo()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (thingsToDo.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No activities data available.</p>
      </div>
    )
  }

  // Group by category
  const groupedActivities = thingsToDo.reduce((acc: any, activity: any) => {
    const category = activity.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(activity)
    return acc
  }, {})

  const getCostColor = (costLevel: string) => {
    switch (costLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Things to Do</h2>
        <p className="text-gray-600 mt-1">Discover activities and experiences</p>
      </div>

      {Object.entries(groupedActivities).map(([category, activities]: [string, any]) => (
        <section key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            {category}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity: any) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Title */}
                <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h4>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{activity.description}</p>

                {/* Details */}
                <div className="space-y-2">
                  {/* Location */}
                  {activity.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  {/* Duration */}
                  {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{activity.duration}</span>
                    </div>
                  )}

                  {/* Cost Level */}
                  {activity.cost_level && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getCostColor(
                          activity.cost_level
                        )}`}
                      >
                        {activity.cost_level} cost
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}