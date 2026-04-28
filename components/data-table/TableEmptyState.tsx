import React from 'react';
import { LucideIcon, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isSearch?: boolean;
}

export default function TableEmptyState({ 
  icon: Icon = SearchX, 
  title = "No data found", 
  description = "There are no items to display at the moment.",
  action,
  isSearch = false
}: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 mb-4">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-200 mb-1">
        {isSearch ? "No results found" : title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        {isSearch 
          ? "Try adjusting your search or filters to find what you're looking for." 
          : description}
      </p>
      {action && (
        <Button 
          variant="outline" 
          onClick={action.onClick}
          className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-300"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
