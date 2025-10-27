"use client";

import Header from "@/components/Layouts/AuthLayout/Header";
import ProjectSidebar from "@/components/Layouts/AuthLayout/ProjectSidebar";
import GlobalProvider from "@/context/appContext";
import { ToastProvider } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <ToastProvider>{children}</ToastProvider>
    </GlobalProvider>
  );
}
