import React, { useRef } from "react";
import { FileInputProps } from "@/types/portfolio";
import { FaRegImage } from "react-icons/fa6";
import { MdPlayCircle } from "react-icons/md";
import { IoMusicalNotesOutline } from "react-icons/io5";

interface EnhancedFileInputProps extends FileInputProps {
  customIcon?: React.ReactNode;
  customLabel?: string;
  customDescription?: string;
  iconColor?: string;
  useModernLayout?: boolean;
}

const FileInput: React.FC<EnhancedFileInputProps> = ({
  accept,
  onFileSelected,
  className = "flex place-items-center",
  buttonClassName = "w-full h-full hover:bg-gray-100 text-left flex items-center p-4",
  inputClassName = "hidden",
  customIcon,
  customLabel,
  customDescription,
  iconColor = "text-gray-600",
  useModernLayout = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getIconAndLabel = () => {
    // Use custom icon/label if provided
    if (customIcon && customLabel) {
      return {
        icon: customIcon,
        label: customLabel,
        description: customDescription,
      };
    }

    // Default logic
    if (accept.includes("image")) {
      return {
        icon: <FaRegImage />,
        label: "Image",
        description: "Add photos",
      };
    }
    if (accept.includes("audio")) {
      return {
        icon: <IoMusicalNotesOutline />,
        label: "Audio",
        description: "Add sound clips",
      };
    }
    if (accept.includes("video")) {
      return {
        icon: <MdPlayCircle />,
        label: "Videos",
        description: "Include videos",
      };
    }
    // Default fallback
    return {
      icon: <FaRegImage />,
      label: "File",
      description: "Add files",
    };
  };

  const { icon, label, description } = getIconAndLabel();

  if (useModernLayout) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleClick}
          className={buttonClassName}
          aria-label={label}
        >
          {customIcon ? (
            <div className="flex items-center gap-4">
              {customIcon}
              <div className="text-left">
                <div className="font-medium text-gray-900">{customLabel}</div>
                <div className="text-xs text-gray-500">{customDescription}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <span className={`text-xl ${iconColor}`}>{icon}</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </div>
            </div>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={accept}
          className={inputClassName}
          aria-hidden="true"
        />
      </div>
    );
  }

  // Original layout for backward compatibility
  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className={`${buttonClassName} flex`}
        aria-label={label}
      >
        <div className="flex place-items-center mx-auto gap-2">
          <span className={`text-2xl ${iconColor}`}>{icon}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-medium text-[#656565]">
              {description}
            </span>
          </div>
        </div>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className={inputClassName}
        aria-hidden="true"
      />
    </div>
  );
};

export default FileInput;
