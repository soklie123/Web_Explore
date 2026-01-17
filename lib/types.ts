// lib/types.ts

// ============= API Response Types =============
export interface CountryOverview {
  id: string;
  country_id: string;
  short_description: string;
  history: string;
  culture: string;
  climate: string;
  best_time_to_visit: string;
  currency: string;
  language: string;
  time_zone: string;
  latitude: number;
  longitude: number;
  google_map_url: string;
  created_at: string;
  updated_at: string;
}

export interface Law {
  id: string;
  countryName: string;
  country_id?: string;
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  status?: string;
  penalty?: string;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LawCategory {
  category: string;
  laws: Law[];
}

export interface Attraction {
  id: string;
  countryName: string;
  country_id?: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  image?: string;
  opening_hours?: string;
  best_time_to_visit?: string;
  estimated_visit_time?: string;
  access_type?: string;
  highlights?: string[];
  rules?: string[];
  images?: string[];
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThingToDo {
  id: string;
  country_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  cost_level: "Low" | "Medium" | "High";
  created_at: string;
  updated_at: string;
}

export interface TipItem {
  id: string;
  short: string;
  detail: string;
  level: "low" | "medium" | "high";
}

export interface TipCategory {
  category: string;
  items: TipItem[];
}

export interface Tip {
  id: string;
  countryName: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface CountryData {
  name: { common: string };
  region?: string;
  population?: number;
  area?: number;
  flag?: string;
  capital?: string;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
}

export interface Country {
  id: string;
  name: string;
  flag: string; // URL to flag image
  capital: string;
  overview?: CountryOverview;
  laws: LawCategory[];
  attractions: Attraction[];
  thingsToDo: ThingToDo[];
  tips: TipCategory[];
}

export interface APIResponse {
  [region: string]: Country[];
}

// ============= UI Component Types =============
export interface CountryCardData {
  id: string;
  name: string;
  flag: string;
  capital: string;
  region: string;
  overview?: {
    short_description?: string;
  };
}
