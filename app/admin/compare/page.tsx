"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CountryComparison } from "@/components/country-comparison"
import type { Country } from "@/lib/types"

export default function ComparePage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries")
        const data = await response.json()
        setCountries(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Compare Countries</h1>
          <p className="text-muted-foreground">Compare statistics between countries side by side</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Countries to Compare</CardTitle>
            <CardDescription>Choose up to 4 countries to compare their statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <CountryComparison countries={countries} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
