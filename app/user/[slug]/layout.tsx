'use client'

import { use } from 'react' // Add this import
import Image from 'next/image'
import { ArrowLeft, Share2, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CountryNavigation from './components/CountryNavigation'
import FavoriteButton from '../countries/function/FavoriteButton'
import { countries } from '../countries/list/DataCard'


type Props = {
  children: React.ReactNode
  params: Promise<{ slug: string }> // Change this to Promise
}

export default function CountryLayout({ children, params }: Props) {
  const router = useRouter()
  const { slug } = use(params) // Unwrap the promise
  const country = countries.find(c => c.slug === slug) // Use the unwrapped slug

  if (!country) return <p>Country not found</p>

  return (
    <main className="mx-auto">
      <div className="relative h-96 w-full rounded-xl overflow-hidden">
  <Image src={country.image} alt={country.name} fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

  <button
    onClick={() => router.back()}
    className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
  >
    <ArrowLeft className="w-5 h-5 text-white" />
  </button>

  <div className="absolute top-6 right-6 flex items-center gap-3">
    <span className={`fi fi-${country.flag} text-3xl shadow-lg`} />
  </div>

  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm font-medium">{country.region}</span>
    </div>

    <h1 className="text-4xl md:text-5xl font-bold mb-4">{country.name}</h1>

    {/* Two separate buttons */}
    <div className="flex items-center gap-3">
      {/* Favorite Button */}
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
        <FavoriteButton slug={country.slug} inline={true} showLabel={true} />
      </button>

      {/* Share Button */}
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </button>
    </div>
  </div>
</div>

      <CountryNavigation slug={slug} />

      <section className="max-w-4xl mx-auto p-6">{children}</section>
    </main>
  )
}