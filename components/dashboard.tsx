"use client"

import { Sidebar } from './sidebar'
import { Header } from './header'
import { MainContent } from './main-content'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent />
        </div>
      </div>
    </div>
  )
}
