"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api-service"
import { Trash2, Edit, Plus } from "lucide-react"

const CATEGORIES = ["Laws", "Attractions", "Things To Do", "Tips"]

/* =======================
   ✅ TYPES
======================= */

interface Overview {
  short_description?: string
  history?: string
  culture?: string
  best_time_to_visit?: string
  currency?: string
  language?: string
  climate?: string
}

interface LawItem {
  id: string
  title: string
  description?: string
  summary?: string
  category?: string
  /** derived when flattening from group */
  categoryGroup?: string
  status?: string
  image?: string
}

interface LawGroup {
  category: string
  laws: LawItem[]
}

interface Attraction {
  id: string
  title: string
  description?: string
  category?: string
  best_time_to_visit?: string
  image?: string
}

interface ThingToDo {
  id: string
  title: string
  description?: string
  duration?: string
  image?: string
}

interface Tip {
  id: string
  title: string
  description?: string
  image?: string
}

interface Country {
  id: string
  name: string
  region?: string
  flag?: string
  overview?: Overview
  laws?: LawGroup[]
  attractions?: Attraction[]
  thingsToDo?: ThingToDo[]
  tips?: Tip[]
}

type EditableItem = LawItem | Attraction | ThingToDo | Tip

interface FormState {
  title: string
  description: string
  category: string
  image: string
}

/* =======================
    COMPONENT
======================= */

