export interface Country {
  name: {
    common: string
    official?: string
  }
  region?: string
  population?: number
  area?: number
  flags?: {
    svg?: string
    png?: string
  }
  capital?: string[]
  subregion?: string
  timezones?: string[]
  languages?: Record<string, string>
  currencies?: Record<string, { name: string }>
  [key: string]: any
}

export interface CountryData {
  name: {
    common: string
    official?: string
  }
  flag?: string
  capital?: string
  region?: string
  population?: number
  area?: number
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol: string }>
  timezones?: string[]
  [key: string]: any
}

export interface Law {
  id: string
  countryName: string
  title: string
  description: string
  createdAt: string
}

export interface Attraction {
  id: string
  countryName: string
  name: string
  description: string
  image?: string
  createdAt: string
}

export interface Tip {
  id: string
  countryName: string
  title: string
  description: string
  category: "Laws" | "Attractions" | "Things To Do" | "Tips"
  createdAt: string
}
