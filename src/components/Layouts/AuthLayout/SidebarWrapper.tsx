// components/Layouts/AuthLayout/SidebarWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export default function SidebarWrapper() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={cn(
        'h-full flex-shrink-0 overflow-y-auto transition-all duration-300',
        '', // Just for visibility
        isCollapsed ? 'w-28' : 'w-68'
      )}
      style={{
        // Only apply the width transition after mounting to avoid flash
        transition: isMounted ? 'width 300ms ease-in-out' : 'none',
      }}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
    </div>
  );
}
