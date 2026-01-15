"use client"

import { Country } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CountriesTableProps {
  countries: Country[]
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedRegion: string
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  filteredCountries: Country[]
}

export function CountriesTable({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  sortBy,
  setSortBy,
  filteredCountries,
}: CountriesTableProps) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
            <SelectItem value="Americas">Americas</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Oceania">Oceania</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="population">Population</SelectItem>
            <SelectItem value="area">Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Region</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase">Population</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase">Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredCountries.map((country) => (
              <tr key={country.cca3} className="hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200">
                  {country.name?.common}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {country.region}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {country.population?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {country.area?.toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredCountries.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No countries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
