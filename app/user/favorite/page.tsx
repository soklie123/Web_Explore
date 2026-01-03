'use client'

import { useEffect, useState, useMemo } from 'react'
import CountryList, { Country } from "../countries/list/CountryList"
import { countries as allCountries } from "../countries/list/DataCard"
import FilterDropdowns from "./fav/FilterDropdowns"
import Link from 'next/link'

export default function Favorite() {
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  // Load favorites from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const favSlugs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]")
      const filtered = allCountries.filter((country: Country) => favSlugs.includes(country.slug))
      setFavoriteCountries(filtered)

      const hash = window.location.hash
      if (hash) {
        const el = document.getElementById(hash.substring(1))
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Get unique regions from favorite countries with counts
  const regionStats = useMemo(() => {
    const stats = favoriteCountries.reduce((acc, country) => {
      const region = country.region || 'Unknown'
      acc[region] = (acc[region] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(stats).map(([name, count]) => ({ name, count }))
  }, [favoriteCountries])

  // Filter countries based on selections
  const filteredFavorites = useMemo(() => {
    let filtered = [...favoriteCountries]

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(c => c.region === selectedRegion)
    }

    // Filter by specific country
    if (selectedCountry) {
      filtered = filtered.filter(c => c.name === selectedCountry)
    }

    return filtered
  }, [favoriteCountries, selectedRegion, selectedCountry])

  // Get country names for dropdown (based on selected region or all)
  const countryNames = useMemo(() => {
    const countries = selectedRegion 
      ? favoriteCountries.filter(c => c.region === selectedRegion)
      : favoriteCountries
    return countries.map(c => c.name)
  }, [favoriteCountries, selectedRegion])

  // Handle filter changes
  const handleFilterChange = (region: string, country: string) => {
    setSelectedRegion(region)
    setSelectedCountry(country)
  }

  // Clear all favorites
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      localStorage.setItem("favorites", "[]")
      setFavoriteCountries([])
      setSelectedRegion('')
      setSelectedCountry('')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
              <p className="text-blue-100 text-lg">
                {favoriteCountries.length === 0 
                  ? "You haven't saved any countries yet"
                  : `${favoriteCountries.length} ${favoriteCountries.length === 1 ? 'country' : 'countries'} saved`
                }
              </p>
            </div>
            
            {favoriteCountries.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {favoriteCountries.length > 0 && (
            <FilterDropdowns
              regions={regionStats}
              countries={countryNames}
              selectedRegion={selectedRegion}
              selectedCountry={selectedCountry}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      {/* Empty State */}
      {favoriteCountries.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6">Start exploring and save your favorite countries!</p>
            <Link
              href="/user/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Countries
            </Link>
          </div>
        </div>
      ) : (
        /* Countries List */
        <div className="max-w-7xl mx-auto px-4 py-8" id="favorite-saved">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No countries match your filters</p>
              <button
                onClick={() => {
                  setSelectedRegion('')
                  setSelectedCountry('')
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <CountryList
              title={selectedRegion || selectedCountry ? "Filtered Results" : "All Favorites"}
              description={
                selectedRegion || selectedCountry
                  ? `Showing ${filteredFavorites.length} ${filteredFavorites.length === 1 ? 'country' : 'countries'}`
                  : "Your favorite countries collection"
              }
              countries={filteredFavorites}
            />
          )}
        </div>
      )}
    </main>
  )
}