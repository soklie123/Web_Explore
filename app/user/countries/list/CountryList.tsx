'use client'

import { useRef } from 'react'
import CountryCard from '../components/CountryCard'
import SectionHeader from '../function/SectionHeader'

export type Country = {
  name: string
  slug: string
  image: string
  region: string
  city: string
  population: string
  description: string
  flag: string
}

type CountryListProps = {
  title: string
  description: string
  countries: Country[]
  horizontalScroll?: boolean
}

export default function CountryList({
  title,
  description,
  countries = [],
  horizontalScroll = false,
}: CountryListProps) {
  // Only used if horizontalScroll is true
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <div className="pt-4 max-w-7xl mx-auto">
      {/* Header with optional arrows */}
      <div className="flex justify-between items-center mt-2">
        <SectionHeader title={title} description={description} />
        {horizontalScroll && (
          <div className="flex space-x-2">
            <i
              onClick={scrollLeft}
              className="pi pi-angle-left cursor-pointer bg-gray-50 hover:bg-gray-300 rounded-full p-3 border border-gray-200 text-gray-500 text-xl hover:text-gray-800"
            />
            <i
              onClick={scrollRight}
              className="pi pi-angle-right cursor-pointer bg-gray-50 hover:bg-gray-300 rounded-full p-3 border border-gray-200 text-gray-500 text-xl hover:text-gray-800"
            />
          </div>
        )}
      </div>

      {/* Cards */}
      {horizontalScroll ? (
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 pt-4 snap-x snap-mandatory scroll-smooth"
        >
          {countries.map((country) => (
            <div key={country.slug} className="flex-shrink-0 w-80 sm:w-96 snap-start">
              <CountryCard {...country} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries.map((country) => (
            <CountryCard key={country.slug} {...country} />
          ))}
        </div>
      )}
    </div>
  )
}
