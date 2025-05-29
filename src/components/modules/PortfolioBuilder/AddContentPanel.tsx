'use client';

import FileInput from './FileInput';
import { MdCode, MdLink } from 'react-icons/md';
import { RxText } from 'react-icons/rx';
import { IoMusicalNotesOutline } from 'react-icons/io5';

interface Props {
  setAddingText: (prop: boolean) => void;
  handleImageSelected: (prop: File) => void;
  handleVideoSelected: (prop: File) => void;
  setTextContent?: (content: string) => void;
}

export default function AddContentPanel({
  handleImageSelected,
  setAddingText,
  handleVideoSelected,
  setTextContent,
}: Props) {
  const handleTextClick = () => {
    if (setTextContent) {
      setTextContent(''); // Clear previous text content
    }
    setAddingText(true);
  };
  return (
    <div className="w-full hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white h-fit">
      <h2 className="text-sm font-semibold bg-[#F7FAFCB2] px-2 py-4">
        Add Content
      </h2>

      <div className="grid grid-cols-2">
        {/* Image */}
        <FileInput
          accept="image/*"
          onFileSelected={handleImageSelected}
          className="border border-gray-200"
        />

        {/* Text */}
        <button
          className="flex flex-col items-center justify-center gap-1 p-4 border border-gray-200 hover:bg-gray-50"
          onClick={handleTextClick}
        >
          <RxText className="text-xl" />
          <span className="text-sm">Text</span>
        </button>

        {/* Audio */}
        <div className="flex flex-col items-center justify-center gap-1 p-4 border border-gray-200 hover:bg-gray-50">
          <IoMusicalNotesOutline className="text-xl" />
          <span className="text-sm">Audio</span>
        </div>

        {/* Video */}
        <div className="flex flex-col items-center justify-center gap-1 p-4 border border-gray-200 hover:bg-gray-50">
          <FileInput accept="video/*" onFileSelected={handleVideoSelected} />
        </div>

        {/* Embed with badge */}
        <button className="relative flex flex-col items-center justify-center gap-1 p-4 border border-gray-200 hover:bg-gray-50">
          <MdCode className="text-xl" />
          <span className="text-sm">Embed</span>
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
            E
          </span>
        </button>

        {/* Social Links */}
        <button className="flex flex-col items-center justify-center gap-1 p-4 border border-gray-200 hover:bg-gray-50">
          <MdLink className="text-xl" />
          <span className="text-sm">Social links</span>
        </button>
      </div>

      {/* AI Suggestion Toggle */}
      <div className="flex items-center justify-between py-4 px-2 bg-[#F7FAFCB2]">
        <span className="text-sm font-medium">AI Suggestion</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}
