'use client';

import Header from '@/components/Layouts/AuthLayout/Header';
import { ToastProvider } from '@/context/ToastContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="align-element   px-4 py-3 max-w-[1500px] mx-auto">
      <Header />
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
