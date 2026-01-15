const API_BASE_URL = "/api"

export const apiService = {
  // Fetch all countries safely
  async getAllCountries(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/countries`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // If data is already an array, return it
      if (Array.isArray(data)) {
        return data
      }

      // If data is a single object, wrap it in an array
      if (data && typeof data === "object") {
        return [data]
      }

      // Unexpected response, return empty array
      console.warn("API returned unexpected data. Returning empty array:", data)
      return []
    } catch (error) {
      console.error("Error fetching countries:", error)
      return []
    }
  },

  // Get single country by name
  async getCountryByName(name: string): Promise<any | null> {
    try {
      const countries = await this.getAllCountries()
      return (
        countries.find(
          (c) => c.name?.toLowerCase() === name.toLowerCase()
        ) || null
      )
    } catch (error) {
      console.error("Error fetching country:", error)
      return null
    }
  },

  // Helpers (unchanged)
  getLawsByCountry(country: any): any[] {
    if (!country?.laws) return []
    return country.laws.flatMap((lawCategory: any) =>
      (lawCategory.laws || []).map((law: any) => ({
        ...law,
        categoryGroup: lawCategory.category,
      })),
    )
  },

  getAttractionsByCountry(country: any): any[] {
    return country?.attractions || []
  },

  getThingsToDoByCountry(country: any): any[] {
    return country?.thingsToDo || []
  },

  getTipsByCountry(country: any): any[] {
    return country?.tips || []
  },
}
