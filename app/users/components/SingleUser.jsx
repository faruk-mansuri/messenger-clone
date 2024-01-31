import Avatar from '@/components/Avatar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import LoadingModal from '@/components/LoadingModal';

const SingleUser = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/conversations', {
        userId: user.id,
      });
      router.push(`/conversations/${response.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className='w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer'
      >
        <Avatar user={user} />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm font-medium text-gray-900'>{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleUser;
