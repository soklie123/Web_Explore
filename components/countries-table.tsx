"use client"

import type { Country } from "@/lib/types"

interface CountriesTableProps {
  countries: Country[]
  filteredCountries: Country[]

  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>

  selectedRegion: string
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>

  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>
}

export function CountriesTable({
  countries,
  filteredCountries,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  sortBy,
  setSortBy,
}: CountriesTableProps) {
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search country..."
          className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
        />

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
        >
          <option value="all">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
        >
          <option value="name">Name</option>
          <option value="population">Population</option>
          <option value="area">Area</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full text-sm text-slate-300">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Region</th>
              <th className="px-4 py-3 text-right">Population</th>
              <th className="px-4 py-3 text-right">Area</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map((country) => (
              <tr key={country.cca3} className="border-t border-slate-700">
                <td className="px-4 py-3">
                  {country.name?.common ?? "Unknown"}
                </td>
                <td className="px-4 py-3">
                  {country.region ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {country.population?.toLocaleString() ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {country.area?.toLocaleString() ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
