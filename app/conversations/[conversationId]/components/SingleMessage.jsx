import Avatar from '@/components/Avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

const SingleMessage = ({ isLast, data }) => {
  const session = useSession();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const container = cn('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = cn(isOwn && 'order-2');
  const body = cn('flex flex-col gap-2', isOwn && 'item-end');
  const message = cn(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-md py-2 px-3'
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gary-500'>{data.sender.name}</div>
          <div className='text-xs text-gray-400'>
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setIsImageModalOpen(true)}
              alt='img'
              height={288}
              width={288}
              src={data.image}
              className='object-cover cursor-pointer hover:scale-110 transition'
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className='text-xs font-light font-gray-500'>{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default SingleMessage;
