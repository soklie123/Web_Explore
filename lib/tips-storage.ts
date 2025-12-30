export interface CountryTip {
  id: string;
  countryName: string;
  tip: string;
  category: 'timing' | 'rules' | 'culture' | 'food' | 'transport' | 'other';
  createdAt: string;
}

export interface FeaturedCountry {
  name: string;
  addedAt: string;
}

const TIPS_STORAGE_KEY = 'travel_tips';
const FEATURED_STORAGE_KEY = 'featured_countries';

export const tipsStorage = {
  // Get all tips
  getAllTips: (): CountryTip[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(TIPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get tips for a specific country
  getTipsByCountry: (countryName: string): CountryTip[] => {
    const allTips = tipsStorage.getAllTips();
    return allTips.filter(t => t.countryName.toLowerCase() === countryName.toLowerCase());
  },

  // Add a new tip
  addTip: (countryName: string, tip: string, category: CountryTip['category'] = 'other'): CountryTip => {
    const allTips = tipsStorage.getAllTips();
    const newTip: CountryTip = {
      id: Date.now().toString(),
      countryName,
      tip,
      category,
      createdAt: new Date().toISOString(),
    };
    allTips.push(newTip);
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(allTips));
    return newTip;
  },

  // Delete a tip
  deleteTip: (tipId: string): void => {
    const allTips = tipsStorage.getAllTips();
    const filtered = allTips.filter(t => t.id !== tipId);
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Update a tip
  updateTip: (tipId: string, updatedTip: string, category: CountryTip['category']): void => {
    const allTips = tipsStorage.getAllTips();
    const tip = allTips.find(t => t.id === tipId);
    if (tip) {
      tip.tip = updatedTip;
      tip.category = category;
      localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(allTips));
    }
  },
};

export const featuredStorage = {
  // Get all featured countries
  getAllFeatured: (): FeaturedCountry[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(FEATURED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Check if country is featured
  isFeatured: (countryName: string): boolean => {
    const featured = featuredStorage.getAllFeatured();
    return featured.some(f => f.name.toLowerCase() === countryName.toLowerCase());
  },

  // Add country to featured
  addFeatured: (countryName: string): void => {
    const featured = featuredStorage.getAllFeatured();
    if (!featured.some(f => f.name.toLowerCase() === countryName.toLowerCase())) {
      featured.push({ name: countryName, addedAt: new Date().toISOString() });
      localStorage.setItem(FEATURED_STORAGE_KEY, JSON.stringify(featured));
    }
  },

  // Remove from featured
  removeFeatured: (countryName: string): void => {
    const featured = featuredStorage.getAllFeatured();
    const filtered = featured.filter(f => f.name.toLowerCase() !== countryName.toLowerCase());
    localStorage.setItem(FEATURED_STORAGE_KEY, JSON.stringify(filtered));
  },
};
