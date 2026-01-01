"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CountryTips } from './country-tips';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Country {
  name: { common: string };
  flags: { svg: string; png: string };
  capital?: string[];
  region: string;
  population: number;
  area: number;
}

interface CountryDetailModalProps {
  country: Country | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CountryDetailModal({ country, open, onOpenChange }: CountryDetailModalProps) {
  if (!country) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={country.flags.svg || "/placeholder.svg"} alt={country.name.common} className="w-8 h-6 rounded" />
            {country.name.common}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="tips">Tips & Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-3">
            {country.capital && <p><strong>Capital:</strong> {country.capital.join(', ')}</p>}
            <p><strong>Region:</strong> {country.region}</p>
            <p><strong>Population:</strong> {(country.population / 1000000).toFixed(1)}M</p>
            <p><strong>Area:</strong> {(country.area / 1000).toFixed(0)}K km²</p>
          </TabsContent>

          <TabsContent value="tips">
            <CountryTips countryName={country.name.common} countryFlag={country.flags.svg} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
