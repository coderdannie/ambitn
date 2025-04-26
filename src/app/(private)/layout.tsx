// app/layout.tsx (Server Component)
import { cn } from '@/lib/utils';
import SidebarWrapper from '../../components/Layouts/AuthLayout/SidebarWrapper';
import Header from '@/components/Layouts/AuthLayout/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Will be controlled by client component */}
      <SidebarWrapper />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main
          className={cn(
            'flex-1 pb-6 max-w-[1277px] relative w-full',
            'px-6 pt-24 overflow-auto'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
