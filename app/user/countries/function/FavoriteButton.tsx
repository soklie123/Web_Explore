'use client'

import React from "react";

type FavoriteButtonProps = {
  slug: string
  showLabel?: boolean
  inline?: boolean
};

export default function FavoriteButton({ slug, showLabel = false, inline = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click events
    setIsFavorite(!isFavorite)
  }
  
  // If inline mode (for use inside another button)
  if (inline) {
    return (
      <div onClick={toggleFavorite} className="flex items-center gap-2 cursor-pointer">
        {isFavorite ? (
          <span className="pi pi-heart-fill text-red-500"></span>
        ) : (
          <span className="pi pi-heart text-white"></span>
        )}
        {showLabel && <span className="text-sm font-medium">Favorite</span>}
      </div>
    )
  }
    
  // Original absolute positioned version (for use on cards)
  return (
    <div 
      onClick={toggleFavorite}
      className="absolute top-4 right-4 flex bg-white rounded-full p-3 
                justify-center shadow-md cursor-pointer hover:scale-110 
                transition-transform"
    >
      {isFavorite ? (
        <span className="pi pi-heart-fill text-red-500"></span>
      ) : (
        <span className="pi pi-heart text-gray-400"></span>
      )}
    </div>
  );
}