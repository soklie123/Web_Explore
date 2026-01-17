'use client'

import { useState, useMemo, useEffect } from "react"
import CountryList from "../user/components/list/CountryList"
import ExploreFilter from "./cards/ExploreFilter"
import { CountryCardData } from "@/lib/types"
import { getAllCountriesWithRegion } from "@/lib/country-utils"
import { Loader2 } from "lucide-react"

export default function Explore() {
  // ----------------------
  // State for API data
  // ----------------------
  const [allCountries, setAllCountries] = useState<CountryCardData[]>([])
  const [loading, setLoading] = useState(true)

  // ----------------------
  // State for filters
  // ----------------------
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("")
  const [sort, setSort] = useState("")
  
  // ----------------------
  // Pagination State
  // ----------------------
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12 // Show 12 countries per page

  // ----------------------
  // Fetch countries from API
  // ----------------------
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        
        const countriesWithRegion = getAllCountriesWithRegion(data)
        setAllCountries(countriesWithRegion)
      } catch (err) {
        console.error('Error fetching countries:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])
  
  // ----------------------
  // Real-time filtering with useMemo (derived state)
  // ----------------------
  const filteredCountries = useMemo(() => {
    let filtered = [...allCountries]

    // 1. Search Algorithm - Case-insensitive substring match
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.capital.toLowerCase().includes(searchLower)
      )
    }

    // 2. Region Filter - Case-insensitive exact match
    if (region !== "") {
      filtered = filtered.filter(c => 
        c.region.toLowerCase() === region.toLowerCase()
      )
    }

    // 3. Sort Algorithm
    if (sort === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "population") {
      // Note: API data might not have population, so this may need adjustment
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [allCountries, search, region, sort]) // Recalculates when filters change

  // ----------------------
  // Pagination Algorithm - Calculate paginated data
  // ----------------------
  const paginatedCountries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredCountries.slice(startIndex, endIndex)
  }, [filteredCountries, currentPage])

  // ----------------------
  // Handle filter changes from ExploreFilter component
  // ----------------------
  const handleFilterChange = (filters: {
    search: string
    region: string
    sort: string
  }) => {
    setSearch(filters.search)
    setRegion(filters.region)
    setSort(filters.sort)
    // Reset to page 1 when filters change
    setCurrentPage(1)
  }

  // ----------------------
  // Handle page change
  // ----------------------
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // ----------------------
  // Loading State
  // ----------------------
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
    <main className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Filters with Pagination */}
      <ExploreFilter 
        search={search}
        region={region}
        sort={sort}
        onFilterChange={handleFilterChange}
        resultCount={filteredCountries.length}
        totalCountries={filteredCountries.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* No Results Message */}
      {filteredCountries.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No countries found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => handleFilterChange({ search: "", region: "", sort: "" })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Countries List - Only shows paginated items */}
      {filteredCountries.length > 0 && (
        <CountryList
          title="" // Remove title since ExploreFilter already shows header
          description=""
          countries={paginatedCountries}
        />
      )}
    </main>
  )
}