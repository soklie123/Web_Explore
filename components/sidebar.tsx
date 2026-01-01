"use client"

import { Home, Plane, Calendar, Users, BarChart3, Settings, HelpCircle, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '#', active: true },
  { icon: Plane, label: 'Trips', href: '#' },
  { icon: Calendar, label: 'Bookings', href: '#' },
  { icon: Users, label: 'Customers', href: '#' },
  { icon: MapPin, label: 'Destinations', href: '#' },
  { icon: BarChart3, label: 'Analytics', href: '#' },
]

const secondaryItems = [
  { icon: Settings, label: 'Settings', href: '#' },
  { icon: HelpCircle, label: 'Help', href: '#' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'bg-sidebar border-r border-sidebar-border transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    )}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-foreground">TravelHub</span>
          </div>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
              item.active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-2">
        {secondaryItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>
        ))}
      </div>
    </aside>
  )
}
