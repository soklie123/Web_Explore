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
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // Filter countries by search term
  const filteredCountries = useMemo(() => {
    return countryList.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [countryList, searchTerm])

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Flag</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Country</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <tr
                      key={country.id}
                      onClick={() => setSelectedCountry(country)}
                      className="hover:bg-slate-700/50 cursor-pointer transition"
                    >
                      <td className="px-6 py-3 text-2xl">
                        {country.flag ? <img src={country.flag} alt={country.name} className="w-6 h-4 object-cover" /> : "🌍"}
                      </td>
                      <td className="px-6 py-3 text-slate-300 font-medium">{country.name}</td>
                      <td className="px-6 py-3 text-slate-400">{country.capital || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
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
              <h3 className="text-xl font-bold text-white">{selectedCountry.name}</h3>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {selectedCountry.flag && (
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 text-sm text-white">
              <div>
                <p className="text-slate-400">Capital</p>
                <p className="font-medium">{selectedCountry.capital || "N/A"}</p>
              </div>

              {selectedCountry.overview?.short_description && (
                <div>
                  <p className="text-slate-400">Overview</p>
                  <p className="font-medium">{selectedCountry.overview.short_description}</p>
                </div>
              )}
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
