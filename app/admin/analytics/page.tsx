"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { AnalyticsCharts } from "@/components/analytics-charts";
import type { Country } from "@/lib/types";

export default function AnalyticsDashboard() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Fetch from the local API instead of restcountries.com
        const response = await fetch("/api/countries", {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setCountries(data);
        setAllCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading analytics...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            View charts, region statistics, and country insights
          </p>
        </div>

        <AnalyticsCharts
          countries={countries}
          allCountries={allCountries}
          searchQuery=""
          selectedRegion="all"
          sortBy="name"
        />
      </div>
    </AdminLayout>
  );
}
