"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, DollarSign, ChevronRight } from 'lucide-react'

const trips = [
  {
    id: 1,
    destination: 'Paris, France',
    startDate: 'Dec 15, 2024',
    endDate: 'Dec 22, 2024',
    price: '$1,200',
    slots: '4/10',
    status: 'active',
    bookings: 45,
    icon: '🗼',
  },
  {
    id: 2,
    destination: 'Tokyo, Japan',
    startDate: 'Jan 10, 2025',
    endDate: 'Jan 18, 2025',
    price: '$1,800',
    slots: '8/12',
    status: 'active',
    bookings: 63,
    icon: '🗾',
  },
  {
    id: 3,
    destination: 'Dubai, UAE',
    startDate: 'Jan 25, 2025',
    endDate: 'Jan 30, 2025',
    price: '$950',
    slots: '6/8',
    status: 'pending',
    bookings: 28,
    icon: '🏙️',
  },
  {
    id: 4,
    destination: 'New York, USA',
    startDate: 'Feb 5, 2025',
    endDate: 'Feb 10, 2025',
    price: '$1,100',
    slots: '10/15',
    status: 'active',
    bookings: 52,
    icon: '🗽',
  },
]

export function TripsList() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Active Trips</CardTitle>
        <CardDescription>Manage and monitor all upcoming trips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl">{trip.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{trip.destination}</h3>
                    <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                      {trip.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {trip.startDate} → {trip.endDate}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {trip.price}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {trip.slots}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{trip.bookings} Bookings</div>
                <Button variant="ghost" size="icon" className="mt-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
