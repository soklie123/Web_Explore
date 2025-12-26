'use client'
import MainPage from './countries/components/MainPage'
import CountryList from './countries/components/CountryList'
import { DiscoveryJourney } from './countries/components/DiscoverJourney'
import ViewList from './countries/recentView/ViewList'
import PopularCountryList from './countries/components/PopularCountryList'
import ExploreMoreSection from './countries/components/ExploreMoreSection'

const page = () => {
  return (
    <>
        <MainPage/>

        <DiscoveryJourney/>
        <CountryList/>

        <ViewList/>
        <PopularCountryList/>
        <ExploreMoreSection/>

    </>
  )
}

export default page