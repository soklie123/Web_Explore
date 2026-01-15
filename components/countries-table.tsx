"use client"

import type { Country } from "@/lib/types"
import { useState, useMemo } from "react"
import { Search } from "lucide-react"

interface CountriesTableProps {
  countries: Country[]
}

export function CountriesTable({ countries }: CountriesTableProps) {
  const countryList = Array.isArray(countries) ? countries : []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = new Set(countryList.map((c) => c.region).filter(Boolean))
    return ["All", ...Array.from(uniqueRegions).sort()]
  }, [countryList])

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    const result = countryList.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = selectedRegion === "All" || country.region === selectedRegion
      return matchesSearch && matchesRegion
    })

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.common.localeCompare(b.name.common)
        case "population":
          return (b.population || 0) - (a.population || 0)
        case "area":
          return (b.area || 0) - (a.area || 0)
        default:
          return 0
      }
    })

    return result
  }, [countryList, searchTerm, selectedRegion, sortBy])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="name">Sort by Name</option>
            <option value="population">Sort by Population</option>
            <option value="area">Sort by Area</option>
          </select>
        </div>
      </div>

      {/* Table and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Countries Table */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Flag</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Country</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Region</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Population</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <tr
                      key={country.name.common}
                      onClick={() => setSelectedCountry(country)}
                      className="hover:bg-slate-700/50 cursor-pointer transition"
                    >
                      <td className="px-6 py-3 text-2xl">
                        {country.flags?.png ? country.flags.png.split("/")[3] : "🌍"}
                      </td>
                      <td className="px-6 py-3 text-slate-300 font-medium">{country.name.common}</td>
                      <td className="px-6 py-3 text-slate-400">{country.region || "N/A"}</td>
                      <td className="px-6 py-3 text-right text-slate-300">
                        {country.population ? (country.population / 1e6).toFixed(1) + "M" : "N/A"}
                      </td>
                      <td className="px-6 py-3 text-right text-slate-300">
                        {country.area ? (country.area / 1e6).toFixed(2) + "M km²" : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No countries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Country Details */}
        {selectedCountry ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedCountry.name.common}</h3>
              <button onClick={() => setSelectedCountry(null)} className="text-slate-400 hover:text-white transition">
                ✕
              </button>
            </div>

            {selectedCountry.flags?.svg && (
              <img
                src={selectedCountry.flags.svg || "/placeholder.svg"}
                alt={selectedCountry.name.common}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Capital</p>
                <p className="text-white font-medium">{selectedCountry.capital?.[0] || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400">Region</p>
                <p className="text-white font-medium">{selectedCountry.region || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400">Sub-region</p>
                <p className="text-white font-medium">{selectedCountry.subregion || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400">Population</p>
                <p className="text-white font-medium">
                  {(selectedCountry.population ? (selectedCountry.population / 1e6).toFixed(1) : "0") + "M"}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Area</p>
                <p className="text-white font-medium">
                  {(selectedCountry.area ? (selectedCountry.area / 1e6).toFixed(2) : "0") + "M km²"}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Timezone</p>
                <p className="text-white font-medium">{selectedCountry.timezones?.[0] || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400">Languages</p>
                <p className="text-white font-medium">
                  {selectedCountry.languages ? Object.values(selectedCountry.languages).join(", ") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Currencies</p>
                <p className="text-white font-medium">
                  {selectedCountry.currencies
                    ? Object.values(selectedCountry.currencies)
                        .map((c) => c.name)
                        .join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-center text-slate-400">
            Select a country to view details
          </div>
        )}
      </div>
    </div>
  )
}

