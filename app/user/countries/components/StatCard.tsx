import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
}
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-4xl font-small text-blue-600 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm font-medium text-green-600">{subtitle}</p>
          )}
        </div>
        
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-full flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};