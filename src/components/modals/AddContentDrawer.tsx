"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MdAudiotrack,
  MdCode,
  MdLink,
  MdImage,
  MdVideoLibrary,
} from "react-icons/md";
import { RxText } from "react-icons/rx";
import { X, Plus } from "lucide-react";
import FileInput from "../modules/PortfolioBuilder/FileInput";

interface AddContentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setAddingText: (prop: boolean) => void;
  handleImageSelected: (prop: File) => void;
  handleVideoSelected: (prop: File) => void;
  setTextContent?: (content: string) => void;
  onAudioAdd?: () => void;
  onEmbedAdd?: () => void;
  onSocialLinksAdd?: () => void;
}

const AddContentDrawer = ({
  isOpen,
  onClose,
  setAddingText,
  handleImageSelected,
  handleVideoSelected,
  setTextContent,
  onAudioAdd,
  onEmbedAdd,
  onSocialLinksAdd,
}: AddContentDrawerProps) => {
  const [aiSuggestionEnabled, setAiSuggestionEnabled] = useState(false);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && target.classList.contains("drawer-backdrop")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleTextClick = () => {
    if (setTextContent) {
      setTextContent(""); // Clear previous text content
    }
    setAddingText(true);
    onClose(); // Close drawer after selection
  };

  const handleOptionClick = (callback?: () => void) => {
    if (callback) {
      callback();
      onClose(); // Close drawer after selection
    }
  };

  // Drawer animation variants
  const drawerVariants = {
    hidden: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const contentOptions = [
    {
      icon: MdImage,
      label: "Image",
      color: "text-blue-600",
      bgColor: "hover:bg-blue-50",
      isFileInput: true,
      fileType: "image/*",
      onFileSelect: handleImageSelected,
    },
    {
      icon: RxText,
      label: "Text",
      color: "text-green-600",
      bgColor: "hover:bg-green-50",
      onClick: handleTextClick,
    },
    {
      icon: MdVideoLibrary,
      label: "Video",
      color: "text-purple-600",
      bgColor: "hover:bg-purple-50",
      isFileInput: true,
      fileType: "video/*",
      onFileSelect: handleVideoSelected,
    },
    {
      icon: MdAudiotrack,
      label: "Audio",
      color: "text-orange-600",
      bgColor: "hover:bg-orange-50",
      onClick: () => handleOptionClick(onAudioAdd),
      disabled: !onAudioAdd,
    },
    {
      icon: MdCode,
      label: "Embed",
      color: "text-gray-600",
      bgColor: "hover:bg-gray-50",
      onClick: () => handleOptionClick(onEmbedAdd),
      disabled: !onEmbedAdd,
      badge: "E",
    },
    {
      icon: MdLink,
      label: "Social Links",
      color: "text-indigo-600",
      bgColor: "hover:bg-indigo-50",
      onClick: () => handleOptionClick(onSocialLinksAdd),
      disabled: !onSocialLinksAdd,
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 drawer-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[310px] bg-white z-50 shadow-xl"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#F7FAFCB2]">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Add Content
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close drawer"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Content Options */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {contentOptions.map((option, index) => (
                      <motion.div
                        key={option.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: option.disabled ? 1 : 1.02 }}
                        whileTap={{ scale: option.disabled ? 1 : 0.98 }}
                        className="relative"
                      >
                        {option.isFileInput ? (
                          <FileInput
                            accept={option.fileType!}
                            onFileSelected={(file) => {
                              option.onFileSelect!(file);
                              onClose();
                            }}
                            className={`
      w-full h-24 border-2 border-dashed border-gray-300 rounded-lg 
      transition-all duration-200 cursor-pointer
      ${option.bgColor} hover:border-gray-400
    `}
                            buttonClassName="w-full h-full hover:bg-transparent text-center flex flex-col items-center justify-center gap-2"
                            customIcon={<option.icon />}
                            customLabel={option.label}
                            iconColor={option.color}
                          />
                        ) : (
                          <button
                            onClick={option.onClick}
                            disabled={option.disabled}
                            className={`
                              relative w-full h-24 flex flex-col items-center justify-center gap-2 
                              border-2 border-dashed border-gray-300 rounded-lg 
                              transition-all duration-200
                              ${
                                option.disabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : `${option.bgColor} hover:border-gray-400 cursor-pointer`
                              }
                            `}
                          >
                            <option.icon
                              className={`text-2xl ${option.color}`}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {option.label}
                            </span>

                            {/* Badge for Embed */}
                            {option.badge && (
                              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {option.badge}
                              </span>
                            )}
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Suggestion Toggle */}
                <motion.div
                  className="p-4 border-t border-gray-200 bg-[#F7FAFCB2]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      AI Suggestion
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={aiSuggestionEnabled}
                        onChange={(e) =>
                          setAiSuggestionEnabled(e.target.checked)
                        }
                      />
                      <motion.div
                        className={`w-11 h-6 rounded-full transition-all ${
                          aiSuggestionEnabled ? "bg-blue-500" : "bg-gray-200"
                        }`}
                        animate={{
                          backgroundColor: aiSuggestionEnabled
                            ? "#3B82F6"
                            : "#E5E7EB",
                        }}
                      />
                      <motion.div
                        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{
                          x: aiSuggestionEnabled ? 20 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </label>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddContentDrawer;
