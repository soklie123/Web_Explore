// app/(main)/user/[slug]/tip/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { getCountryBySlug } from '@/lib/country-utils'

type Props = {
  params: Promise<{ slug: string }>
}

export default function TipsPage({ params }: Props) {
  
  const { slug } = use(params)

  const [tips, setTips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const country = getCountryBySlug(data, slug)
        setTips(country?.tips || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTips()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (tips.length === 0) {
    return (
      <div className=" py-12">
        <p className="text-gray-600">No tips data available.</p>
      </div>
    )
  }

  const getLevelConfig = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          iconColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-700',
        }
      case 'medium':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-600',
          badgeColor: 'bg-yellow-100 text-yellow-700',
        }
      case 'low':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-900',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-700',
        }
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          iconColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-700',
        }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Travel Tips & Advice</h2>
        <p className="text-gray-600 mt-1">Important information for your trip</p>
      </div>

      {tips.map((tipCategory) => (
        <section key={tipCategory.category} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            {tipCategory.category}
          </h3>

          <div className="space-y-3">
            {tipCategory.items?.map((tip: any) => {
              const config = getLevelConfig(tip.level)
              const Icon = config.icon

              return (
                <div
                  key={tip.id}
                  className={`${config.bgColor} ${config.borderColor} border rounded-xl p-5 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      {/* Short Title & Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <h4 className={`font-semibold ${config.textColor} text-lg`}>
                          {tip.short}
                        </h4>
                        <span
                          className={`${config.badgeColor} px-3 py-1 rounded-full text-xs font-semibold uppercase flex-shrink-0`}
                        >
                          {tip.level}
                        </span>
                      </div>

                      {/* Detailed Description */}
                      <p className="text-gray-700 leading-relaxed">{tip.detail}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}