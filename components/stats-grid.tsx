"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Plane, Users, DollarSign } from "lucide-react"

const stats = [
  {
    label: "Total Bookings",
    value: "2,543",
    change: "+12.5%",
    icon: Plane,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Active Users",
    value: "8,234",
    change: "+8.2%",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Revenue",
    value: "$124,580",
    change: "+23.1%",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "+1.2%",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
