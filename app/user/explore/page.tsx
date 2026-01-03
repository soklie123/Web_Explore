'use client'

import { useState, useMemo } from "react"
import CountryList from "../countries/list/CountryList"
import { countries as allCountries } from "../countries/list/DataCard"
import ExploreFilter from "./cards/ExploreFilter"

export default function Explore() {
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
  // Real-time filtering with useMemo (derived state)
  // ----------------------
  const filteredCountries = useMemo(() => {
    let filtered = [...allCountries]

    // 1. Search Algorithm - Case-insensitive substring match
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower)
      )
    }

    // 2. Region Filter - Exact match
    if (region !== "") {
      filtered = filtered.filter(c => 
        c.region.toLowerCase() === region.toLowerCase()
      )
    }

    // 3. Sort Algorithm
    if (sort === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "population") {
      filtered = filtered.sort((a, b) => 
        parseInt(b.population) - parseInt(a.population)
      )
    }

    return filtered
  }, [search, region, sort]) // Recalculates when filters change

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

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
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

      {/* Countries List - Only shows paginated items */}
      <CountryList
        title="List All Countries"
        description="Discover our handpicked selection of must-visit destinations"
        countries={paginatedCountries}
      />
    </main>
  )
}