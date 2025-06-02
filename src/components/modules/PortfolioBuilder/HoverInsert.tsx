import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface HoverInsertProps {
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  children: React.ReactNode;
  className?: string;
}

const HoverInsert: React.FC<HoverInsertProps> = ({
  onInsertAbove,
  onInsertBelow,
  children,
  className = '',
}) => {
  const [hoveredZone, setHoveredZone] = useState<'top' | 'bottom' | null>(null);
  const [showInsert, setShowInsert] = useState(false);

  return (
    <div
      className={`relative group ${className} mb-0`}
      onMouseEnter={() => setShowInsert(true)}
      onMouseLeave={() => {
        setShowInsert(false);
        setHoveredZone(null);
      }}
    >
      {/* Top hover zone */}
      <div
        className="absolute -top-4 left-0 right-0 h-2 z-10"
        onMouseEnter={() => setHoveredZone('top')}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {showInsert && hoveredZone === 'top' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={onInsertAbove}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              title="Insert content above"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        {showInsert && hoveredZone === 'top' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="relative">{children}</div>

      {/* Bottom hover zone */}
      <div
        className="absolute -bottom-4 left-0 right-0 h-2 z-10"
        onMouseEnter={() => setHoveredZone('bottom')}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {showInsert && hoveredZone === 'bottom' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <button
              onClick={onInsertBelow}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              title="Insert content below"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        {showInsert && hoveredZone === 'bottom' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default HoverInsert;
