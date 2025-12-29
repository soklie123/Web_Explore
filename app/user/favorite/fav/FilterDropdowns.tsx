import { useState } from 'react';

export default function FilterDropdowns() {
  const [selectedContinent, setSelectedContinent] = useState('Asia');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [continentOpen, setContinentOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const continents = [
    { name: 'Asia', count: 1 },
    { name: 'Europe', count: 5 },
    { name: 'Africa', count: 3 },
    { name: 'North America', count: 2 },
    { name: 'South America', count: 4 },
    { name: 'Oceania', count: 1 }
  ];

  const countries = [
    'Japan',
    'China',
    'South Korea',
    'Thailand',
    'Vietnam',
    'Indonesia'
  ];

  return (
    <div className="pt-2 bg-gray-50">
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-4 inline-flex gap-3">
          {/* Continent Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setContinentOpen(!continentOpen);
                setCountryOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="font-medium text-gray-800">{selectedContinent}</span>
              <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs font-semibold rounded-full">
                1
              </span>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${continentOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {continentOpen && (
              <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {continents.map((continent) => (
                  <button
                    key={continent.name}
                    onClick={() => {
                      setSelectedContinent(continent.name);
                      setContinentOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    <span className={`text-sm ${selectedContinent === continent.name ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {continent.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {continent.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCountryOpen(!countryOpen);
                setContinentOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">
                {selectedCountry || 'Country'}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {countryOpen && (
              <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setCountryOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-sm ${selectedCountry === country ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}