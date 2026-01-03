'use client'

import { useEffect, useState } from 'react'
import MainPage from './countries/components/MainPage'
import CountryList from './countries/list/CountryList'
import ExploreMoreSection from './countries/components/ExploreMoreSection'
import { DiscoveryJourney } from './countries/components/DiscoverJourney'
import { countries as allCountries } from './countries/list/DataCard'

const Home = () => {
  const [recentCountries, setRecentCountries] = useState<typeof allCountries>([])

  useEffect(() => {
    if (typeof window === 'undefined') return // Only run on client

   setTimeout(() => {
      const viewedSlugs: string[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      if (viewedSlugs.length === 0) return

      const filtered = allCountries.filter(c => viewedSlugs.includes(c.slug))
      filtered.sort((a, b) => viewedSlugs.indexOf(a.slug) - viewedSlugs.indexOf(b.slug))

      setRecentCountries(filtered)
    }, 0)
  }, [])

  return (
    <>
      <MainPage/>
      <DiscoveryJourney/>

      <CountryList
        title="Featured Countries"
        description="Discover our handpicked selection of must-visit destinations"
        countries={allCountries}
      />

      {/* Horizontal scroll section - Recently Viewed */}
      {recentCountries.length > 0 && (
        <CountryList
          id="countries-visited"
          title="Recently Viewed"
          description="Continue exploring where you left off"
          countries={recentCountries}
          horizontalScroll={true}
        />
      )}

      <CountryList
        id="countries-popular"
        title="Popular Destinations"
        description="Trending countries loved by our community"
        countries={allCountries}
      />

      <ExploreMoreSection/>
    </>
  )
}

export default Home
