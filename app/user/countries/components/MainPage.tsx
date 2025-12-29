'use client'

import { TrendingUp, Compass } from "lucide-react"
import { useRef, useState } from "react"
import PopularCountryList from "../list/PopularCountryList"
import ExploreButton from "../function/ExploreButton"
import { countries } from "../list/DataCard"

export default function Home() {
  const popularRef = useRef<HTMLDivElement>(null)
  const [showPopular, setShowPopular] = useState(false)

  const scrollToPopular = () => {
    setShowPopular(true)

    setTimeout(() => {
      popularRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  return (
    <main>
      {/* HERO SECTION */}
      <section
        className="
          relative overflow-hidden
          bg-[radial-gradient(circle_at_top,#e0f2ff,#f0fdfb,#ffffff)]
          py-20 md:py-32
        "
      >
        <div className="max-w-7xl mx-auto px-4 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/70 rounded-full px-4 py-1.5 mb-6 shadow ring-1 ring-black/5">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Explore 195 countries worldwide
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-medium mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Discover the World,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              One Country at a Time
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-700 max-w-2xl mx-auto mb-16">
            Explore cultures, landscapes, and histories from around the globe.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <ExploreButton />

            <button
              onClick={scrollToPopular}
              className="
                flex items-center gap-2
                bg-white hover:bg-gray-50
                px-8 py-3 rounded-full
                border border-gray-200
                shadow-md hover:shadow-lg
                transition
              "
            >
              <Compass size={20} />
              View Popular Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      {showPopular && (
        <div ref={popularRef}>
          <PopularCountryList
            id="popular"
            title="Popular Destinations"
            description="Trending countries loved by our community"
            countries={countries}
          />
        </div>
      )}
    </main>
  )
}
