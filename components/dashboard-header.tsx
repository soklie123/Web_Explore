'use client';

import React from 'react';
import { Globe, BarChart2, List, PieChart } from 'lucide-react'; // Use valid icons

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function DashboardHeader({ activeTab, setActiveTab }: DashboardHeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { id: 'countries', label: 'Manage Countries', icon: <List className="w-4 h-4 mr-2" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { id: 'compare', label: 'Compare', icon: <PieChart className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Country Explorer</h1>
            <p className="text-sm text-slate-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
