'use client';
import { useState } from 'react';
import Image from 'next/image';
import { HiOutlineBell } from 'react-icons/hi2';
// import { IoMenuSharp } from 'react-icons/io5';
import { useWindowSize } from '@/hooks/useWindowSize';
import SearchInput from '@/components/common/SearchInput';
// import MobileSidebar from './Sidedrawer';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { isMobile } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState('');
  //   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  //   const toggleMobileSidebar = () => {
  //     setIsMobileSidebarOpen(!isMobileSidebarOpen);
  //   };

  return (
    <header
      className={`h-[70px] sticky top-0 left-0 z-10 bg-white w-full flex justify-between  px-[30px] pt-4 pb-2`}
    >
      {/* <Image
        src="/assets/logo.png"
        alt="ambitn logo"
        className="w-[120px] h-auto"
        width={140}
        height={40}
      /> */}
      <div className={`flex items-center justify-between w-full`}>
        {' '}
        <Image
          src="/assets/logo.png"
          alt="ambitn logo"
          className="w-[120px] h-auto"
          width={140}
          height={40}
        />
        {!isMobile && (
          <div className="h-[36px] max-w-[550px] w-full">
            <SearchInput
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder="Search projects of talented creators........"
            />
          </div>
        )}
        <div className="flex items-center gap-[17px] ">
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative grid place-items-center">
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
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {/* <NotificationsPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      /> */}
      {/* <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={toggleMobileSidebar}
      /> */}
    </header>
  );
};
export default Header;
