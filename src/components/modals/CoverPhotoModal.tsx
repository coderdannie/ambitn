'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface CoverPhotoModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentCover: string;
  onSelect: (imageUrl: string, cropData?: CropData) => void;
  onUpload: (file: File) => Promise<string>;
  setOpen: (value: boolean) => void;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export const CoverPhotoModal: React.FC<CoverPhotoModalProps> = ({
  open,
  onClose,
  images,
  currentCover,
  onSelect,
  onUpload,
  setOpen,
}) => {
  const [selectedImage, setSelectedImage] = useState(currentCover);
  const [isUploading, setIsUploading] = useState(false);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 1,
    rotation: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedImage(currentCover);
    resetCropData();
  }, [currentCover]);

  const handleSelect = () => {
    onSelect(selectedImage, cropData);
    setOpen(true);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await onUpload(file);
      setSelectedImage(imageUrl);
      resetCropData();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetCropData = () => {
    setCropData({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      scale: 1,
      rotation: 0,
    });
  };

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    resetCropData();
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!cropContainerRef.current) return;

      setIsDragging(true);
      const rect = cropContainerRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left - cropData.x,
        y: e.clientY - rect.top - cropData.y,
      });
    },
    [cropData.x, cropData.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !cropContainerRef.current) return;

      const rect = cropContainerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;

      setCropData((prev) => ({
        ...prev,
        x: Math.max(-100, Math.min(100, newX)),
        y: Math.max(-100, Math.min(100, newY)),
      }));
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setCropData((prev) => ({
      ...prev,
      scale:
        direction === 'in'
          ? Math.min(3, prev.scale + 0.1)
          : Math.max(0.5, prev.scale - 0.1),
    }));
  };

  const handleRotate = () => {
    setCropData((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleReset = () => {
    resetCropData();
  };

  const getImageTransform = () => {
    return `translate(${cropData.x}px, ${cropData.y}px) scale(${cropData.scale}) rotate(${cropData.rotation}deg)`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={() => {
              setOpen(true);
              onClose();
            }}
          />

          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-end px-6 py-2 border-b">
              <button
                onClick={() => {
                  setOpen(true);
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left: Preview Panel */}
              <div className="w-80 p-6 border-r bg-gray-50 flex flex-col">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Preview
                </h3>
                <div className="space-y-6 flex-1">
                  {/* Cover Preview */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Cover Photo</p>
                    <div className="relative aspect-[4/3] bg-white rounded-lg border-2 overflow-hidden shadow-sm">
                      {selectedImage ? (
                        <div
                          className="w-full h-full overflow-hidden"
                          style={{
                            transform: getImageTransform(),
                            transformOrigin: 'center center',
                          }}
                        >
                          <Image
                            src={selectedImage}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium text-center px-4">
                            Select an image to preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Thumbnail</p>
                    <div className="relative aspect-square w-20 bg-white rounded-lg border-2 overflow-hidden shadow-sm">
                      {selectedImage ? (
                        <div
                          className="w-full h-full overflow-hidden"
                          style={{
                            transform: getImageTransform(),
                            transformOrigin: 'center center',
                          }}
                        >
                          <Image
                            src={selectedImage}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                  </div>

                  {/* Image Selection Grid */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-3">Choose Image</p>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === image
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleImageSelect(image)}
                        >
                          <Image
                            src={image}
                            alt={`Option ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {selectedImage === image && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 p-1 rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Upload Button */}
                      <div
                        onClick={triggerFileInput}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Crop Editor */}
              <div className="flex-1 p-6 flex flex-col">
                {selectedImage ? (
                  <>
                    {/* Crop Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoom('out')}
                          className="p-2"
                          disabled={cropData.scale <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                          {Math.round(cropData.scale * 100)}%
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoom('in')}
                          className="p-2"
                          disabled={cropData.scale >= 3}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRotate}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Rotate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>

                    {/* Crop Area */}
                    <div className="flex-1 relative">
                      <div
                        ref={cropContainerRef}
                        className="w-full h-full bg-gray-100 rounded-lg overflow-hidden cursor-move relative"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <div
                          className="absolute inset-0 transition-transform duration-150 ease-out"
                          style={{
                            transform: getImageTransform(),
                            transformOrigin: 'center center',
                          }}
                        >
                          <Image
                            ref={cropImageRef}
                            src={selectedImage}
                            alt="Crop image"
                            fill
                            className="object-cover select-none"
                            draggable={false}
                          />
                        </div>

                        {/* Crop overlay */}
                        <div className="absolute inset-4 border-2 border-white border-dashed opacity-60 pointer-events-none rounded"></div>

                        {/* Center crosshair */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Drag to reposition • Use zoom and rotate controls above
                    </p>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Plus className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium">
                        Select an image to edit
                      </p>
                      <p className="text-sm">
                        Choose from existing images or upload a new one
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={onClose} className="px-6 py-2">
                Cancel
              </Button>
              <Button
                onClick={handleSelect}
                className="px-6 py-2 bg-[#1A202C] hover:bg-[#2D3748]"
                disabled={!selectedImage || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Cover'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
