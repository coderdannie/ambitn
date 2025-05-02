'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetSuccess: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { isMobile } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 pb-2 relative mx-auto text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/assets/success.gif"
                alt="success icon"
                width={100}
                height={100}
              />
            </div>
            <h3 className="md:text-xl font-medium mb-2">Password Updated!</h3>
            <p className="text-gray-600 text-xs md:text-base mb-6">
              Your password has been successfully changed.
            </p>
            <Button
              type="submit"
              className={`secondary-btn mt-6 mb-2 ${!isMobile && 'mb-4'}`}
              onClick={() => router.push('/login')}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordResetSuccess;
