import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Exact spinner from the screenshot
const PublishingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-12 h-12">
        {/* Outer dotted circle */}
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 -mt-1 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-2 h-2 -ml-1 -mt-1 bg-gray-400 rounded-full"></div>
        </div>

        {/* Inner solid circle */}
        <div
          className="absolute inset-2 w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
};

interface PublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPending: boolean;
  onPublish: () => void;
}

const PublishingModal = ({
  isOpen,
  onClose,
  isPending,
  onPublish,
}: PublishingModalProps) => {
  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  const handlePublishClick = () => {
    onPublish();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Publishing project
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isPending ? (
            <div className="text-center">
              <PublishingSpinner />
              <p className="text-gray-600 mt-4">
                Great job! Just a moment while we get your project published
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                Ready to publish your project?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishClick}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishingModal;
