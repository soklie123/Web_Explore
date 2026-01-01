"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "./dashboard-header"
import { OverviewStats } from "./overview-stats"
import { CountriesTable } from "./countries-table"
import { AnalyticsCharts } from "./analytics-charts"
import { CountryComparison } from "./country-comparison"
import type { Country } from "@/lib/types"

export function CountryDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      setError(null)

      // ⚠️ Use API route instead of direct RESTCountries call
      const response = await fetch("/api/countries", { cache: "no-store" })

      if (!response.ok) {
        throw new Error("Failed to fetch countries")
      }

      const data: Country[] = await response.json()
      setCountries(data)
    } catch (err) {
      setError("Failed to fetch countries")
      console.error("[CountryDashboard] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCountries = () => {
    let filtered = [...countries]

    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.name?.common?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((c) => c.region === selectedRegion)
    }

    if (sortBy === "population") {
      filtered.sort((a, b) => (b.population || 0) - (a.population || 0))
    } else if (sortBy === "area") {
      filtered.sort((a, b) => (b.area || 0) - (a.area || 0))
    } else {
      filtered.sort((a, b) =>
        (a.name?.common || "").localeCompare(b.name?.common || "")
      )
    }

    return filtered
  }

  const filteredCountries = getFilteredCountries()

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading countries data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchCountries}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewStats countries={countries} />}

        {activeTab === "countries" && (
          <CountriesTable
            countries={countries}
            filteredCountries={filteredCountries}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsCharts
            countries={filteredCountries}
            allCountries={countries}
            searchQuery={searchQuery}
            selectedRegion={selectedRegion}
            sortBy={sortBy}
          />
        )}

        {activeTab === "compare" && <CountryComparison countries={countries} />}
      </div>
    </div>
  )
}
