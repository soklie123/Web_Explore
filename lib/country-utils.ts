// lib/country-utils.ts
import { Country, CountryCardData } from './types'

export function createSlugFromName(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

export function getCountryBySlug(data: any, slug: string): Country | null {
  const allCountries: Country[] = []
  
  // Flatten all regions
  Object.values(data).forEach((regionCountries: any) => {
    if (Array.isArray(regionCountries)) {
      allCountries.push(...regionCountries)
    }
  })

  // Find country by slug
  return allCountries.find(
    c => createSlugFromName(c.name) === slug
  ) || null
}

export function transformToCardData(countries: Country[], region: string): CountryCardData[] {
  return countries.map(country => ({
    id: country.id,
    name: country.name,
    flag: country.flag,
    capital: country.capital,
    region: region,
    overview: country.overview
  }))
}

export function getAllCountriesWithRegion(data: any): CountryCardData[] {
  const allCountries: CountryCardData[] = []
  
  Object.entries(data).forEach(([regionName, regionCountries]: [string, any]) => {
    if (Array.isArray(regionCountries)) {
      const transformed = transformToCardData(regionCountries, regionName)
      allCountries.push(...transformed)
    }
  })

  return allCountries
}

export function getCountriesByRegion(data: any, region: string): CountryCardData[] {
  const regionCountries = data[region]
  if (!regionCountries || !Array.isArray(regionCountries)) {
    return []
  }
  
  return transformToCardData(regionCountries, region)
}