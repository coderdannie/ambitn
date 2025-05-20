'use client';

import Template from '@/components/common/Template';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const tabs = [
  { id: 'smart templates', label: 'Smart Templates' },
  { id: 'upload project', label: 'Upload Project' },
];

const UploadContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload project');

  return (
    <>
      {/* Action Buttons */}
      <div className="mt-6 mb-8 flex items-center justify-between">
        <div className="grid grid-cols-2  p-2  bg-[#F7F5F4] items-center rounded-lg">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative font-semibold flex items-center gap-2 rounded-sm px-2  py-[10px] text-sm ${
                activeTab === tab.id
                  ? 'font-semibold secondary-btn !h-full'
                  : 'text-[#1A202C] '
              }`}
            >
              {i !== 0 && <Upload size={16} />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab.includes('templates') ? (
        <Template />
      ) : (
        <motion.button
          className=" border-2 border-dashed w-fit cursor-pointer mx-auto border-[#718096] rounded-lg p-12 flex flex-col items-center justify-center text-center"
          whileHover={{ scale: 1.01, borderColor: '#441C31' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => router.push('/portfolio-builder')}
        >
          <motion.div
            className="mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 2,
            }}
          >
            <Image
              src="/assets/cloud.png"
              alt="upload icon"
              width={70}
              height={70}
            />
          </motion.div>

          <h3 className="text-lg font-medium mb-2">
            Upload your first project
          </h3>
          <p className="text-gray-500 mb-6">
            Show off your best projects and contribute to a growing community
          </p>

          {/* <motion.button
            className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center space-x-2 hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </motion.button> */}
        </motion.button>
      )}
    </>
  );
};

export default UploadContent;
