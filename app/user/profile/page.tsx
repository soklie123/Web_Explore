'use client'

import { useEffect } from 'react'
import ProfileView from './info/ProfileView'
import CountryList from '../countries/list/CountryList'
import { countries } from '../countries/list/DataCard'

const RecentActivity = () => {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.getElementById(hash.substring(1))
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <main>
      <ProfileView />

      <div id="recent-activities">
        <CountryList 
          title="Recent Activities"
          description="Discover our handpicked selection of must-visit destinations"
          countries={countries}
          horizontalScroll={true}
        />
      </div>
    </main>
  )
}

export default RecentActivity
