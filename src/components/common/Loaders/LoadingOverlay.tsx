'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1], // Scale from 1 to 1.2 and back to 1
          }}
          transition={{
            duration: 1.5, // Duration for one complete cycle
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-28 h-28"
        >
          <Image
            src="/assets/logo.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
