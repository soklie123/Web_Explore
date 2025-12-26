'use client'

import { useRef } from "react";
import CountryCard from "../components/CountryCard";

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
    city: "Brasília",
    population: "213M",
    description: "A land of unique wildlife, stunning beaches, and the iconic Sydney Opera House. Adventure awaits down under.",
    flag: "au",
  },
];

export default function ViewList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="pt-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-regular text-gray-800">
            Recently Viewed
          </h1>
          <p className="text-base text-gray-600">
            Continue exploring where you left off
          </p>
        </div>

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

      {/* Country Cards Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 pt-4 snap-x snap-mandatory scroll-smooth"
      >
        {countries.map((country, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 sm:w-96 snap-start"
          >
            <CountryCard
              name={country.name}
              image={country.image}
              region={country.region}
              city={country.city}
              population={country.population}
              description={country.description}
              flag={country.flag}
            />
          </div>
        ))}
      </div>
    </div>
  );
}