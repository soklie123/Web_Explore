'use client'

import { useEffect, useState } from "react";
import { DiscoveryJourney } from "./user/components/util/DiscoverJourney";
import CountryList from "./user/components/list/CountryList";
import ExploreMoreSection from "./user/components/util/ExploreMoreSection";
import { countries as allCountries } from './user/components/list/DataCard'
import MainPage from "./user/components/util/MainPage";

export default function Home() {
  const [recentCountries, setRecentCountries] = useState<typeof allCountries>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

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
  );
}