"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"

interface Tip {
  id: string
  country: string
  category: string
  text: string
}

export default function ManageTipsPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [formData, setFormData] = useState({ country: "", category: "", text: "" })
  const [loading, setLoading] = useState(true)

  const categories = ["Timing", "Rules", "Culture", "Food", "Transport", "Other"]

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries")
        const data = await response.json()

        if (Array.isArray(data)) {
          const countryNames = data.map((c: any) => c.name.common).sort()
          setCountries(countryNames)
        } else {
          console.error("[v0] API returned non-array data:", data)
          setCountries([])
        }

        const storedTips = JSON.parse(localStorage.getItem("travelTips") || "[]")
        setTips(storedTips)
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleAddTip = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.country || !formData.category || !formData.text) {
      alert("Please fill in all fields")
      return
    }

    const newTip: Tip = {
      id: Date.now().toString(),
      country: formData.country,
      category: formData.category,
      text: formData.text,
    }

    const updatedTips = [...tips, newTip]
    setTips(updatedTips)
    localStorage.setItem("travelTips", JSON.stringify(updatedTips))
    setFormData({ country: "", category: "", text: "" })
  }

  const handleDeleteTip = (id: string) => {
    const updatedTips = tips.filter((tip) => tip.id !== id)
    setTips(updatedTips)
    localStorage.setItem("travelTips", JSON.stringify(updatedTips))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  const tipsGroupedByCountry = tips.reduce((acc: Record<string, Tip[]>, tip) => {
    if (!acc[tip.country]) acc[tip.country] = []
    acc[tip.country].push(tip)
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Tips & Hints</h1>
          <p className="text-muted-foreground">Add and manage travel tips for countries</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Tip</CardTitle>
            <CardDescription>Create a travel tip for a country</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTip} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-input border border-input rounded-md text-sm"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-input border border-input rounded-md text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button type="submit" className="w-full" size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Tip
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tip Text</label>
                <Textarea
                  placeholder="E.g., Best time to visit Japan is April when cherry blossoms bloom."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Tips ({tips.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(tipsGroupedByCountry).map(([country, countryTips]) => (
                <div key={country} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-lg">{country}</h3>
                  <div className="space-y-2">
                    {countryTips.map((tip) => (
                      <div key={tip.id} className="flex items-start justify-between p-3 bg-muted rounded-md">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-primary">{tip.category}</div>
                          <p className="text-sm mt-1">{tip.text}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteTip(tip.id)}
                          className="ml-4 p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {tips.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No tips yet. Add your first tip above!</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
