'use client'

import { useEffect, useState } from 'react'
import ProfileView from './info/ProfileView'
import CountryList from '../user/components/list/CountryList'
import { CountryCardData } from "@/lib/types"
import { getAllCountriesWithRegion, createSlugFromName } from "@/lib/country-utils"
import { Loader2 } from 'lucide-react'

const RecentActivity = () => {
  const [recentCountries, setRecentCountries] = useState<CountryCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.getElementById(hash.substring(1))
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Fetch countries and match with recently viewed
  useEffect(() => {
    const fetchRecentCountries = async () => {
      try {
        // Get recently viewed slugs from localStorage
        const viewedSlugs: string[] = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        )

        if (viewedSlugs.length === 0) {
          setLoading(false)
          return
        }

        // Fetch all countries from API
        const response = await fetch('/api/countries')
        const data = await response.json()
        
        const allCountries = getAllCountriesWithRegion(data)

        // Filter countries that match recently viewed slugs
        const filtered = allCountries.filter(c => 
          viewedSlugs.includes(createSlugFromName(c.name))
        )

        // Sort by order in viewedSlugs (most recent first)
        filtered.sort((a, b) => {
          const slugA = createSlugFromName(a.name)
          const slugB = createSlugFromName(b.name)
          return viewedSlugs.indexOf(slugA) - viewedSlugs.indexOf(slugB)
        })

        setRecentCountries(filtered)
      } catch (err) {
        console.error('Error fetching recent countries:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentCountries()
  }, [])

  return (
    <main>
      <ProfileView />

      <div id="recent-activities" className="bg-gray-50 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : recentCountries.length > 0 ? (
          <CountryList 
            title="Recent Activities"
            description="Continue exploring where you left off"
            countries={recentCountries}
            horizontalScroll={true}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">Start exploring countries to see your recent activity here</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default RecentActivity