export default function ManageTravelInfoPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "laws" | "attractions" | "thingsToDo" | "tips">("overview")
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string } | null>(null)
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null)
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    category: "Laws",
    image: "",
  })

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data: Country[] = await apiService.getAllCountries()
        setCountries(data)
        if (data.length > 0) setSelectedCountry(data[0])
      } catch (error) {
        console.error(" Error loading countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const filteredCountries: Country[] = countries.filter((c) => c.name?.toLowerCase().includes(""))

  /* =======================
      CRUD Handlers
  ======================= */

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      title: "",
      description: "",
      category:
        activeTab === "tips"
          ? "Tips"
          : activeTab === "thingsToDo"
          ? "Things To Do"
          : activeTab === "attractions"
          ? "Attractions"
          : "Laws",
      image: "",
    })
    setShowModal(true)
  }

  const handleEditItem = (item: EditableItem) => {
    setEditingItem(item)
    // If it's a law item, prefer existing category (category || categoryGroup)
    setFormData({
      title: item.title,
      description: (item as any).description ?? (item as any).summary ?? "",
      category:
        (item as LawItem).category ??
        (item as LawItem).categoryGroup ??
        formData.category,
      image: (item as any).image ?? "",
    })
    setShowModal(true)
  }

  const handleDeleteItem = (itemId: string, itemType: string) => {
    setItemToDelete({ id: itemId, type: itemType })
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!selectedCountry || !itemToDelete) return
    const { id: itemId, type: itemType } = itemToDelete
    const updated: Country = { ...selectedCountry }

    if (itemType === "law") {
      updated.laws = updated.laws?.map((cat: LawGroup) => ({
        ...cat,
        laws: cat.laws?.filter((l: LawItem) => l.id !== itemId),
      }))
    } else if (itemType === "attraction") {
      updated.attractions = (updated.attractions ?? []).filter((a: Attraction) => a.id !== itemId)
    } else if (itemType === "thingToDo") {
      updated.thingsToDo = (updated.thingsToDo ?? []).filter((t: ThingToDo) => t.id !== itemId)
    } else if (itemType === "tip") {
      updated.tips = (updated.tips ?? []).filter((t: Tip) => t.id !== itemId)
    }

    setSelectedCountry(updated)
    const updatedCountries = countries.map((c) => (c.id === updated.id ? updated : c))
    setCountries(updatedCountries)
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleSaveItem = () => {
    if (!selectedCountry) return
    if (!formData.title) {
      alert("Please fill in the title")
      return
    }

    const updated: Country = { ...selectedCountry }
    const newItem: EditableItem = {
      id: (editingItem?.id as string) || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      image: formData.image,
      ...(activeTab === "laws" ? { category: formData.category } : {}),
    } as EditableItem

    if (activeTab === "laws") {
      const groupIndex = (updated.laws ?? []).findIndex((l) => l.category === formData.category)
      if (groupIndex >= 0) {
        const group = updated.laws![groupIndex]
        if (editingItem) {
          group.laws = group.laws.map((l) => (l.id === (editingItem as LawItem).id ? (newItem as LawItem) : l))
        } else {
          group.laws = [...group.laws, newItem as LawItem]
        }
        updated.laws![groupIndex] = group
      } else {
        // Create new category group if it doesn't exist
        const newGroup: LawGroup = {
          category: formData.category,
          laws: [newItem as LawItem],
        }
        updated.laws = [...(updated.laws ?? []), newGroup]
      }
    } else if (activeTab === "attractions") {
      const list = updated.attractions ?? []
      updated.attractions = editingItem
        ? list.map((a) => (a.id === (editingItem as Attraction).id ? (newItem as Attraction) : a))
        : [...list, newItem as Attraction]
    } else if (activeTab === "thingsToDo") {
      const list = updated.thingsToDo ?? []
      updated.thingsToDo = editingItem
        ? list.map((t) => (t.id === (editingItem as ThingToDo).id ? (newItem as ThingToDo) : t))
        : [...list, newItem as ThingToDo]
    } else if (activeTab === "tips") {
      const list = updated.tips ?? []
      updated.tips = editingItem
        ? list.map((t) => (t.id === (editingItem as Tip).id ? (newItem as Tip) : t))
        : [...list, newItem as Tip]
    }

    setSelectedCountry(updated)
    const updatedCountries = countries.map((c) => (c.id === updated.id ? updated : c))
    setCountries(updatedCountries)
    setShowModal(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  /* =======================
      Derive tab data locally (no apiService.getXByCountry)
  ======================= */

  const laws: LawItem[] =
    selectedCountry?.laws?.flatMap((group) =>
      (group.laws ?? []).map((law) => ({ ...law, categoryGroup: group.category }))
    ) ?? []

  const attractions: Attraction[] = selectedCountry?.attractions ?? []
  const thingsToDo: ThingToDo[] = selectedCountry?.thingsToDo ?? []
  const tips: Tip[] = selectedCountry?.tips ?? []

  /* =======================
     ✅ UI
  ======================= */

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return selectedCountry?.overview ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{selectedCountry.overview.short_description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">History</h4>
              <p className="text-muted-foreground">{selectedCountry.overview.history}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Culture</h4>
              <p className="text-muted-foreground">{selectedCountry.overview.culture}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                <p className="font-semibold">{selectedCountry.overview.best_time_to_visit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-semibold">{selectedCountry.overview.currency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-semibold">{selectedCountry.overview.language}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Climate</p>
                <p className="font-semibold">{selectedCountry.overview.climate}</p>
              </div>
            </div>
          </div>
        ) : null

      case "laws":
        return (
          <div className="space-y-4">
            <Button onClick={handleAddItem} className="gap-2 mb-4">
              <Plus size={16} /> Add Law
            </Button>
            {laws.length === 0 ? (
              <p className="text-muted-foreground">No laws available</p>
            ) : (
              laws.map((law: LawItem) => (
                <div key={law.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{law.title}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(law)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(law.id, "law")}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{law.summary || law.description}</p>
                  <div className="flex gap-2 text-xs">
                    <Badge>Category: {law.categoryGroup || law.category}</Badge>
                    {law.status && <Badge>Status: {law.status}</Badge>}
                  </div>
                  {law.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img src={law.image || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )

      case "attractions":
        return (
          <div className="space-y-4">
            <Button onClick={handleAddItem} className="gap-2 mb-4">
              <Plus size={16} /> Add Attraction
            </Button>
            {attractions.length === 0 ? (
              <p className="text-muted-foreground">No attractions available</p>
            ) : (
              attractions.map((attraction: Attraction) => (
                <div key={attraction.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{attraction.title}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(attraction)}>
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(attraction.id, "attraction")}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{attraction.description}</p>
                  <div className="flex gap-2 text-xs">
                    <Badge>Category: {attraction.category}</Badge>
                    {attraction.best_time_to_visit && <Badge>Best Time: {attraction.best_time_to_visit}</Badge>}
                  </div>
                  {attraction.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img
                        src={attraction.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )

      case "thingsToDo":
        return (
          <div className="space-y-4">
            <Button onClick={handleAddItem} className="gap-2 mb-4">
              <Plus size={16} /> Add Thing To Do
            </Button>
            {thingsToDo.length === 0 ? (
              <p className="text-muted-foreground">No things to do available</p>
            ) : (
              thingsToDo.map((item: ThingToDo) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(item.id, "thingToDo")}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  {item.duration && <Badge>Duration: {item.duration}</Badge>}
                  {item.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img src={item.image || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )

      case "tips":
        return (
          <div className="space-y-4">
            <Button onClick={handleAddItem} className="gap-2 mb-4">
              <Plus size={16} /> Add Tip
            </Button>
            {tips.length === 0 ? (
              <p className="text-muted-foreground">No tips available</p>
            ) : (
              tips.map((tip: Tip) => (
                <div key={tip.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{tip.title}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(tip)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(tip.id, "tip")}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                  {tip.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img src={tip.image || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Travel Information</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit and delete country laws, attractions, things to do, and tips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Select Country</label>
            <div className="border rounded-lg max-h-[600px] overflow-y-auto">
              {filteredCountries.map((country: Country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country)}
                  className={`w-full text-left px-4 py-2 border-b hover:bg-muted transition-colors ${
                    selectedCountry?.id === country.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="font-medium text-sm">{country.name}</div>
                  <div className="text-xs text-muted-foreground">{country.region}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {selectedCountry?.flag && (
                    <img
                      src={selectedCountry.flag || "/placeholder.svg"}
                      alt={selectedCountry.name}
                      className="w-8 h-6 rounded"
                    />
                  )}
                  <CardTitle>{selectedCountry?.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 border-b mb-4 overflow-x-auto">
                  {(["overview", "laws", "attractions", "thingsToDo", "tips"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "thingsToDo" ? "Things To Do" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="max-h-[600px] overflow-y-auto">{renderContent()}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingItem ? `Edit ${activeTab}` : `Add ${activeTab}`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image (Upload from Computer)</label>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                  {formData.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
                {activeTab === "laws" && (
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-input border border-input rounded-md text-sm"
                    >
                      <option>Alcohol Laws</option>
                      <option>Smoking Laws</option>
                      <option>Drug Laws</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSaveItem}>
                    {editingItem ? "Update" : "Add"}
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