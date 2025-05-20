'use client';

import Slider from '@/components/Layouts/NonAuthLayout/Slider';
import { ToastProvider } from '@/context/ToastContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  const { isMobile } = useWindowSize();

  return (
    <div
      className={`grid slider-show   auth-layout  min-h-screen ${
        isMobile ? 'h-fit' : 'h-screen'
      }`}
    >
      <div className="hide-slider ">
        <Slider />
      </div>
      <div
        className={`flex flex-col justify-center w-full overflow-y-auto max-w-[550px] px-5 mx-auto auth-bg ${
          isMobile ? 'pb-[1.4rem]' : 'pb-4'
        } scrollbar-hide`}
      >
        <div
          className={`grid   place-items-center text-primary font-bold text-2xl  ${
            isMobile ? 'pt-6 pb-8' : 'pt-6 pb-10'
          } `}
        >
          <Image
            src="/assets/logo.png"
            alt="ambitn logo"
            className="w-[140px]"
            width={100}
            height={100}
          />
        </div>

        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
};
export default Layout;
