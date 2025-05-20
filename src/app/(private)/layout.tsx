import { cn } from '@/lib/utils';
import SidebarWrapper from '../../components/Layouts/AuthLayout/SidebarWrapper';
import Header from '@/components/Layouts/AuthLayout/Header';
import GlobalProvider from '@/context/appContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <div className="flex h-screen">
        {/* Sidebar - Will be controlled by client component */}
        <SidebarWrapper />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Header />
          <main
            className={cn(
              'flex-1 pb-6 max-w-[1377px] relative w-full pt-24',
              'px-6 pt-5 overflow-auto' // Removed -z-10
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </GlobalProvider>
  );
}
