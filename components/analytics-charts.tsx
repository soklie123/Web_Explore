"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsChartsProps {
  countries: any[]
  allCountries: any[]
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

  // Region distribution data
  const regionData = useMemo(() => {
    const regionCounts: Record<string, number> = {}
    dataToAnalyze.forEach((country: any) => {
      if (country.region) {
        regionCounts[country.region] = (regionCounts[country.region] || 0) + 1
      }
    })

    return Object.entries(regionCounts)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => (b.value as number) - (a.value as number))
  }, [dataToAnalyze])

  // Largest countries by area
  const largestCountries = useMemo(() => {
    return dataToAnalyze
      .filter((c: any) => c.area)
      .sort((a: any, b: any) => (b.area as number) - (a.area as number))
      .slice(0, 8)
      .map((c: any) => ({
        name: c.name.common,
        area: ((c.area as number) / 1e6).toFixed(2),
      }))
  }, [dataToAnalyze])

  // Most populated countries
  const mostPopulated = useMemo(() => {
    return dataToAnalyze
      .filter((c: any) => c.population)
      .sort((a: any, b: any) => (b.population as number) - (a.population as number))
      .slice(0, 8)
      .map((c: any) => ({
        name: c.name.common,
        population: ((c.population as number) / 1e6).toFixed(0),
      }))
  }, [dataToAnalyze])

  // Population distribution by ranges
  const populationDistribution = useMemo(() => {
    const ranges: Record<string, number> = {
      "Under 1M": 0,
      "1M - 10M": 0,
      "10M - 50M": 0,
      "50M - 100M": 0,
      "100M+": 0,
    }

    dataToAnalyze.forEach((country: any) => {
      if (!country.population) return
      const pop = (country.population as number) / 1e6
      if (pop < 1) ranges["Under 1M"]++
      else if (pop < 10) ranges["1M - 10M"]++
      else if (pop < 50) ranges["10M - 50M"]++
      else if (pop < 100) ranges["50M - 100M"]++
      else ranges["100M+"]++
    })

    return Object.entries(ranges).map(([name, value]) => ({ name, value }))
  }, [dataToAnalyze])

  // Language distribution (most common languages)
  const languageDistribution = useMemo(() => {
    const langCount: Record<string, number> = {}
    dataToAnalyze.forEach((country: any) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang: any) => {
          langCount[lang] = (langCount[lang] || 0) + 1
        })
      }
    })

    return Object.entries(langCount)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 10)
  }, [dataToAnalyze])

  const COLORS = [
    "#3b82f6",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#f43f5e",
    "#6366f1",
    "#14b8a6",
    "#f97316",
  ]

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
              {selectedRegion !== "all" ? ` in ${selectedRegion}` : ""}
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

      {/* Region Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Region Distribution ({dataToAnalyze.length} countries)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Largest Countries */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top 8 Largest Countries (by Area)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={largestCountries} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="area" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Populated Countries */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top 8 Most Populated Countries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostPopulated}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="population" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Population Distribution by Size</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={populationDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {populationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Languages */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top 10 Most Spoken Languages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
