'use client';

import useConversation from '@/app/hooks/useConversation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';

const formSchema = z.object({
  message: z.string().min(1, { message: 'message is required' }),
});

const InputForm = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await axios.post('/api/messages', { ...values, conversationId });
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (result) => {
    if (isLoading) return;
    await axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset='jxeplavy'
      >
        <HiPhoto size={30} className='text-sky-500' />
      </CldUploadButton>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center gap-2 lg:gap-4 w-full'
        >
          <FormField
            name='message'
            render={({ field }) => {
              return (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='your message'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <Button disabled={isLoading}>
            <HiPaperAirplane size={18} className='text-white' />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InputForm;
