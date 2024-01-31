'use client';

import useRoutes from '@/app/hooks/useRoutes';
import { useState } from 'react';
import DesktopItem from './DesktopItem';
import Avatar from '../Avatar';
import SettingsModal from './SettingsModal';

const DesktopSidebar = ({ currentUser }) => {
  const routes = useRoutes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isModalOpen={isModalOpen}
        onChange={() => setIsModalOpen(false)}
      />
      <div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-x-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between'>
        <nav className='mt-4 flex flex-col justify-between'>
          <ul className='flex flex-col items-center space-y-1'>
            {routes.map((route) => {
              return (
                <DesktopItem
                  key={route.label}
                  href={route.href}
                  label={route.label}
                  icon={route.icon}
                  active={route.active}
                  onClick={route.onClick}
                />
              );
            })}
          </ul>
        </nav>

        <nav className='mt-4 flex flex-col justify-between items-center'>
          <div
            className='cursor-pointer hover:opacity-75 transition'
            onClick={() => setIsModalOpen(true)}
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
