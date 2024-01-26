import { Button } from './ui/button';

const AuthSocialButton = ({ icon, onClick }) => {
  return (
    <Button variant='outline' onClick={onClick} className='w-full'>
      {icon}
    </Button>
  );
};

export default AuthSocialButton;
