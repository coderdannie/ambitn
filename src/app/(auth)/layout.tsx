'use client';

import Slider from '@/components/Layouts/NonAuthLayout/Slider';
import { ToastProvider } from '@/context/ToastContext';
import { useWindowSize } from '@/hooks/useWindowSize';
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
        <p className="text-center text-primary font-bold text-2xl pb-12 pt-6">
          Ambitn
        </p>
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
};
export default Layout;
