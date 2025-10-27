"use client";

import AiBuilderChat from "@/components/modules/AiBuilder/AiChatBuilder";
import Header from "@/components/modules/AiBuilder/Header";
import Sidebar from "@/components/modules/AiBuilder/Sidebar";
import DevicePreview from "@/components/modules/AiBuilder/DevicePreview";
import { cn } from "@/lib/utils";
import React from "react";
import { useGlobalContext } from "@/context/appContext";

const AiBuilder = () => {
  const { showPreview, previewData } = useGlobalContext();

  console.log("preview", previewData);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-auto bg-gray-50">
          {showPreview ? (
            <DevicePreview content={previewData?.content?.data} />
          ) : (
            <div className={cn("h-full max-w-[1377px] mx-auto", "pt-6 px-4")}>
              <AiBuilderChat />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AiBuilder;
