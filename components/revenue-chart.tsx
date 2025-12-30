"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { destination: 'Paris', revenue: 24000 },
  { destination: 'Tokyo', revenue: 31000 },
  { destination: 'Dubai', revenue: 28000 },
  { destination: 'NYC', revenue: 22000 },
  { destination: 'London', revenue: 26000 },
  { destination: 'Bali', revenue: 29000 },
]

export function RevenueChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Revenue by Destination</CardTitle>
        <CardDescription>Top performing destinations this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
