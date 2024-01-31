'use client';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { HiChevronLeft } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/components/AvatarGroup';
import { useActiveList } from '@/app/hooks/useActiveList';

const Header = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email) !== -1;

  const statusText = conversation.isGroup
    ? `${conversation.users.length} members`
    : isActive
    ? 'Active'
    : 'Offline';

  return (
    <div className='bg-white w-full border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between flex items-center shadow-sm'>
      <div className='flex gap-3 items-center'>
        <Link
          href='/conversations'
          className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer '
        >
          <HiChevronLeft size={32} />
        </Link>

        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className='flex flex-col'>
          <div>{conversation.name || otherUser.name}</div>
          <div className='text-sm font-light text-neutral-500'>
            {statusText}
          </div>
        </div>
      </div>

      <ProfileDrawer conversation={conversation} />
    </div>
  );
};

export default Header;
