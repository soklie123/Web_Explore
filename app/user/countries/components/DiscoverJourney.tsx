import React from 'react';
import { Globe, TrendingUp, Heart, Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { useRouter } from "next/navigation";

interface DiscoveryJourneyProps {
  totalCountries?: number;
  countriesVisited?: number;
  visitedThisMonth?: number;
  favoritesSaved?: number;
  recentActivities?: number;
  activitiesToday?: number;
}
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ 
    behavior: "smooth" ,
    block: 'start',
  })
}


export const DiscoveryJourney: React.FC<DiscoveryJourneyProps> = ({
  totalCountries = 195,
  countriesVisited = 12,
  visitedThisMonth = 3,
  favoritesSaved = 2,
  recentActivities = 28,
  activitiesToday = 5,
}) => {
  const router = useRouter();
  

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-regular text-gray-800 mb-6">
        Your Discovery Journey
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Countries"
          value={totalCountries}
          icon={<Globe className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => router.push("/user/explore")}
        />
        
        <StatCard
          title="Countries Visited"
          value={countriesVisited}
          subtitle={`+${visitedThisMonth} this month`}
          icon={<TrendingUp className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => scrollToSection('countries-visited')}
        />
        
        <StatCard
          title="Favorites Saved"
          value={favoritesSaved}
          icon={<Heart className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => router.push('/user/favorite#favorite-saved')}
        />
        
        <StatCard
          title="Recent Activities"
          value={recentActivities}
          subtitle={`+${activitiesToday} today`}
          icon={<Activity className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => router.push('/user/profile#recent-activities')}
        />
      </div>
    </div>
  );
};