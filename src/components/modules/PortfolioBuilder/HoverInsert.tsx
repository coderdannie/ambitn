import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import {
  MdAudiotrack,
  MdCode,
  MdLink,
  MdImage,
  MdVideoLibrary,
} from 'react-icons/md';
import { RxText } from 'react-icons/rx';

interface HoverInsertProps {
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  children: React.ReactNode;
  className?: string;
  onImageSelected?: (file: File) => void;
  onVideoSelected?: (file: File) => void;
  onAudioSelected?: (file: File) => void;
  onTextAdd?: () => void;
  onEmbedAdd?: () => void;
  onSocialLinksAdd?: () => void;
  setAddingText: (prop: boolean) => void;
}

const HoverInsert: React.FC<HoverInsertProps> = ({
  onInsertAbove,
  onInsertBelow,
  children,
  className = '',
  onImageSelected,
  onVideoSelected,
  onAudioSelected,
  onTextAdd,
  onEmbedAdd,
  onSocialLinksAdd,
  setAddingText,
}) => {
  const [hoveredZone, setHoveredZone] = useState<'top' | 'bottom' | null>(null);
  const [showInsert, setShowInsert] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [insertPosition, setInsertPosition] = useState<
    'above' | 'below' | null
  >(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearOptionsTimeout = () => {
    if (optionsTimeoutRef.current) {
      clearTimeout(optionsTimeoutRef.current);
      optionsTimeoutRef.current = null;
    }
  };

  const handleImageClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    imageInputRef.current?.click();
  };

  const handleVideoClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    videoInputRef.current?.click();
  };

  const handleAudioClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    audioInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelected) {
      onImageSelected(file);
      setShowOptions(false);
      setInsertPosition(null);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onVideoSelected) {
      onVideoSelected(file);
      setShowOptions(false);
      setInsertPosition(null);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAudioSelected) {
      onAudioSelected(file);
      setShowOptions(false);
      setInsertPosition(null);
    }
  };

  const handleTextClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    onTextAdd?.();
    setAddingText(true);
    setShowOptions(false);
    setInsertPosition(null);
  };

  const handleEmbedClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    onEmbedAdd?.();
    setShowOptions(false);
    setInsertPosition(null);
  };

  const handleSocialLinksClick = () => {
    if (insertPosition === 'above') {
      onInsertAbove();
    } else if (insertPosition === 'below') {
      onInsertBelow();
    }
    onSocialLinksAdd?.();
    setShowOptions(false);
    setInsertPosition(null);
  };

  const handleShowOptions = (position: 'above' | 'below') => {
    setInsertPosition(position);
    setShowOptions(true);
    clearOptionsTimeout();
  };

  const handleHideOptions = () => {
    optionsTimeoutRef.current = setTimeout(() => {
      setShowOptions(false);
      setInsertPosition(null);
    }, 200);
  };

  const contentOptions = [
    {
      icon: MdImage,
      label: 'Image',
      onClick: handleImageClick,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      disabled: !onImageSelected,
    },
    {
      icon: RxText,
      label: 'Text',
      onClick: handleTextClick,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50',
      disabled: !onTextAdd,
    },
    {
      icon: MdVideoLibrary,
      label: 'Video',
      onClick: handleVideoClick,
      color: 'text-purple-600',
      bgColor: 'hover:bg-purple-50',
      disabled: !onVideoSelected,
    },
    {
      icon: MdAudiotrack,
      label: 'Audio',
      onClick: handleAudioClick,
      color: 'text-orange-600',
      bgColor: 'hover:bg-orange-50',
      disabled: !onAudioSelected,
    },
    {
      icon: MdCode,
      label: 'Embed',
      onClick: handleEmbedClick,
      color: 'text-gray-600',
      bgColor: 'hover:bg-gray-50',
      disabled: !onEmbedAdd,
      badge: 'E',
    },
    {
      icon: MdLink,
      label: 'Social',
      onClick: handleSocialLinksClick,
      color: 'text-indigo-600',
      bgColor: 'hover:bg-indigo-50',
      disabled: !onSocialLinksAdd,
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative group ${className}`}
      onMouseEnter={() => setShowInsert(true)}
      onMouseLeave={() => {
        setShowInsert(false);
        setHoveredZone(null);
        setShowOptions(false);
        setInsertPosition(null);
        clearOptionsTimeout();
      }}
    >
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
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        className="hidden"
      />

      {/* Top hover zone */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{ top: '-16px', height: '32px' }}
        onMouseEnter={() => setHoveredZone('top')}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {showInsert && hoveredZone === 'top' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative"
              onMouseEnter={() => handleShowOptions('above')}
              onMouseLeave={handleHideOptions}
            >
              <button
                onClick={onInsertAbove}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm text-gray-600 z-20 bg-white
                  border border-dashed border-gray-300 rounded-lg
                  transition-all duration-200 ease-in-out
                `}
                title="Add content"
              >
                <span className="font-medium">Insert content above</span>
                <Plus className="w-4 h-4 transition-transform duration-200" />
              </button>
              {/* Options dropdown */}
              {showOptions && insertPosition === 'above' && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                  onMouseEnter={clearOptionsTimeout}
                  onMouseLeave={handleHideOptions}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[280px]">
                    <div className="grid grid-cols-3 gap-1">
                      {contentOptions.map((option, index) => (
                        <button
                          key={option.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            option.onClick?.();
                          }}
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
                          {option.badge && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {option.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showInsert && hoveredZone === 'top' && (
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300 rounded-full transform -translate-y-1/2 -z-10" />
        )}
      </div>

      {/* Content */}
      <div className="relative">{children}</div>

      {/* Bottom hover zone */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{ bottom: '-16px', height: '32px' }}
        onMouseEnter={() => setHoveredZone('bottom')}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {showInsert && hoveredZone === 'bottom' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative"
              onMouseEnter={() => handleShowOptions('below')}
              onMouseLeave={handleHideOptions}
            >
              <button
                onClick={onInsertBelow}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm text-gray-600 z-20 bg-white
                  border border-dashed border-gray-300 rounded-lg
                  transition-all duration-200 ease-in-out
                `}
                title="Add content"
              >
                <span className="font-medium">Insert content below</span>
                <Plus className="w-4 h-4 transition-transform duration-200" />
              </button>
              {/* Options dropdown */}
              {showOptions && insertPosition === 'below' && (
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                  onMouseEnter={clearOptionsTimeout}
                  onMouseLeave={handleHideOptions}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[280px]">
                    <div className="grid grid-cols-3 gap-1">
                      {contentOptions.map((option, index) => (
                        <button
                          key={option.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            option.onClick?.();
                          }}
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
                          {option.badge && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {option.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showInsert && hoveredZone === 'bottom' && (
          <div className="absolute top-1/2 left-0 right-0 h-[1px]  bg-gray-300 rounded-full transform -translate-y-1/2 -z-10" />
        )}
      </div>
    </div>
  );
};

export default HoverInsert;
