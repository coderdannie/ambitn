'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddContent: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddContent }) => {
  return (
    <div className="relative h-16 group flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
      <Button
        onClick={onAddContent}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        title="Add your first content"
      >
        <Plus className="w-5 h-5" />
      </Button>
      <span className="ml-3 text-gray-500">Add your first content</span>
    </div>
  );
};

export default EmptyState;
