'use client'
import MainPage from './countries/components/MainPage'
import CountryList from './countries/list/CountryList'
import ExploreMoreSection from './countries/components/ExploreMoreSection'
import { DiscoveryJourney } from './countries/components/DiscoverJourney'
import { countries } from './countries/list/DataCard'
import PopularCountryList from './countries/list/PopularCountryList'

const page = () => {
  return (
    <>
        <MainPage/>

        <DiscoveryJourney/>

        {/* Grid section */}
        <CountryList
          title="Featured Countries"
          description="Discover our handpicked selection of must-visit destinations"
          countries={countries}
        />

        {/* Horizontal scroll section */}
        <CountryList
          title="Recently Viewed"
          description="Continue exploring where you left off"
          countries={countries}
          horizontalScroll={true}
        />

        <PopularCountryList
          id="popular"
          title="Popular Destinations"
          description="Trending countries loved by our community"
          countries={countries}
          />

        <ExploreMoreSection/>

    </>
  )
}

export default page