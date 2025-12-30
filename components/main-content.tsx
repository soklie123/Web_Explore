"use client"

import { StatsGrid } from './stats-grid'
import { TripsList } from './trips-list'

import { RevenueChart } from './revenue-chart'

export function MainContent() {
  return (
    <main className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your travel platform overview.</p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
          <RevenueChart />
        </div>

        {/* Trips List */}
        <TripsList />
      </div>
    </main>
  )
}
