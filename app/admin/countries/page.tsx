"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart } from "lucide-react"

export default function ManageCountriesPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [filteredCountries, setFilteredCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [regions, setRegions] = useState<string[]>([])
  const [featured, setFeatured] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries")
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        const countriesArray = Array.isArray(data) ? data : []

        setCountries(countriesArray)
        setFilteredCountries(countriesArray)

        const uniqueRegions = [...new Set(countriesArray.map((c: any) => c.region))].filter(Boolean).sort()
        setRegions(uniqueRegions as string[])

        const storedFeatured = JSON.parse(localStorage.getItem("featuredCountries") || "[]")
        setFeatured(storedFeatured)
      } catch (error) {
        console.error("Error fetching countries:", error)
        setError("Failed to load countries. Please try again later.")
        setCountries([])
        setFilteredCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    let filtered = Array.isArray(countries) ? countries : []

    if (searchTerm) {
      filtered = filtered.filter((c: any) => c.name?.common?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((c: any) => c.region === selectedRegion)
    }

    setFilteredCountries(filtered)
  }, [countries, searchTerm, selectedRegion])

  const toggleFeatured = (countryName: string) => {
    const newFeatured = featured.includes(countryName)
      ? featured.filter((c) => c !== countryName)
      : [...featured, countryName]

    setFeatured(newFeatured)
    localStorage.setItem("featuredCountries", JSON.stringify(newFeatured))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading countries...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500 p-4">{error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Countries</h1>
          <p className="text-muted-foreground">View, filter, and manage countries from the REST Countries API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Search Country</label>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Filter by Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-input border border-input rounded-md text-sm"
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCountries.length} of {countries.length} countries
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Countries Database</CardTitle>
            <CardDescription>Click the heart icon to mark countries as featured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Area (km²)</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(filteredCountries) &&
                    filteredCountries.map((country: any) => (
                      <TableRow key={country.name?.common || country.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{country.flag}</span>
                            {country.name?.common || country.name}
                          </div>
                        </TableCell>
                        <TableCell>{country.region || "N/A"}</TableCell>
                        <TableCell>{country.population?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell>{country.area?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => toggleFeatured(country.name?.common || country.name)}
                            className={`p-2 rounded-md transition-colors ${
                              featured.includes(country.name?.common || country.name)
                                ? "bg-red-500/20 text-red-500"
                                : "bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              size={20}
                              fill={featured.includes(country.name?.common || country.name) ? "currentColor" : "none"}
                            />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
