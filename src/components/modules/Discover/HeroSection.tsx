import Image from 'next/image';
import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  leftImage: string;
  rightImage: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  leftImage,
  rightImage,
}) => {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="w-16 h-16  rounded-2xl flex items-center justify-center transform -rotate-12">
          {leftImage.includes('assets') ? (
            <Image src={leftImage} width={100} height={100} alt={title} />
          ) : (
            <span className="text-4xl">{leftImage}</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#000000]">
            {title}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-[#000000] mt-1">
            {subtitle}
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-12">
          {rightImage.includes('assets') ? (
            <Image src={rightImage} width={100} height={100} alt={title} />
          ) : (
            <span className="text-4xl">{rightImage}</span>
          )}
        </div>
      </div>
    </div>
  );
};
