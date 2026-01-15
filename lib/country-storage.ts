"use client"

import type { CountryData, Law, Attraction, Tip } from "./types"

const COUNTRIES_STORAGE_KEY = "admin_countries"
const LAWS_STORAGE_KEY = "admin_laws"
const ATTRACTIONS_STORAGE_KEY = "admin_attractions"
const TIPS_STORAGE_KEY = "admin_tips"

// Country Storage
export const countryStorage = {
  getAllCountries: (): CountryData[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(COUNTRIES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  getCountry: (name: string): CountryData | undefined => {
    const countries = countryStorage.getAllCountries()
    return countries.find((c) => c.name.common.toLowerCase() === name.toLowerCase())
  },

  addCountry: (country: CountryData): CountryData => {
    const countries = countryStorage.getAllCountries()
    countries.push(country)
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(countries))
    return country
  },

  updateCountry: (name: string, updates: Partial<CountryData>): void => {
    const countries = countryStorage.getAllCountries()
    const index = countries.findIndex((c) => c.name.common.toLowerCase() === name.toLowerCase())
    if (index !== -1) {
      countries[index] = { ...countries[index], ...updates }
      localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(countries))
    }
  },

  deleteCountry: (name: string): void => {
    const countries = countryStorage.getAllCountries()
    const filtered = countries.filter((c) => c.name.common.toLowerCase() !== name.toLowerCase())
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(filtered))
  },
}

// Laws Storage
export const lawStorage = {
  getAllLaws: (): Law[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(LAWS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  getLawsByCountry: (countryName: string): Law[] => {
    const laws = lawStorage.getAllLaws()
    return laws.filter((l) => l.countryName.toLowerCase() === countryName.toLowerCase())
  },

  addLaw: (countryName: string, title: string, description: string): Law => {
    const laws = lawStorage.getAllLaws()
    const newLaw: Law = {
      id: Date.now().toString(),
      countryName,
      title,
      description,
      createdAt: new Date().toISOString(),
    }
    laws.push(newLaw)
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws))
    return newLaw
  },

  updateLaw: (id: string, title: string, description: string): void => {
    const laws = lawStorage.getAllLaws()
    const law = laws.find((l) => l.id === id)
    if (law) {
      law.title = title
      law.description = description
      localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws))
    }
  },

  deleteLaw: (id: string): void => {
    const laws = lawStorage.getAllLaws()
    const filtered = laws.filter((l) => l.id !== id)
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(filtered))
  },
}

// Attractions Storage
export const attractionStorage = {
  getAllAttractions: (): Attraction[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(ATTRACTIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  getAttractionsByCountry: (countryName: string): Attraction[] => {
    const attractions = attractionStorage.getAllAttractions()
    return attractions.filter((a) => a.countryName.toLowerCase() === countryName.toLowerCase())
  },

  addAttraction: (countryName: string, name: string, description: string, image?: string): Attraction => {
    const attractions = attractionStorage.getAllAttractions()
    const newAttraction: Attraction = {
      id: Date.now().toString(),
      countryName,
      name,
      description,
      image,
      createdAt: new Date().toISOString(),
    }
    attractions.push(newAttraction)
    localStorage.setItem(ATTRACTIONS_STORAGE_KEY, JSON.stringify(attractions))
    return newAttraction
  },

  updateAttraction: (id: string, name: string, description: string, image?: string): void => {
    const attractions = attractionStorage.getAllAttractions()
    const attraction = attractions.find((a) => a.id === id)
    if (attraction) {
      attraction.name = name
      attraction.description = description
      if (image) attraction.image = image
      localStorage.setItem(ATTRACTIONS_STORAGE_KEY, JSON.stringify(attractions))
    }
  },

  deleteAttraction: (id: string): void => {
    const attractions = attractionStorage.getAllAttractions()
    const filtered = attractions.filter((a) => a.id !== id)
    localStorage.setItem(ATTRACTIONS_STORAGE_KEY, JSON.stringify(filtered))
  },
}

// Tips Storage
export const tipStorage = {
  getAllTips: (): Tip[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(TIPS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  getTipsByCountry: (countryName: string): Tip[] => {
    const tips = tipStorage.getAllTips()
    return tips.filter((t) => t.countryName.toLowerCase() === countryName.toLowerCase())
  },

  getTipsByCategory: (countryName: string, category: string): Tip[] => {
    const tips = tipStorage.getTipsByCountry(countryName)
    return tips.filter((t) => t.category === category)
  },

  addTip: (countryName: string, title: string, description: string, category: Tip["category"]): Tip => {
    const tips = tipStorage.getAllTips()
    const newTip: Tip = {
      id: Date.now().toString(),
      countryName,
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
    }
    tips.push(newTip)
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(tips))
    return newTip
  },

  updateTip: (id: string, title: string, description: string, category: Tip["category"]): void => {
    const tips = tipStorage.getAllTips()
    const tip = tips.find((t) => t.id === id)
    if (tip) {
      tip.title = title
      tip.description = description
      tip.category = category
      localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(tips))
    }
  },

  deleteTip: (id: string): void => {
    const tips = tipStorage.getAllTips()
    const filtered = tips.filter((t) => t.id !== id)
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(filtered))
  },
}
