'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import FavoriteButton from "../function/FavoriteButton"


type CountryCardProps = {
  name: string
  image: string
  region: string
  city: string
  population: string
  description: string
  flag: string
  slug?: string // make required
}

export default function CountryCard({
  name,
  image,
  region,
  city,
  population,
  description,
  flag,
  slug,
}: CountryCardProps) {
  const router = useRouter()

  const handleClick = () => {
  // Read current recently viewed from localStorage
  const viewed: string[] = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")

    // Add this country to the front, remove duplicates
  const updated = [slug!, ...viewed.filter(s => s !== slug!)].slice(0, 10) // Keep last 10

  localStorage.setItem("recentlyViewed", JSON.stringify(updated))

    router.push(`/user/${slug}/overview`)
  }

  return (
    <section>
      <div
        onClick={handleClick}
        className="
          card w-full h-[420px] flex flex-col rounded-2xl overflow-hidden bg-white
          shadow-md 
          cursor-pointer
          transition-all duration-300 ease-out
          hover:-translate-y-2 hover:scale-[1.03]
          hover:shadow-2xl
          hover:ring-1 hover:ring-blue-200
          active:scale-[0.98]
        "
      >
        {/* Image Section */}
        <div className="relative h-48 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover" priority />

          {/* Flag */}
          <div className="absolute top-4 left-4">
            <span className={`fi fi-${flag} text-3xl`}></span>
          </div>

          {/* Heart Favorite */}
          <FavoriteButton slug={slug!} />

          {/* Region */}
          <div className="absolute bottom-4 left-4 bg-white/90 !text-gray-700 backdrop-blur-sm
                          px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
            <span className="pi pi-map-marker"></span>
            {region}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold mb-3 !text-gray-900">{name}</h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 break-words">
            {description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-4 text-gray-600 text-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="pi pi-building-columns"></span>
              <span>{city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="pi pi-users"></span>
              <span>{population}</span>
            </div>
          </div>

          <div className="mt-auto w-full flex justify-center items-center border-2 border-gray-200 rounded-xl py-3
                          hover:bg-gray-50 transition gap-2.5 font-medium">
            Learn more
            <span className="pi pi-arrow-right" style={{ color: '#708090' }}></span>
          </div>
        </div>
      </div>
    </section>
  )
}
