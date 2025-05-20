export const ProfileSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  if (isCollapsed) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 pl-2 pr-[2px] border-[#E5E7EB] border rounded-2xl py-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};
