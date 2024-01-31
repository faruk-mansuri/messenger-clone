import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';

const ImageModal = ({ src, isOpen, onClose }) => {
  if (!src) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className='w-8- h-80'>
          <Image alt='Image' className='object-cover' fill src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
