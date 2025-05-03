// components/Layouts/AuthLayout/Sidebar.tsx
'use client';

import { motion } from 'framer-motion';
import { sidebarData } from '../../common/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation variants
  const menuItemVariants = {
    collapsed: {
      opacity: 1,
      x: 0,
      backgroundColor: 'transparent',
    },
    expanded: {
      opacity: 1,
      x: 0,
      backgroundColor: 'transparent',
    },
    hover: {
      scale: 1.05,
      backgroundColor: '#F7FAFC',
      transition: { duration: 0.2 },
    },
    active: {
      backgroundColor: '#F7FAFC',
      borderLeft: '4px solid white',
    },
  };

  const textVariants = {
    collapsed: { opacity: 0, width: 0 },
    expanded: { opacity: 1, width: 'auto' },
  };

  const toggleButtonVariants = {
    collapsed: { rotate: 180 },
    expanded: { rotate: 0 },
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate async operation with delay
    setTimeout(() => {
      sessionStorage.removeItem('user');
      router.push('/login');
    }, 1000);
  };

  return (
    <motion.div
      className="h-full flex flex-col justify-between p-4"
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-4 pt-2">
        <motion.div
          className="font-bold"
          variants={{
            collapsed: { opacity: 0, width: 0 },
            expanded: { opacity: 1, width: 'auto' },
          }}
          transition={{ duration: 0.2 }}
        >
          Folio
        </motion.div>

        <motion.button
          onClick={onToggle}
          className={`${isCollapsed ? 'unset' : 'ml-auto'} cursor-pointer`}
          variants={toggleButtonVariants}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/assets/togglebar.svg"
            width={20}
            height={20}
            className="mx-auto"
            alt="toggle"
          />
        </motion.button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 mt-8 shadow-[0_2px_7px_rgba(0,0,0,0.1)] rounded-[16px] px-4 pt-4">
        {isCollapsed ? (
          <Image
            className="rounded-full"
            src="/assets/profilepic.png"
            alt="profile picture"
            width={40}
            height={40}
          />
        ) : (
          <div className="flex items-center gap-1 pl-2 pr-[2px] border-[#E5E7EB] border rounded-2xl py-3">
            <Image
              className="rounded-full"
              src="/assets/profilepic.png"
              alt="profile picture"
              width={40}
              height={40}
            />

            <div className="">
              <h4 className="text-sm text-[#14171F]">Independent Workspace</h4>
              <p className="text-[#677084] text-xs">Kehinde Falodi</p>
            </div>
          </div>
        )}

        <ul className="space-y-2 mt-8">
          {sidebarData.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== '/' && pathname?.startsWith(item.path));

            return (
              <motion.li
                key={item.path}
                variants={menuItemVariants}
                initial={{ backgroundColor: 'transparent' }}
                whileHover="hover"
                animate={
                  isActive ? 'active' : isCollapsed ? 'collapsed' : 'expanded'
                }
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn('overflow-hidden rounded-md relative')}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 h-full w-[5px] bg-primary rounded-l-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                <Link
                  href={item.path}
                  className="flex items-center gap-3 p-2 pl-4"
                >
                  <motion.span className="text-xl">
                    {pathname.includes(item.path) ? item.sec : item.icon}
                  </motion.span>

                  <motion.span
                    className={`whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-primary'
                        : 'font-medium text-[#344054]'
                    }`}
                    variants={textVariants}
                    transition={{ duration: 0.2 }}
                  >
                    {item.title}
                  </motion.span>
                </Link>
              </motion.li>
            );
          })}

          {/* Logout Button */}
          <motion.li
            variants={menuItemVariants}
            initial={{ backgroundColor: 'transparent' }}
            whileHover="hover"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn('overflow-hidden rounded-md relative mt-8')}
          >
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 p-2 pl-4 w-full"
            >
              <motion.span className="text-xl">
                {isLoggingOut ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: 'linear',
                    }}
                    className="inline-block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                  </motion.span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                )}
              </motion.span>

              <motion.span
                className={`whitespace-nowrap font-medium text-[#344054] ${
                  isLoggingOut ? 'opacity-70' : ''
                }`}
                variants={textVariants}
                transition={{ duration: 0.2 }}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </motion.span>
            </button>
          </motion.li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
