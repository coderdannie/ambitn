'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Template from '@/components/common/Template';
import { useGetUserAllProjects } from '@/service/query/portfolio.service';
import ProjectCardSkeleton from '../../common/Loaders/ProjectCardSkeleton';
import dynamic from 'next/dynamic';
import LoadingOverlay from '@/components/common/Loaders/LoadingOverlay';

// Dynamically import ProjectCard to avoid SSR hydration issues
const ProjectCard = dynamic(() => import('./ProjectCard'), {
  ssr: false,
  loading: () => <LoadingOverlay />,
});

const tabs = [
  { id: 'smart templates', label: 'Smart Templates' },
  { id: 'upload project', label: 'Upload Project' },
];

const UploadContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload project');
  const { data, isPending } = useGetUserAllProjects();

  return (
    <>
      {/* Action Buttons */}
      <div className="mt-6 mb-8 flex items-center justify-between">
        <div className="grid grid-cols-2 p-2 bg-[#F7F5F4] items-center rounded-lg relative">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative font-semibold flex items-center gap-2 rounded-sm px-2 py-[10px] text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'font-semibold secondary-btn !h-full'
                  : 'text-[#1A202C] hover:text-[#441C31]'
              }`}
              whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
              transition={{
                layout: { type: 'spring', stiffness: 500, damping: 35 },
              }}
            >
              <motion.div
                className="flex items-center gap-2"
                initial={false}
                animate={{
                  scale: activeTab === tab.id ? 1 : 0.95,
                }}
                transition={{ duration: 0.2 }}
              >
                {i !== 0 && (
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: activeTab === tab.id ? 0 : -5,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload size={16} />
                  </motion.div>
                )}
                {tab.label}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Animated content switching */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          {activeTab.includes('templates') ? (
            <Template />
          ) : (
            <>
              {isPending ? (
                <>
                  {/* {Array.from({ length: 6 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))} */}
                  <LoadingOverlay />
                </>
              ) : data?.data?.length ? (
                <motion.div
                  className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,300px))] gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {data?.data?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: [0.4, 0.0, 0.2, 1],
                      }}
                    >
                      <Link href={`/portfolio/${item?._id}`}>
                        <ProjectCard data={item} />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.button
                  className="border-2 border-dashed w-fit cursor-pointer mx-auto border-[#718096] rounded-lg p-12 flex flex-col items-center justify-center text-center"
                  whileHover={{ scale: 1.01, borderColor: '#441C31' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                    Show off your best projects and contribute to a growing
                    community
                  </p>
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default UploadContent;
