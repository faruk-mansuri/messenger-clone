import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

const UploadImage = ({ disabled, value, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <CldUploadButton
        options={{ maxFiles: 2 }}
        uploadPreset='jxeplavy'
        onUpload={(result) => onChange(result.info.secure_url)}
      >
        <div className='mt-2 flex items-center gap-x-3'>
          <div className='relative w-16 h-16'>
            <Image
              fill
              className='rounded-full object-cover'
              src={value || '/images/placeholder.jpg'}
              alt='Avatar'
            />
          </div>
          <Button disabled={disabled}>Change</Button>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default UploadImage;
