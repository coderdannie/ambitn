import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { PortfolioItem } from '@/types/discover';
import Image from 'next/image';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden rounded-b-md">
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={100}
          height={100}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 ">Kehinde Falodi</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{item.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{item.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
