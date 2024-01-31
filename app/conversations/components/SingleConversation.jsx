import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SingleConversation = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/conversations/${data.id}`);
  };

  const messages = data.messages || [];
  const lastMessage = messages[messages.length - 1];

  const userEmail = session?.data?.user?.email;

  const hasSeenMessage = () => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    if (!userEmail) return false;
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  };
  const hasSeen = hasSeenMessage();

  let lastMessageText;
  if (lastMessage?.image) lastMessageText = 'sent an image';
  else if (lastMessage?.body) lastMessageText = lastMessage.body;
  else lastMessageText = 'started a conversation';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3',
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className=' font-medium text-gray-900'>
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-xs text-gray-400 font-light'>
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={cn(
              'truncate text-sm',
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleConversation;
