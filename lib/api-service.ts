const API_BASE_URL = "/api"

interface APIResponse {
  [region: string]: any[]
}

export const apiService = {
  async getAllCountries(): Promise<any[]> {
    try {
      console.log(" Fetching countries...")

      const response = await fetch(`${API_BASE_URL}/countries`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: APIResponse = await response.json()

      // Flatten regions → single array
      const countries: any[] = []
      Object.values(data).forEach((regionCountries) => {
        if (Array.isArray(regionCountries)) {
          countries.push(...regionCountries)
        }
      })

      console.log(` Successfully fetched ${countries.length} countries`)
      return countries
    } catch (error: any) {
      console.error(" Failed to fetch countries:", error?.message || error)
      return []
    }
  },
}
