"use client";

import Slider from "@/components/Layouts/NonAuthLayout/Slider";
import { ToastProvider } from "@/context/ToastContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import Image from "next/image";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const { isMobile } = useWindowSize();

  return (
    <div className="grid min-h-screen md:grid-cols-2 auth-layout">
      {/* Slider Section (desktop only) */}
      <div className="hidden md:block relative">
        <Slider />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center w-full max-w-[550px] px-5 mx-auto auth-bg overflow-y-auto pb-6 scrollbar-hide min-h-screen">
        {/* Logo */}
        <div className="grid place-items-center text-primary font-bold text-2xl pt-6 pb-8 md:pb-10">
          <Image
            src="/assets/logo.png"
            alt="ambitn logo"
            className="w-[140px]"
            width={100}
            height={100}
          />
        </div>

        {/* Main Content */}
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
};

export default Layout;
