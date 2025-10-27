import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface DiscoverTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DiscoverTabs: React.FC<DiscoverTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="flex items-center mb-12 overflow-x-auto scrollbar-hide pb-1"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex items-center gap-2 min-w-max px-2">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            className={cn(
              'text-sm md:text-base font-medium py-2 px-4 rounded-md whitespace-nowrap flex-shrink-0 relative',
              activeTab === tab
                ? 'text-gray-900 bg-[#F5F6F9]'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
          
          </motion.button>
        ))}
      </div>
    </div>
  );
};
