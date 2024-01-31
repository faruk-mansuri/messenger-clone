import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/components/Avatar';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { AlertTriangle, Trash } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useConversation from '@/app/hooks/useConversation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import AvatarGroup from '@/components/AvatarGroup';
import { useActiveList } from '@/app/hooks/useActiveList';

const ProfileDrawer = ({ conversation }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email) !== -1;

  const statusText = conversation.isGroup
    ? `${conversation.users.length} members`
    : isActive
    ? 'Active'
    : 'Offline';

  const joinedDate = format(new Date(otherUser.createdAt), 'PP');
  const title = conversation.name || otherUser.name;

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `/api/conversations/${conversationId}`
      );
      router.refresh();
      router.push('/conversations');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {}}
          className='text-sky-500 cursor-pointer hover:text-sky-600 transition'
        />
      </SheetTrigger>
      <SheetContent className='w-96 bg-white'>
        <div className='relative mt-6 flex-1 px-4 sm:px-6'>
          <div className='flex flex-col items-center'>
            <div className='mb-2'>
              {conversation.isGroup ? (
                <AvatarGroup users={conversation.users} />
              ) : (
                <Avatar user={otherUser} />
              )}
            </div>
            <div className='font-bold capitalize'>{title}</div>
            <div className='text-sm text-gray-500'>{statusText}</div>
            <div className='flex gap-10 my-8'>
              <div
                onClick={() => {}}
                className='flex flex-col gap-3 items-center'
              >
                <Dialog>
                  <DialogTrigger>
                    <div className='w-10 h-10 bg-neutral-100 rounded-full flex justify-center items-center cursor-pointer hover:opacity-75'>
                      <Trash className='w-4 h-4 ' />
                    </div>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        <div className='flex gap-6'>
                          <div className='h-12 w-12 flex items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                            <AlertTriangle className='text-red-600' />
                          </div>

                          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                            <div className='mt-2'>
                              <p>Delete Conversation</p>
                            </div>
                          </div>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this conversation?This
                        action can not be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <div className='space-x-2'>
                        <DialogClose>
                          <Button disabled={isLoading} variant='secondary'>
                            Close
                          </Button>
                        </DialogClose>

                        <Button
                          disabled={isLoading}
                          variant='destructive'
                          onClick={onDelete}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className='text-sm font-light text-neutral-600'>
                  Delete
                </div>
              </div>
            </div>

            <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
              <dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
                {conversation.isGroup && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40'>
                      Emails
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      {conversation.users.map((user) => user.email).join(', ')}
                    </dd>
                  </div>
                )}
                {!conversation.isGroup && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40'>
                      Email
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      {otherUser.email}
                    </dd>
                  </div>
                )}
                {!conversation.isGroup && (
                  <>
                    <hr />
                    <div>
                      <dt className='text-sm font-medium text-gray-500 sm:w-40'>
                        Joined
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                        <time dateTime={joinedDate}>{joinedDate}</time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;
