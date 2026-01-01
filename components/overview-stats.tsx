import { Globe, Users, MapPin, TrendingUp } from "lucide-react"

interface Country {
  name?: {
    common?: string
  }
  region?: string
  population?: number
}

interface OverviewStatsProps {
  countries?: Country[]
}

interface RegionStats {
  [key: string]: number
}

export function OverviewStats({ countries = [] }: OverviewStatsProps) {
  const countryList = Array.isArray(countries) ? countries : []

  // Calculate statistics
  const totalCountries = countryList.length

  // Get unique regions
  const regions = new Set()
  countryList.forEach((country) => {
    if (country.region) regions.add(country.region)
  })

  // Get top 10 most populated
  const topPopulated = countryList
    .filter((c) => c.population)
    .sort((a, b) => (b.population as number) - (a.population as number))
    .slice(0, 10)

  // Countries by region
  const countryByRegion: RegionStats = {}
  countryList.forEach((country) => {
    if (country.region) {
      countryByRegion[country.region] = (countryByRegion[country.region] || 0) + 1
    }
  })

  const stats = [
    {
      title: "Total Countries",
      value: totalCountries,
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Regions",
      value: regions.size,
      icon: MapPin,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Population",
      value: (topPopulated.reduce((sum, c) => sum + (c.population || 0), 0) / 1e9).toFixed(1) + "B",
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Top Country",
      value: topPopulated[0]?.name?.common || "N/A",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-linear-to-br ${stat.color} rounded-lg opacity-90`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries by Region */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Countries by Region</h3>
          <div className="space-y-3">
            {Object.entries(countryByRegion)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([region, count]) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-slate-300">{region}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-blue-500 to-cyan-500 h-full"
                        style={{
                          width: `${((count as number) / totalCountries) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count as number}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top 10 Most Populated */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top 10 Most Populated</h3>
          <div className="space-y-2">
            {topPopulated.map((country, index) => (
              <div key={country.name?.common} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium w-6">{index + 1}.</span>
                  <span className="text-slate-300">{country.name?.common}</span>
                </div>
                <span className="text-white font-semibold">{((country.population || 0) / 1e6).toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
