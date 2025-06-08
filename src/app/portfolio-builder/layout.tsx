'use client';

import Header from '@/components/Layouts/AuthLayout/SecondarHeader';
import GlobalProvider from '@/context/appContext';
import { ToastProvider } from '@/context/ToastContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <div className=" bg-[#fcfcfc] min-h-screen  h-auto  max-w-[1600px] mx-auto">
        <Header />
        <ToastProvider>{children}</ToastProvider>
      </div>
    </GlobalProvider>
  );
}
