import { useSession } from 'next-auth/react';

const useOtherUser = (conversation, users) => {
  const session = useSession();

  const currentUser = session?.data?.user?.email;
  const otherUser = conversation.users.filter(
    (user) => user.email !== currentUser
  );
  return otherUser[0];
};

export default useOtherUser;
