"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload } from "lucide-react";
import UploadContent from "./UploadContent";
import DraftContent from "./DraftContent";

export default function ProjectUploadTab() {
  const [activeTab, setActiveTab] = useState("work");

  const tabs = [
    { id: "work", label: "Work" },
    { id: "drafts", label: "Drafts" },
  ];

  return (
    <div className="mt-10">
      {/* Tab Navigation */}
      <div className="flex items-center border-b pb-3 border-gray-200 mb-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-[6px] px-4 relative rounded-full font-medium ${
                activeTab === tab.id
                  ? "text-black font-semibold bg-[#1A202C1A]"
                  : "text-[#1A202C99] hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === "work" ? <UploadContent /> : <DraftContent />}
      </AnimatePresence>
    </div>
  );
}
