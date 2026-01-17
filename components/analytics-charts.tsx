"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Country } from "@/lib/types"

interface AnalyticsChartsProps {
  countries: Country[]
  allCountries: Country[]
  searchQuery: string
  selectedRegion: string
  sortBy: string
}

export function AnalyticsCharts({
  countries,
  allCountries,
  searchQuery,
  selectedRegion,
  sortBy,
}: AnalyticsChartsProps) {
  const countriesList = Array.isArray(countries) ? countries : []
  const allCountriesList = Array.isArray(allCountries) ? allCountries : []

  const [showGlobal, setShowGlobal] = useState(false)

  // Use global data if no filters applied
  const dataToAnalyze =
    (!searchQuery && selectedRegion === "all" && sortBy === "name") || showGlobal ? allCountriesList : countriesList

  // Example: Timezone distribution
  const regionData = useMemo(() => {
    const counts: Record<string, number> = {}
    dataToAnalyze.forEach((c) => {
      const tz = c.overview?.time_zone || "Unknown"
      counts[tz] = (counts[tz] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [dataToAnalyze])

  const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#f43f5e", "#6366f1"]

  const hasFilters = searchQuery || selectedRegion !== "all" || sortBy !== "name"

  return (
    <div className="space-y-6">
      {hasFilters && (
        <div className="bg-blue-900 border border-blue-700 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-blue-200 font-medium">Filtered Analytics View</p>
            <p className="text-blue-300 text-sm">
              Showing {countriesList.length} countries
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </p>
          </div>
          <button
            onClick={() => setShowGlobal(!showGlobal)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            {showGlobal ? "Show Filtered" : "Show Global"}
          </button>
        </div>
      )}

      {/* Timezone Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Timezone Distribution ({dataToAnalyze.length} countries)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Countries Overview */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Countries Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dataToAnalyze.map((country) => (
            <div key={country.id} className="bg-slate-700 rounded-xl p-4 text-white shadow-sm">
              <img src={country.flag} alt={country.name} className="w-full h-24 object-cover rounded-lg mb-4" />
              <h4 className="font-bold text-lg">{country.name}</h4>
              <p className="text-sm text-slate-300 mb-2">Capital: {country.capital || "N/A"}</p>
              <p className="text-sm text-slate-300">
                {country.overview?.short_description
                  ? country.overview.short_description.slice(0, 80) + "..."
                  : "No overview available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
