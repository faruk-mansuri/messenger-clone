'use client';

import useConversation from '@/app/hooks/useConversation';
import { useEffect, useRef, useState } from 'react';
import SingleMessage from './SingleMessage';
import axios from 'axios';
import { pusherClient } from '@/lib/pusher';
import { find } from 'lodash';

const Body = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    const messageSeenHandler = async () => {
      await axios.post(`/api/conversations/${conversationId}/seen`);
    };
    messageSeenHandler();
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = async (message) => {
      setMessages((current) => {
        // checking if new message is already exists or not
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView();
      await axios.post(`/api/conversations/${conversationId}/seen`);
    };

    const updateMessageHandler = (newMessage) => {
      setMessages((current) => {
        return current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        });
      });
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('messages:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, index) => {
        return (
          <SingleMessage
            key={message.id}
            isLast={index === messages.length - 1}
            data={message}
          />
        );
      })}
      <div ref={bottomRef} className='pt-24' />
    </div>
  );
};

export default Body;
