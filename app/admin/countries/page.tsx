"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent,  CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api-service"
import { Trash2, Edit, Plus } from "lucide-react"
import { Country } from "@/lib/types"
import { Law, Attraction, Tip } from "@/lib/types"
import {
  Globe,
  Map as MapIcon,
  Users,
  Eye,
} from "lucide-react"


const CATEGORIES = ["Laws", "Attractions", "Things To Do", "Tips"]

export default function ManageCountriesPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [filteredCountries, setFilteredCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [regions, setRegions] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<any>(null)
  const [editingCountry, setEditingCountry] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    capital: "",
    flag: "",
    image: "",
    overview: { short_description: "", currency: "", language: "" },
  })

 useEffect(() => {
  const fetchCountries = async () => {
    try {
      const data = await apiService.getAllCountries()
      setCountries(data)
      setFilteredCountries(data)

      const uniqueRegions = [...new Set(data.map((c: any) => c.region))]
        .filter(Boolean)
        .sort()

      setRegions(uniqueRegions as string[])
    } catch (error) {
      console.error(" Error loading countries:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchCountries()
}, [])


  useEffect(() => {
    let filtered = countries

    if (searchTerm) {
      filtered = filtered.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((c) => c.region === selectedRegion)
    }

    setFilteredCountries(filtered)
  }, [countries, searchTerm, selectedRegion])

  const handleAddCountry = () => {
    setEditingCountry(null)
    setFormData({
      name: "",
      region: "",
      capital: "",
      flag: "",
      image: "",
      overview: { short_description: "", currency: "", language: "" },
    })
    setShowModal(true)
  }

  const handleEditCountry = (country: any) => {
    setEditingCountry(country)
    setFormData(country)
    setShowModal(true)
  }

  const handleDeleteCountry = (country: any) => {
    setCountryToDelete(country)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (countryToDelete) {
      const updated = countries.filter((c) => c.id !== countryToDelete.id)
      setCountries(updated)
      setFilteredCountries(updated)
      setShowDeleteModal(false)
      setCountryToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setCountryToDelete(null)
  }

  const handleSaveCountry = () => {
    if (!formData.name || !formData.region) {
      alert("Please fill in required fields")
      return
    }

    if (editingCountry) {
      // Update existing country
      const updated = countries.map((c) => (c.id === editingCountry.id ? { ...editingCountry, ...formData } : c))
      setCountries(updated)
      setFilteredCountries(updated)
    } else {
      // Add new country
      const newCountry = {
        id: Date.now().toString(),
        ...formData,
      }
      setCountries([...countries, newCountry])
      setFilteredCountries([...countries, newCountry])
    }

    setShowModal(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading countries...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Countries</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or delete country information</p>
          </div>
          <Button onClick={handleAddCountry} className="gap-2">
            <Plus size={16} /> Add Country
          </Button>
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
            <CardDescription>Manage all country information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {filteredCountries.map((country, index) => (
                <div key={`${country.name || "country"}-${index}`} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{country.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{country.overview?.short_description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-blue-600" />
                          <span className="text-sm">
                            <strong>Region:</strong> {country.region || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapIcon size={16} className="text-green-600" />
                          <span className="text-sm">
                            <strong>Capital:</strong> {country.capital || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-purple-600" />
                          <span className="text-sm">
                            <strong>Currency:</strong> {country.overview?.currency || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} className="text-teal-600" />
                          <span className="text-sm">
                            <strong>Language:</strong> {country.overview?.language || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Laws: {country.laws?.reduce((sum: number, l: any) => sum + (l.laws?.length || 0), 0)}
                        </Badge>
                        <Badge variant="outline">Attractions: {country.attractions?.length || 0}</Badge>
                        <Badge variant="outline">Things To Do: {country.thingsToDo?.length || 0}</Badge>
                        <Badge variant="outline">Tips: {country.tips?.length || 0}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditCountry(country)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteCountry(country)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingCountry ? "Edit Country" : "Add New Country"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Country Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Japan"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Region *</label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., Asia"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Capital</label>
                  <Input
                    value={formData.capital}
                    onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                    placeholder="e.g., Tokyo"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formData.overview?.short_description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overview: { ...formData.overview, short_description: e.target.value },
                      })
                    }
                    placeholder="Country description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country Image (Upload from Computer)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    className="mt-1"
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSaveCountry}>
                    {editingCountry ? "Update" : "Add"} Country
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Confirm Delete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Delete this tip?
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={cancelDelete}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1" 
                    onClick={confirmDelete}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}