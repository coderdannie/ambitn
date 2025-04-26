// components/Layouts/AuthLayout/Sidebar.tsx
'use client';

import { motion } from 'framer-motion';
import { sidebarData } from '../../common/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();

  // Animation variants
  const menuItemVariants = {
    collapsed: {
      opacity: 1,
      x: 0,
      backgroundColor: 'transparent', // Add this
    },
    expanded: {
      opacity: 1,
      x: 0,
      backgroundColor: 'transparent', // Add this
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

  return (
    <motion.div
      className="h-full flex flex-col justify-between p-4"
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-4">
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
      <nav className="flex-1 mt-8  shadow-[0_2px_7px_rgba(0,0,0,0.1)] rounded-[16px] px-4 pt-4 ">
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
                initial={{ backgroundColor: 'transparent' }} // Add this
                whileHover="hover"
                animate={
                  isActive ? 'active' : isCollapsed ? 'collapsed' : 'expanded'
                }
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn('overflow-hidden rounded-md relative')}
              >
                {/* Active indicator bar */}
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
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
