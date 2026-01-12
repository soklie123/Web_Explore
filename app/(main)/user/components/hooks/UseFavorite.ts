// hooks/useFavorites.ts
'use client'
import { useState, useEffect } from 'react'

const getInitialFavorites = (): string[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getInitialFavorites)

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }, [favorites])

  const toggleFavorite = (slug: string) => {
    setFavorites(prev => 
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  const isFavorite = (slug: string) => favorites.includes(slug)

  const addFavorite = (slug: string) => {
    if (!favorites.includes(slug)) {
      setFavorites(prev => [...prev, slug])
    }
  }

  const removeFavorite = (slug: string) => {
    setFavorites(prev => prev.filter(s => s !== slug))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }
}