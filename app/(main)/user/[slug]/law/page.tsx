// app/(main)/user/[slug]/law/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { getCountryBySlug } from '@/lib/country-utils'

type Props = {
  params: Promise<{ slug: string }>
}

export default function LawsPage({ params }: Props) {
  const { slug } = use(params)
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const country = getCountryBySlug(data, slug)
        setLaws(country?.laws || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLaws()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (laws.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No laws data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Laws & Regulations</h2>

      {laws.map((categoryGroup) => (
        <section key={categoryGroup.category} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{categoryGroup.category}</h3>
          <div className="space-y-4">
            {categoryGroup.laws.map((law: any) => (
              <div key={law.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{law.title}</h4>
                <p className="text-gray-700 mb-2">{law.summary}</p>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-700 font-medium">Penalty: {law.penalty}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}