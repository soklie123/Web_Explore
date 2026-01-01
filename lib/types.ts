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
