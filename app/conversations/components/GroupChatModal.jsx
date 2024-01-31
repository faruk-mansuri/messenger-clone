'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { FormInput } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import * as z from 'zod';
import MultipleSelector from '@/components/ui/MultipleSelector';
import { Button } from '@/components/ui/button';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const formSchema = z.object({
  name: z.string().min(2, 'At least 2 characters are required.'),
  members: z
    .array(optionSchema)
    .min(2, { message: 'At least 2 members are required.' }),
});

const GroupChatModal = ({ isOpen, onClose, users }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/conversations', {
        ...values,
        isGroup: true,
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-12'>
              <div className='border-b border-gray-900/10 pb-12'>
                <h2 className='text-base font-semibold leading-7 text-gray-900'>
                  Create a group chat
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                  Create a chat with more than 2 people
                </p>

                <div className='mt-10 flex flex-col gap-y-8'>
                  <FormField
                    name='name'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder=''
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    name='members'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Members</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              value={field.value}
                              onChange={field.onChange}
                              defaultOptions={users.map((user) => {
                                return { label: user.name, value: user.id };
                              })}
                              placeholder='Select members you like...'
                              emptyIndicator={
                                <p className='text-center text-sm  text-gray-600 dark:text-gray-400'>
                                  no users found.
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='mt-6 flex items-center justify-end gap-x-6'>
              <Button
                type='button'
                disabled={isLoading}
                variant='secondary'
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
