import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div
      className="rounded-3xl shadow-sm h-[290px] pb-2 overflow-hidden pt-0"
      suppressHydrationWarning
    >
      {/* Image skeleton with status badge */}
      <div className="relative h-[179px] overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />

        {/* Status badge skeleton */}
        <div className="absolute top-6 left-6 z-10">
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </div>

      {/* Title and Date skeleton */}
      <div className="pt-3 px-3 space-y-2">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Date skeleton */}
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
