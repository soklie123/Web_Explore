"use client"

import { useState, useMemo } from "react"
import type { Country } from "@/lib/types"

interface ComparisonData {
  label: string
  country1: string
  country2: string
  value1?: number
  value2?: number
}

export function CountryComparison({ countries }: { countries: Country[] }) {
  const [selectedCountries, setSelectedCountries] = useState<(Country | null)[]>([null, null])

  const countriesList = Array.isArray(countries) ? countries : []

  const handleSelectCountry = (index: number, country: Country | null) => {
    const newSelected = [...selectedCountries]
    newSelected[index] = country
    setSelectedCountries(newSelected)
  }

  const comparisonData = useMemo<ComparisonData[] | null>(() => {
    if (!selectedCountries[0] || !selectedCountries[1]) return null

    const c1 = selectedCountries[0]
    const c2 = selectedCountries[1]
    return [
      {
        label: "Population",
        country1: ((c1?.population || 0) / 1e6).toFixed(1) + "M",
        country2: ((c2?.population || 0) / 1e6).toFixed(1) + "M",
        value1: c1?.population,
        value2: c2?.population,
      },
      {
        label: "Area (km²)",
        country1: ((c1?.area || 0) / 1e6).toFixed(2) + "M",
        country2: ((c2?.area || 0) / 1e6).toFixed(2) + "M",
        value1: c1?.area,
        value2: c2?.area,
      },
      {
        label: "Population Density",
        country1: c1?.area ? (((c1.population || 0) / c1.area) * 1000).toFixed(0) + "/km²" : "N/A",
        country2: c2?.area ? (((c2.population || 0) / c2.area) * 1000).toFixed(0) + "/km²" : "N/A",
        value1: c1?.area ? ((c1.population || 0) / c1.area) * 1000 : 0,
        value2: c2?.area ? ((c2.population || 0) / c2.area) * 1000 : 0,
      },
      {
        label: "Capital",
        country1: c1?.capital?.[0] || "N/A",
        country2: c2?.capital?.[0] || "N/A",
      },
      {
        label: "Region",
        country1: c1?.region || "N/A",
        country2: c2?.region || "N/A",
      },
      {
        label: "Subregion",
        country1: c1?.subregion || "N/A",
        country2: c2?.subregion || "N/A",
      },
      {
        label: "Languages",
        country1: c1?.languages ? Object.values(c1.languages).join(", ") : "N/A",
        country2: c2?.languages ? Object.values(c2.languages).join(", ") : "N/A",
      },
      {
        label: "Currencies",
        country1: c1?.currencies
          ? Object.values(c1.currencies)
              .map((c) => c.name)
              .join(", ")
          : "N/A",
        country2: c2?.currencies
          ? Object.values(c2.currencies)
              .map((c) => c.name)
              .join(", ")
          : "N/A",
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
              {selectedCountries[index] ? selectedCountries[index]?.name.common : "Select Country"}
            </h3>

            {selectedCountries[index] && selectedCountries[index]?.flags?.svg && (
              <img
                src={selectedCountries[index]?.flags?.svg || "/placeholder.svg"}
                alt={selectedCountries[index]?.name.common || "Country"}
                className="w-full h-40 object-cover rounded-xl mb-4 border border-slate-100"
              />
            )}

            <select
              value={selectedCountries[index]?.name.common || ""}
              onChange={(e) => {
                const country = countriesList.find((c) => c.name.common === e.target.value)
                handleSelectCountry(index, country || null)
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select a country...</option>
              {[...countriesList]
                .sort((a, b) => a.name.common.localeCompare(b.name.common))
                .map((country) => (
                  <option key={country.name.common} value={country.name.common}>
                    {country.name.common}
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
      {comparisonData && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Metric
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedCountries[0]?.name.common}
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedCountries[1]?.name.common}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.label}</td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    <span className="font-semibold">{row.country1}</span>
                    {row.value1 !== undefined && row.value2 !== undefined && (
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24 mx-auto">
                        <div
                          className="bg-linear-to-r from-blue-500 to-cyan-500 h-full"
                          style={{
                            width: `${(row.value1 / Math.max(row.value1, row.value2)) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    <span className="font-semibold">{row.country2}</span>
                    {row.value1 !== undefined && row.value2 !== undefined && (
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24 mx-auto">
                        <div
                          className="bg-linear-to-r from-blue-500 to-cyan-500 h-full"
                          style={{
                            width: `${(row.value2 / Math.max(row.value1, row.value2)) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedCountries[0] || !selectedCountries[1] ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">Select two countries above to start comparing their statistics</p>
        </div>
      ) : null}
    </div>
  )
}
