'use client'
import Image from "next/image"
import React from 'react';

type CountryCardProps = {
  name: string;
  image: string;
  region: string;
  city: string;
  population: string;
  description: string;
  flag: string;
};

export default function CountryCard({
  name,
  image,
  region,
  city,
  population,
  description,
  flag
}: CountryCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <section>

        <div className="card w-full h-auto flex flex-col rounded-2xl overflow-hidden bg-white
                shadow-lg transition-transform transition-shadow duration-300 ease-in-out
                hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">

          {/* Image Section */}
          <div className="relative h-48 flex-shrink-0">
            <Image src={image} alt={name} fill className="object-cover" priority />
            
            {/* Flag - Top Left */}
            <div className="absolute top-4 left-4">
              <span className={`fi fi-${flag} text-3xl`}></span>
            </div>
            
            {/* Heart Favorite */}
            <div 
              onClick={toggleFavorite}
              className="absolute top-4 right-4 flex bg-white rounded-full p-3 justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
            >
              {isFavorite ? (
                <span className="pi pi-heart-fill text-red-500"></span>
              ) : (
                <span className="pi pi-heart text-gray-400"></span>
              )}
            </div>

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
            {/* Description - Clamps to 3 lines */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 break-words">
              {description}
            </p>
            <div className="absolute bottom-0 right-0 h-5 w-16 
                  bg-gradient-to-l from-white via-white/80 to-transparent 
                  backdrop-blur-[1px] pointer-events-none" />

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
                        hover:bg-gray-50 transition gap-2.5 cursor-pointer font-medium">
              Learn more
              <span className="pi pi-arrow-right" style={{ color: '#708090' }}></span>                
            </div>
          </div>
        </div>
      
    </section>
  )
}