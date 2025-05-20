import React, { useRef } from 'react';
import { FileInputProps } from '@/types/portfolio';
import { FaRegImage } from 'react-icons/fa6';
import { MdPlayCircle } from 'react-icons/md';

const FileInput: React.FC<FileInputProps> = ({
  accept,
  onFileSelected,
  className = 'grid place-items-center',
  buttonClassName = 'w-full h-full hover:bg-gray-100 text-left flex items-center',
  inputClassName = 'hidden',
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
        fileInputRef.current.value = '';
      }
    }
  };

  const getIconAndLabel = () => {
    const isImage = accept.includes('image');
    return {
      icon: isImage ? <FaRegImage /> : <MdPlayCircle />,
      label: isImage ? 'Image' : 'Video',
    };
  };

  const { icon, label } = getIconAndLabel();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className={buttonClassName}
        aria-label={label}
      >
        <div className="grid place-items-center mx-auto gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm">{label}</span>
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
