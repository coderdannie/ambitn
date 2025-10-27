"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { EXPLORE_TABS } from "@/components/common/constants";
import { DiscoverTabs } from "@/components/modules/Discover/DiscoverTab";
import { HeroSection } from "@/components/modules/Discover/HeroSection";
import { PortfolioCard } from "@/components/common/PortfolioCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TbFilterSearch } from "react-icons/tb";
import AIPromptTextBox from "@/components/modules/AiBuilder/AiPromptTextbox";

const DiscoverPage = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const [isShow, setIsShow] = useState(false);

  const currentTabData =
    EXPLORE_TABS.find((tab) => tab.label === activeTab) || EXPLORE_TABS[0];

  const tabLabels = EXPLORE_TABS.map((tab) => tab.label);

  const router = useRouter();

  const handleCreate = () => {
    router.push("/portfolio-builder");
  };
  return (
    <div>
      <h1 className="text-center font-semibold text-lg md:text-xl lg:text-4xl pt-6 md:pt-18 pb-12 bg-gradient-to-r from-[#1A202C] to-[#441C31] bg-clip-text text-transparent">
        What case study will you create today?
      </h1>

      <div className="flex justify-center gap-3">
        <button
          className="flex items-center gap-3  hover:bg-[#F7F5F4] rounded-[8px] py-[10px] px-5 text-sm text-[#1A202C] font-medium"
          onClick={handleCreate}
        >
          <Image
            src="/assets/edit.png"
            alt="edit icon"
            width={10}
            height={10}
          />
          <span>Create</span>
        </button>{" "}
        <button className="flex items-center gap-3  hover:bg-[#F7F5F4] rounded-[8px] py-[10px] px-5 text-sm text-[#1A202C] font-medium">
          <Image
            src="/assets/grid-5.png"
            alt="edit icon"
            width={10}
            height={10}
          />
          <span>Template</span>
        </button>{" "}
        <button
          className="flex items-center gap-3  hover:bg-[#F7F5F4] rounded-[8px] py-[10px] px-5 text-sm text-[#1A202C] font-medium"
          onClick={() => router.push("/ai-builder")}
        >
          <Image
            src="/assets/magicpen.png"
            alt="edit icon"
            width={15}
            height={15}
          />
          <span>Ambitn AI</span>
        </button>
      </div>
      <div>{isShow && <AIPromptTextBox />}</div>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg md:text-2xl">Discover</h4>
        <Button
          variant="outline"
          className="text-[#344054] !h-[44px] borer border-[#D0D5DD] px-3 text-sm flex gap-1 items-center"
        >
          <TbFilterSearch size={20} className="font-bold" /> Filter
        </Button>
      </div>

      <div className="max-w-7xl mx-auto py-7">
        <DiscoverTabs
          tabs={tabLabels}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTabData.portfolioItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default DiscoverPage;
