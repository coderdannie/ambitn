'use client';

import React, { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { slides } from '@/components/common/constants';

const Slider = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center relative">
      {/* Main container */}
      <div className="w-full absolute bottom-0 left-0 right-0">
        <Carousel
          plugins={[plugin.current]}
          setApi={setApi}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: 'start',
            slidesToScroll: 1,
            containScroll: 'trimSnaps',
          }}
        >
          <CarouselContent className="m-0 p-0 w-full">
            {slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className="relative pl-0 basis-full w-full min-w-full"
              >
                {/* Slide background */}
                <div
                  className="w-full h-screen bg-cover bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${slide.img})` }}
                >
                  {/* Content overlay */}
                  <div className="absolute bottom-0 w-full bg-[rgba(13,12,48,0.6)] backdrop-blur-2xl py-8 text-white ">
                    <div className="max-w-2xl w-full mx-auto px-6">
                      <h2 className="md:text-2xl">{`"${slide.text}"`}</h2>
                      <div className="mt-4">
                        <h4 className="font-medium">{slide.name}</h4>
                        <p className="text-xs">Web Design Agency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <div className="absolute bottom-12 right-[70px] flex z-10">
            <CarouselPrevious className="bg-transparent text-white p-[22px] cursor-pointer rounded-full hover:bg-gray-500 transition duration-200 mr-8" />
            <CarouselNext className="bg-transparent text-white p-[22px] cursor-pointer rounded-full hover:bg-gray-500 transition duration-200" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Slider;
