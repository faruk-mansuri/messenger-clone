import { cn } from '@/lib/utils';
import Link from 'next/link';

const MobileItem = ({ label, active, onClick, href, icon: Icon }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'flex  w-full justify-center gap-x-3 font-semibold leading-6 p-4 text-gray-500 hover:text-black hover:bg-gray-100 ',
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon className='w-6 h-6' />
    </Link>
  );
};

export default MobileItem;
