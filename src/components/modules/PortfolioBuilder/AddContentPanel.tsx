"use client";

import FileInput from "./FileInput";
import { Type, Video, Link, Sparkles } from "lucide-react";
import { BsImage } from "react-icons/bs";
import { PiPlayCircleFill } from "react-icons/pi";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { VscLink } from "react-icons/vsc";

interface Props {
  setAddingText: (prop: boolean) => void;
  handleImageSelected: (prop: File) => void;
  handleVideoSelected: (prop: File) => void;
  handleAudioSelected: (prop: File) => void;
  setTextContent?: (content: string) => void;
}

export default function AddContentPanel({
  handleImageSelected,
  setAddingText,
  handleVideoSelected,
  handleAudioSelected,
  setTextContent,
}: Props) {
  const handleTextClick = () => {
    if (setTextContent) {
      setTextContent("");
    }
    setAddingText(true);
  };

  return (
    <div className="w-full mt-6">
      <div
        className="grid gap-2
      overflow-hidden"
      >
        {/* Image */}
        <div className="border border-[#E4E4E480] bg-white rounded-[8px] ">
          <FileInput
            accept="image/*"
            onFileSelected={handleImageSelected}
            className="w-full"
            buttonClassName="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            useModernLayout={true}
            customIcon={
              <div className="w-10 h-10 rounded-xl bg-[#F6F6F6A6] flex items-center justify-center">
                <BsImage className="w-5 h-5 text-[#282F3B]" />
              </div>
            }
            customLabel="Image"
            customDescription="Add photos"
          />
        </div>

        {/* Text */}
        <button
          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border border-[#E4E4E480] bg-white rounded-[8px] text-left"
          onClick={handleTextClick}
        >
          <div className="w-10 h-10 rounded-xl bg-[#F6F6F6A6]  flex items-center justify-center">
            <Type className="w-5 h-5 text-[#282F3B]" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Text</div>
            <div className="text-xs text-gray-500">Write rich content</div>
          </div>
        </button>

        {/* Videos */}
        <div className="border border-[#E4E4E480] bg-white rounded-[8px] ">
          <FileInput
            accept="video/*"
            onFileSelected={handleVideoSelected}
            className="w-full"
            buttonClassName="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            useModernLayout={true}
            customIcon={
              <div className="w-10 h-10 rounded-xl bg-[#F6F6F6A6]  flex items-center justify-center">
                <PiPlayCircleFill className="w-5 h-5 text-[#282F3B]" />
              </div>
            }
            customLabel="Videos"
            customDescription="Include videos"
          />
        </div>

        {/* Audio */}
        <div className="border border-[#E4E4E480] bg-white rounded-[8px] ">
          <FileInput
            accept="audio/*"
            onFileSelected={handleAudioSelected}
            className="w-full"
            buttonClassName="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            useModernLayout={true}
            customIcon={
              <div className="w-10 h-10 rounded-xl bg-[#F6F6F6A6]  flex items-center justify-center">
                <IoMusicalNotesOutline className="w-5 h-5 " />
              </div>
            }
            customLabel="Audio"
            customDescription="Add sound clips"
          />
        </div>

        {/* Embed */}
        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border border-[#E4E4E480] bg-white rounded-[8px] text-left">
          <div className="w-10 h-10 rounded-xl bg-[#F6F6F6A6] ] flex items-center justify-center">
            <VscLink className="w-5 h-5 text-[#282F3B]" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Embed</div>
            <div className="text-sm text-gray-500">Add links</div>
          </div>
        </button>

        {/* Ambian AI */}
        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border border-[#E4E4E480] bg-white rounded-[8px] text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Ambian AI</div>
            <div className="text-sm text-gray-500">Use AI</div>
          </div>
        </button>
      </div>
    </div>
  );
}
