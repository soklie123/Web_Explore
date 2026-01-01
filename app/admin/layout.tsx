import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Admin Dashboard - Country Explorer',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
 <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
