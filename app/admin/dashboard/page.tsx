"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewStats } from "@/components/overview-stats"
import { apiService } from "@/lib/api-service"

export default function AdminDashboard() {
  const [countries, setCountries] = useState<any[]>([])
  const [featuredCountries, setFeaturedCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await apiService.getAllCountries()
        setCountries(data)
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Read featured countries from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("featuredCountries") || "[]")
      setFeaturedCountries(stored)
    }
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-teal-500 p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold mb-2">Discover the World</h1>
            <p className="text-blue-50/80 text-lg">
              Manage your global explorer database, travel tips, and user analytics from one central hub.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />
        </div>

        {!loading && <OverviewStats countries={countries} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-slate-800">Total Countries</CardTitle>
              <CardDescription>Global database coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-blue-600">{countries.length}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-slate-800">Featured Countries</CardTitle>
              <CardDescription>Marked as featured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-blue-600">{featuredCountries.length}</div>
            </CardContent>
          </Card>

          {/* Additional card for user analytics can be added here */}
        </div>
      </div>
    </AdminLayout>
  )
}
