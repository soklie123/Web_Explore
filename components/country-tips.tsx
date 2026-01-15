"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Heart } from 'lucide-react';
import { tipsStorage, featuredStorage, CountryTip } from '@/lib/tips-storage';

interface CountryTipsProps {
  countryName: string;
  countryFlag?: string;
}

export function CountryTips({ countryName, countryFlag }: CountryTipsProps) {
  const [tips, setTips] = useState<CountryTip[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [category, setCategory] = useState<CountryTip['category']>('other');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setTips(tipsStorage.getTipsByCountry(countryName));
    setIsFeatured(featuredStorage.isFeatured(countryName));
  }, [countryName]);

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    tipsStorage.addTip(countryName, newTip, category);
    setTips(tipsStorage.getTipsByCountry(countryName));
    setNewTip('');
    setCategory('other');
  };

  const handleDeleteTip = (tipId: string) => {
    tipsStorage.deleteTip(tipId);
    setTips(tipsStorage.getTipsByCountry(countryName));
  };

  const handleToggleFeatured = () => {
    if (isFeatured) {
      featuredStorage.removeFeatured(countryName);
    } else {
      featuredStorage.addFeatured(countryName);
    }
    setIsFeatured(!isFeatured);
  };

  const categoryColors: Record<CountryTip['category'], string> = {
    timing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    rules: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    culture: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    transport: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          {countryFlag && <img src={countryFlag || "/placeholder.svg"} alt={countryName} className="w-8 h-6 rounded" />}
          <CardTitle>{countryName} - Travel Tips</CardTitle>
        </div>
        <Button
          size="sm"
          variant={isFeatured ? 'default' : 'outline'}
          onClick={handleToggleFeatured}
          className="gap-2"
        >
          <Heart className="w-4 h-4" fill={isFeatured ? 'currentColor' : 'none'} />
          {isFeatured ? 'Featured' : 'Add'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Tip Form */}
        <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm">Add a Travel Tip</h3>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Best time to visit is April..."
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTip()}
            />
            <Select value={category} onValueChange={(v) => setCategory(v as CountryTip['category'])}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timing">Timing</SelectItem>
                <SelectItem value="rules">Rules</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAddTip} className="gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>

        {/* Tips List */}
        {tips.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tips yet. Add one above!</p>
        ) : (
          <div className="space-y-2">
            {tips.map((tip) => (
              <div key={tip.id} className="flex items-start justify-between gap-3 p-3 bg-card border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColors[tip.category]}`}>
                      {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm">{tip.tip}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTip(tip.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
