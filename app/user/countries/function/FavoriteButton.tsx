'use client'

import React from "react";

type FavoriteButtonProps = {
  slug: string
  showLabel?: boolean
  inline?: boolean
};

export default function FavoriteButton({ slug, showLabel = false, inline = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

   // On mount, check if this country is already favorite
  React.useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.includes(slug));
  }, [slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation

    const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    let updatedFavs;
    if (favs.includes(slug)) {
      // Remove from favorites
      updatedFavs = favs.filter(f => f !== slug);
      setIsFavorite(false);
    } else {
      // Add to favorites
      updatedFavs = [...favs, slug];
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };
  
  // If inline mode (for use inside another button)
  if (inline) {
    return (
      <div onClick={toggleFavorite} className="flex items-center gap-2 cursor-pointer">
        {isFavorite ? (
          <span className="pi pi-heart-fill text-red-500"></span>
        ) : (
          <span className="pi pi-heart text-gray-400"></span>
        )}
        {showLabel && <span className="text-sm font-medium">Favorite</span>}
      </div>
    );
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