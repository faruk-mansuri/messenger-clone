import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import UploadImage from './UploadImage';

const userForm = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  image: z.string().min(1, { message: 'image is required' }),
});

const SettingsModal = ({ isModalOpen, onChange, currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(userForm),
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image || '',
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/api/settings/`, values);
      onChange();
      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      // const errorMessage = error.response.data.;
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  const handleParentClick = (event) => {
    if (event.target === event.currentTarget) {
      onChange();
    }
  };

  return (
    <div
      onClick={handleParentClick}
      className='bg-gray-900/80 absolute inset-0 z-50 flex justify-center items-center'
    >
      <div className='bg-white w-[30rem] rounded-lg relative p-4'>
        <MdClose
          className='absolute top-2 right-2 text-gray-900 hover:opacity-75 transition cursor-pointer'
          onClick={onChange}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-12'>
              <div className='border-b border-gray-900/10 pb-12'>
                <h2 className='text-base font-semibold leading-7 text-gray-900'>
                  Profile
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                  Edit your public information
                </p>

                <div className='mt-10 flex flex-col gap-y-8'>
                  {/* NAME */}
                  <FormField
                    name='name'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* IMAGE */}
                  <FormField
                    name='image'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Photo</FormLabel>
                          <FormControl>
                            <UploadImage
                              disabled={isLoading}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className='mt-6 flex items-center justify-end gap-x-6'>
                <Button
                  disabled={isLoading}
                  variant='secondary'
                  onClick={onChange}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsModal;
