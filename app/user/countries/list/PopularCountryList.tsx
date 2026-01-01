'use client'

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

type PopularCountryListProps = {
  title: string
  description: string
  countries: Country[]
  id?: string
}

export default function PopularCountryList({
  title,
  description,
  countries,
  id,
}: PopularCountryListProps) {
  return (
    <section id={id} className="pt-4 max-w-7xl mx-auto">
      <SectionHeader title={title} description={description} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <CountryCard key={country.slug} {...country} />
        ))}
      </div>
    </section>
  )
}
