'use client';
import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import React from 'react';
import MobileItem from './MobileItem';

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) return null;

  return (
    <div className='fixed flex justify-between items-center bg-white w-screen bottom-0 z-40 border-t-[1px] lg:hidden'>
      {routes.map((route) => {
        return (
          <MobileItem
            key={route.label}
            href={route.href}
            label={route.label}
            active={route.active}
            onClick={route.onClick}
            icon={route.icon}
          />
        );
      })}
    </div>
  );
};

export default MobileFooter;
