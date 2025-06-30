'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload } from 'lucide-react';
import UploadContent from './UploadContent';
import DraftContent from './DraftContent';

export default function ProjectUploadTab() {
  const [activeTab, setActiveTab] = useState('work');

  const tabs = [
    { id: 'work', label: 'Work' },
    { id: 'drafts', label: 'Drafts' },
  ];

  return (
    <div className="mt-10">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 relative px-2 font-medium ${
                activeTab === tab.id
                  ? 'text-black font-semibold'
                  : 'text-[#1A202C99] hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'work' ? <UploadContent /> : <DraftContent />}
      </AnimatePresence>
    </div>
  );
}
