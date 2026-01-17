"use client"

import { useState, useMemo } from "react"
import type { Country } from "@/lib/types"

interface ComparisonData {
  label: string
  country1: string
  country2: string
}

interface CountryComparisonProps {
  countries: Country[]
}

export function CountryComparison({ countries }: CountryComparisonProps) {
  const [selectedCountries, setSelectedCountries] = useState<(Country | null)[]>([null, null])

  const countriesList = Array.isArray(countries) ? countries : []

  const handleSelectCountry = (index: number, country: Country | null) => {
    const newSelected = [...selectedCountries]
    newSelected[index] = country
    setSelectedCountries(newSelected)
  }

  // Generate comparison data (only safe fields from your type)
  const comparisonData = useMemo<ComparisonData[] | null>(() => {
    if (!selectedCountries[0] || !selectedCountries[1]) return null

    const c1 = selectedCountries[0]
    const c2 = selectedCountries[1]

    return [
      {
        label: "Capital",
        country1: c1.capital || "N/A",
        country2: c2.capital || "N/A",
      },
      {
        label: "Overview",
        country1: c1.overview?.short_description || "N/A",
        country2: c2.overview?.short_description || "N/A",
      },
    ]
  }, [selectedCountries])

  return (
    <div className="space-y-6">
      {/* Country Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {selectedCountries[index]?.name || "Select Country"}
            </h3>

            {selectedCountries[index]?.flag && (
              <img
                src={selectedCountries[index].flag}
                alt={selectedCountries[index].name}
                className="w-full h-40 object-cover rounded-xl mb-4 border border-slate-100"
              />
            )}

            <select
              value={selectedCountries[index]?.name || ""}
              onChange={(e) => {
                const country = countriesList.find((c) => c.name === e.target.value) || null
                handleSelectCountry(index, country)
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select a country...</option>
              {countriesList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
            </select>

            {selectedCountries[index] && (
              <button
                onClick={() => handleSelectCountry(index, null)}
                className="mt-4 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {comparisonData ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Metric
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedCountries[0]?.name}
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedCountries[1]?.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.label}</td>
                  <td className="px-6 py-4 text-center text-slate-900">{row.country1}</td>
                  <td className="px-6 py-4 text-center text-slate-900">{row.country2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">
            Select two countries above to start comparing their statistics
          </p>
        </div>
      )}
    </div>
  )
}
