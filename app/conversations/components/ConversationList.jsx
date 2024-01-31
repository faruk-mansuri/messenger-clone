'use client';
import useConversation from '@/app/hooks/useConversation';
import { cn } from '@/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import SingleConversation from './SingleConversation';
import GroupChatModal from './GroupChatModal';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import { find } from 'lodash';

const ConversationList = ({ initialItems, users }) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);

  const { conversationId, isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (newConversation) => {
      setItems((current) => {
        if (find(current, { id: newConversation.id })) return current;

        return [newConversation, ...current];
      });
    };

    const updateHandler = ({ id, messages }) => {
      setItems((current) => {
        return current.map((currentConversation) => {
          if (currentConversation.id === id)
            return { ...currentConversation, messages };

          return currentConversation;
        });
      });
    };

    const removeHandler = (conversation) => {
      setItems((current) => {
        return [
          ...current.filter(
            (singleConversation) => singleConversation.id !== conversation.id
          ),
        ];
      });
    };

    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new');
      pusherClient.unbind('conversation:update');
      pusherClient.unbind('conversation:remove');
    };
  });

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={cn(
          'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80  lg:block overflow-y-auto border-r border-gray-200',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4'>
            <div className='text-2xl font-medium text-neutral-800'>
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition'
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => {
            return (
              <SingleConversation
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
