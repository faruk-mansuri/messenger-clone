import AuthForm from './components/AuthForm';
import Image from 'next/image';

const Home = () => {
  return (
    <div className='h-screen flex flex-col justify-center bg-gray-100'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image
          alt='logo'
          height='48'
          width='48'
          className='mx-auto'
          src='/images/logo.png'
        />
        <h2 className='mt-6 text-center text-3xl font-bold tracking-wide text-gray-900'>
          Sign in to your account
        </h2>
      </div>

      <AuthForm />
    </div>
  );
};

export default Home;
