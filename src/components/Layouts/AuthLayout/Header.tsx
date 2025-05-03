'use client';
import { useState } from 'react';
import Image from 'next/image';
import { HiOutlineBell } from 'react-icons/hi2';
import { IoMenuSharp } from 'react-icons/io5';
import { useWindowSize } from '@/hooks/useWindowSize';
import SearchInput from '@/components/common/SearchInput';
import MobileSidebar from './Sidedrawer';

const Header = () => {
  const { isMobile } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <header
      className={`h-[70px] sticky top-0 left-0 w-full flex justify-between  px-[30px] pt-4 pb-2`}
    >
      <button
        className={`${isMobile ? 'block' : 'hidden'} `}
        onClick={toggleMobileSidebar}
      >
        <IoMenuSharp className="text-primary text-3xl" />
      </button>
      <div
        className={`flex items-center ${
          isMobile ? 'justify-end' : 'justify-between'
        } w-full`}
      >
        {!isMobile && (
          <div className="h-[36px] max-w-[550px] w-full">
            <SearchInput value={searchTerm} setValue={setSearchTerm} />
          </div>
        )}

        <div className="flex items-center gap-[20px] ">
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="relative h-fit"
                // onClick={toggleNotifications}
                aria-label="Open notifications"
              >
                <HiOutlineBell
                  size={28}
                  className="text-[#808191] font-semibold"
                />
                <span className="absolute top-0 right-0 transform w-2.5 h-2.5 rounded-full"></span>
              </button>
            </div>
            {/* User Profile */}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {/* <NotificationsPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      /> */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={toggleMobileSidebar}
      />
    </header>
  );
};
export default Header;
