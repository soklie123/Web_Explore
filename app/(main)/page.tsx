'use client'

import { useEffect, useState } from "react"
import { DiscoveryJourney } from "./user/components/util/DiscoverJourney"
import CountryList from "./user/components/list/CountryList"
import ExploreMoreSection from "./user/components/util/ExploreMoreSection"
import MainPage from "./user/components/util/MainPage"
import { CountryCardData } from "@/lib/types"
import { getAllCountriesWithRegion, createSlugFromName } from "@/lib/country-utils"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [allCountries, setAllCountries] = useState<CountryCardData[]>([])
  const [featuredCountries, setFeaturedCountries] = useState<CountryCardData[]>([])
  const [recentCountries, setRecentCountries] = useState<CountryCardData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        
        const countriesWithRegion = getAllCountriesWithRegion(data)
        setAllCountries(countriesWithRegion)

        // Get featured countries from localStorage (set by admin)
        const featuredSlugs: string[] = JSON.parse(
          localStorage.getItem('featuredCountries') || '[]'
        )
        
        if (featuredSlugs.length > 0) {
          const featured = countriesWithRegion.filter(c =>
            featuredSlugs.includes(createSlugFromName(c.name))
          )
          setFeaturedCountries(featured)
        } else {
          // Fallback: show first 6 as featured
          setFeaturedCountries(countriesWithRegion.slice(0, 6))
        }
      } catch (err) {
        console.error('Error fetching countries:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Load recently viewed countries
  useEffect(() => {
    if (typeof window === 'undefined' || allCountries.length === 0) return

    const viewedSlugs: string[] = JSON.parse(
      localStorage.getItem('recentlyViewed') || '[]'
    )
    
    if (viewedSlugs.length === 0) return

    const filtered = allCountries.filter(c => 
      viewedSlugs.includes(createSlugFromName(c.name))
    )
    
    filtered.sort((a, b) => {
      const slugA = createSlugFromName(a.name)
      const slugB = createSlugFromName(b.name)
      return viewedSlugs.indexOf(slugA) - viewedSlugs.indexOf(slugB)
    })

    setRecentCountries(filtered)
  }, [allCountries])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <MainPage />
      <DiscoveryJourney />

      {/* Featured Countries */}
      {featuredCountries.length > 0 && (
        <CountryList
          title="Featured Countries"
          description="Discover our handpicked selection of must-visit destinations"
          countries={featuredCountries}
        />
      )}

      {/* Recently Viewed */}
      {recentCountries.length > 0 && (
        <CountryList
          id="countries-visited"
          title="Recently Viewed"
          description="Continue exploring where you left off"
          countries={recentCountries}
          horizontalScroll={true}
        />
      )}

      {/* Popular Destinations */}
      <CountryList
        id="countries-popular"
        title="Popular Destinations"
        description="Trending countries loved by our community"
        countries={allCountries}
      />

      <ExploreMoreSection />
    </>
  )
}