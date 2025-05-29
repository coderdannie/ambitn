'use client';

import React, { useState, useRef } from 'react';
import {
  MdAudiotrack,
  MdCode,
  MdLink,
  MdImage,
  MdVideoLibrary,
} from 'react-icons/md';
import { RxText } from 'react-icons/rx';
import { Plus } from 'lucide-react';

interface InsertMoreContentProps {
  onImageSelected: (file: File) => void;
  onVideoSelected: (file: File) => void;
  onTextAdd: () => void;
  onAudioAdd?: () => void;
  onEmbedAdd?: () => void;
  onSocialLinksAdd?: () => void;
}

const InsertMoreContent: React.FC<InsertMoreContentProps> = ({
  onImageSelected,
  onVideoSelected,
  onTextAdd,
  onAudioAdd,
  onEmbedAdd,
  onSocialLinksAdd,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
      setIsVisible(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelected(file);
      setIsVisible(false);
    }
  };

  const handleTextClick = () => {
    onTextAdd();
    setIsVisible(false);
  };

  const contentOptions = [
    {
      icon: MdImage,
      label: 'Image',
      onClick: handleImageClick,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
    },
    {
      icon: RxText,
      label: 'Text',
      onClick: handleTextClick,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50',
    },
    {
      icon: MdVideoLibrary,
      label: 'Video',
      onClick: handleVideoClick,
      color: 'text-purple-600',
      bgColor: 'hover:bg-purple-50',
    },
    {
      icon: MdAudiotrack,
      label: 'Audio',
      onClick: onAudioAdd,
      color: 'text-orange-600',
      bgColor: 'hover:bg-orange-50',
      disabled: !onAudioAdd,
    },
    {
      icon: MdCode,
      label: 'Embed',
      onClick: onEmbedAdd,
      color: 'text-gray-600',
      bgColor: 'hover:bg-gray-50',
      disabled: !onEmbedAdd,
      badge: 'E',
    },
    {
      icon: MdLink,
      label: 'Social',
      onClick: onSocialLinksAdd,
      color: 'text-indigo-600',
      bgColor: 'hover:bg-indigo-50',
      disabled: !onSocialLinksAdd,
    },
  ];

  return (
    <div className="relative flex justify-center py-8">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="hidden"
      />

      {/* Main trigger button */}
      <div
        className="relative"
        onMouseEnter={() => {
          setIsVisible(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          // Delay hiding to allow mouse movement to options
          setTimeout(() => {
            if (!isHovered) {
              setIsVisible(false);
            }
          }, 150);
        }}
      >
        {/* Trigger Button */}
        <div className="relative">
          <button
            className={`
            flex items-center gap-2 px-4 py-2 text-sm text-gray-600 
            border border-dashed border-gray-300 rounded-lg
            transition-all duration-200 ease-in-out
            ${
              isVisible
                ? 'border-blue-400 text-blue-600 bg-blue-50'
                : 'hover:border-gray-400 hover:bg-gray-50'
            }
          `}
          >
            <span className="font-medium">Insert more content</span>
            <Plus
              className={`w-4 h-4 transition-transform duration-200 ${
                isVisible ? 'rotate-45' : ''
              }`}
            />
          </button>
        </div>

        {/* Content Options */}
        <div
          className={`
            absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50
            transition-all duration-300 ease-out
            ${
              isVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsVisible(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[280px]">
            {/* Options Grid */}
            <div className="grid grid-cols-3 gap-1">
              {contentOptions.map((option, index) => (
                <button
                  key={option.label}
                  onClick={option.onClick}
                  disabled={option.disabled}
                  className={`
                    relative flex flex-col items-center gap-2 p-3 rounded-lg
                    transition-all duration-200 ease-in-out
                    ${
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : `${option.bgColor} hover:scale-105 active:scale-95`
                    }
                    transform
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isVisible
                      ? `slideInUp 0.3s ease-out forwards`
                      : 'none',
                  }}
                >
                  <div
                    className={`p-2 rounded-full bg-white shadow-sm ${option.color}`}
                  >
                    <option.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {option.label}
                  </span>

                  {/* Badge for Embed */}
                  {option.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {option.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Decorative arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InsertMoreContent;
