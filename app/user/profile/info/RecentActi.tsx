'use client'

import { useRef } from 'react'
import CountryCard from '../../countries/components/CountryCard'
import SectionHeader from '../../countries/function/SectionHeader'
import { countries } from '../../countries/list/DataCard' 

export type Country = {
  name: string
  image: string
  region: string
  city: string
  population: string
  description: string
  flag: string
}

export default function ViewList() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }

  return (
    <div className="pt-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <SectionHeader
          title="Recent Activity"
          description="Continue where you left off"
        />

        {/* Arrow Buttons */}
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
      </div>

      {/* Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 pt-4 snap-x snap-mandatory scroll-smooth"
      >
        {countries.map((country, index) => (
          <div key={index} className="flex-shrink-0 w-80 sm:w-96 snap-start">
            <CountryCard {...country} />
          </div>
        ))}
      </div>
    </div>
  )
}
