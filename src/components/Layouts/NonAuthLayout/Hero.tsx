import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="align-element flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-16">
      {/* Left Column - Text Content */}
      <div className="flex-1 space-y-6">
        <h1 className="btn-text-gradient font-heading leading-tight">
          Top Creators from Around the Globe Showcase on Forlio
        </h1>
        <p className="pt-4 md:text-lg text-[#464646]">
          Join the vibrant community where innovation and inspiration come to
          life.
        </p>
        <div className="flex items-center gap-6 mt-7">
          <Button className="btn-gradient py-[1.3rem]">
            <span>Publish with AI</span>
            <ArrowRight />
          </Button>
          <Button variant="outline">Explore templates</Button>
        </div>
        <p className="text-sm text-gray-500">Trusted by 100+ creators</p>
      </div>

      {/* Right Images Grid - 3 Columns */}
      <div className="flex-1 relative w-full  mt-12  min-991:mt-0">
        {/* Top Glass Overlay - Outside Grid */}
        <div className="absolute -top-14 right-[-100px] z-10 px-4">
          <Image
            src="/assets/hero-img3.svg"
            alt="Analytics dashboard"
            width={200}
            height={200}
          />
        </div>
        <div className="relative w-full scale-105 md:scale-110 lg:scale-120">
          <Image
            src="/assets/hero-img1.svg"
            alt="Analytics dashboard"
            width={1200}
            height={840}
            className="w-full h-auto"
            priority // Add this for better performance on hero images
          />
        </div>
        <div className="relative h-full">
          <div className="relative w-full h-full  shadow-xl">
            {/* Stats Overlay at Bottom */}
            <div className="absolute bottom-18 left-[-80px] ">
              <Image
                src="/assets/hero-img2.svg"
                alt="Analytics dashboard"
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
