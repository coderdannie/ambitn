'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { EXPLORE_TABS } from '@/components/common/constants';
import { ExploreTabs } from '@/components/modules/Explore/ExploreTabs';
import { HeroSection } from '@/components/modules/Explore/HeroSection';
import { PortfolioCard } from '@/components/common/PortfolioCard';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('Featured');

  const currentTabData =
    EXPLORE_TABS.find((tab) => tab.label === activeTab) || EXPLORE_TABS[0];

  const tabLabels = EXPLORE_TABS.map((tab) => tab.label);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg md:text-2xl">Explore</h4>
        <Button className="secondary-btn !h-[44px] !w-fit px-3 text-sm flex gap-1 items-center">
          <AiOutlinePlusCircle size={20} className="font-bold" /> Filter
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ExploreTabs
          tabs={tabLabels}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <HeroSection
          title={currentTabData.title}
          subtitle={currentTabData.subtitle}
          leftImage={currentTabData.leftImage}
          rightImage={currentTabData.rightImage}
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
export default ExplorePage;
