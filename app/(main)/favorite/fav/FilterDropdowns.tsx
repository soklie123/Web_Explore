import { useState, useEffect } from 'react'

type FilterDropdownsProps = {
  regions: { name: string; count: number }[]
  countries: string[]
  selectedRegion: string
  selectedCountry: string
  onFilterChange: (region: string, country: string) => void
}

export default function FilterDropdowns({
  regions,
  countries,
  selectedRegion,
  selectedCountry,
  onFilterChange
}: FilterDropdownsProps) {
  const [regionOpen, setRegionOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setRegionOpen(false)
      setCountryOpen(false)
    }

    if (regionOpen || countryOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [regionOpen, countryOpen])

  const handleRegionSelect = (region: string) => {
    const newRegion = region === selectedRegion ? '' : region
    onFilterChange(newRegion, '')
    setRegionOpen(false)
  }

  const handleCountrySelect = (country: string) => {
    const newCountry = country === selectedCountry ? '' : country
    onFilterChange(selectedRegion, newCountry)
    setCountryOpen(false)
  }

  const handleClearFilters = () => {
    onFilterChange('', '')
  }

  const totalSelected = regions.find(r => r.name === selectedRegion)?.count || 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Region Dropdown */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setRegionOpen(!regionOpen)
            setCountryOpen(false)
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            selectedRegion
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
          }`}
        >
          <span className="font-medium">
            {selectedRegion || 'Region'}
          </span>
          {selectedRegion && (
            <span className="flex items-center justify-center min-w-[20px] h-5 bg-white/30 text-white text-xs font-semibold rounded-full px-1.5">
              {totalSelected}
            </span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform ${regionOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {regionOpen && (
          <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Select Region</p>
            </div>
            {regions.map((region) => (
              <button
                key={region.name}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRegionSelect(region.name)
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between transition-colors group"
              >
                <span className={`text-sm ${
                  selectedRegion === region.name 
                    ? 'font-semibold text-blue-600' 
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {region.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {region.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country Dropdown */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCountryOpen(!countryOpen)
            setRegionOpen(false)
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            selectedCountry
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
          }`}
        >
          <span className="font-medium">
            {selectedCountry || 'Country'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {countryOpen && (
          <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 max-h-80 overflow-y-auto">
            <div className="px-4 py-2 border-b border-gray-100 sticky top-0 bg-white">
              <p className="text-xs font-semibold text-gray-500 uppercase">Select Country</p>
            </div>
            {countries.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No countries available
              </div>
            ) : (
              countries.map((country) => (
                <button
                  key={country}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCountrySelect(country)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors group"
                >
                  <span className={`text-sm ${
                    selectedCountry === country 
                      ? 'font-semibold text-blue-600' 
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {country}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(selectedRegion || selectedCountry) && (
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium">Cklear</span>
        </button>
      )}
    </div>
  )
}