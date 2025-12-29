'use client'

import CountryCard from "../../countries/components/CountryCard";
import SectionHeader from "../../countries/function/SectionHeader";

const countries = [
  {
    name: "France",
    image: "/images/france.png",
    region: "Europe",
    city: "Paris",
    population: "213M",
    description: "Known for its art, fashion, and iconic landmarks like the Eiffel Tower. A country rich in history and culture.",
    flag: "fr",
  },
  {
    name: "Japan",
    image: "/images/japan.png",
    region: "Asia",
    city: "Tokyo",
    population: "213M",
    description: "A blend of ancient traditions and cutting-edge technology. Famous for cherry blossoms, temples, and sushi.",
    flag: "jp",
  },
  {
    name: "United State",
    image: "/images/usa.png",
    region: "South America",
    city: "Washington D.C.",
    population: "213M",
    description: "A diverse nation with vibrant cities, natural wonders, and cultural landmarks from coast to coast.",
    flag: "us",
  },
  {
    name: "Brazil",
    image: "/images/italy.png",
    region: "South America",
    city: "Brasília",
    population: "213M",
    description: "Known for its Amazon rainforest, Carnival, and football passion.",
    flag: "it",
  },
  {
    name: "Brazil",
    image: "/images/brazil.png",
    region: "South America",
    city: "Brasília",
    population: "213M",
    description: "Known for its Amazon rainforest, Carnival, and football passion.",
    flag: "br",
  },
  {
    name: "Australia",
    image: "/images/austalia.png",
    region: "Ocean",
    city: "Canberra",
    population: "213M",
    description: "A land of unique wildlife, stunning beaches, and the iconic Sydney Opera House. Adventure awaits down under.",
    flag: "au",
  },
  {
    name: "Egypt",
    image: "/images/egypt.png",
    region: "Africa",
    city: "Cairo",
    population: "213M",
    description: "A land of unique wildlife, stunning beaches, and the iconic Sydney Opera House. Adventure awaits down under.",
    flag: "eg",
  },
];

export default function CountryList() {
  return (
    <div className="pt-4 max-w-7xl mx-auto">

      <SectionHeader 
        title="List All Country"
        description="Discover our handpicked selection of must-visit destination"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4">
        {countries.map((country, index) => (
          <CountryCard 
            key={index}
            name={country.name}
            image={country.image}
            region={country.region}
            city={country.city}
            population={country.population}
            description={country.description}
            flag={country.flag}
          />
        ))}
      </div>
    </div>
  )
}