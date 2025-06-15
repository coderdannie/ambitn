// components/PortfolioBuilder/PortfolioHeader.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CiCircleChevLeft } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ConfirmLeaveModal from '@/components/modals/ConfirmLeave';

interface PortfolioHeaderProps {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  setIsDrawerOpen: (open: boolean) => void;
  onPreview: () => void;
  setOpen: (open: boolean) => void;
  hasUnsavedChanges?: boolean;
  onClearStorage?: () => void;
}

const PortfolioHeader = ({
  projectTitle,
  setProjectTitle,
  setIsDrawerOpen,
  onPreview,
  setOpen,
  hasUnsavedChanges = false,
  onClearStorage,
}: PortfolioHeaderProps) => {
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmModal(true);
    } else {
      router.back();
    }
  };

  const handleConfirmLeave = () => {
    // Clear localStorage if function provided
    if (onClearStorage) {
      onClearStorage();
    }
    // Navigate back
    router.back();
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmModal(true);
    } else {
      // Navigate to home or previous page
      router.back();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {isMobile ? (
          <button onClick={handleBackClick}>
            <CiCircleChevLeft size={34} className="text-[#1A202C]" />
          </button>
        ) : (
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="px-4 grid place-items-center !h-[44px]"
          >
            Back
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCancelClick}
            variant="outline"
            className="bg-[#F7F5F4] px-4 grid place-items-center h-[44px]"
          >
            Cancel
          </Button>
          {/* Uncomment if you want to add preview button back */}
          {/* <Button
            onClick={onPreview}
            variant="outline"
            className="bg-[#F7F5F4] px-4 grid place-items-center h-[44px]"
          >
            Preview
          </Button> */}
          <Button
            disabled={!projectTitle.trim()}
            className="secondary-btn-gradient px-4 grid place-items-center !h-[44px]"
            onClick={() => setOpen(true)}
          >
            Continue
          </Button>
        </div>
      </div>

      <div>
        <Input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-b-2 focus-visible:border-blue-500 px-0 py-1 w-full bg-transparent placeholder:font-md placeholder:text-xl"
          placeholder="Give me a title"
        />
      </div>

      <div className="md:hidden flex justify-end mb-3 mt-8">
        <button onClick={() => setIsDrawerOpen(true)}>
          <Image
            src="/assets/open.svg"
            alt="open icon"
            width={40}
            height={40}
          />
        </button>
        {/* Uncomment if you want to add preview button back */}
        {/* <Button
          variant="outline"
          onClick={onPreview}
          className="bg-white px-4 h-[44px] flex items-center space-x-2"
        >
          <span>Preview</span>
        </Button> */}
      </div>

      {/* Confirmation Modal */}
      <ConfirmLeaveModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmLeave}
        title="Unsaved Changes"
        description="You have unsaved changes that will be lost if you leave. Are you sure you want to continue?"
        confirmText="Leave"
        cancelText="Stay"
      />
    </>
  );
};

export default PortfolioHeader;
