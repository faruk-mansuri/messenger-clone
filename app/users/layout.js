import Sidebar from '@/components/sidebar/Sidebar';
import getUser from '../actions/getUsers';
import UserList from './components/UserList';

const UserLayout = async ({ children }) => {
  const users = await getUser();

  return (
    <Sidebar>
      <UserList users={users} />
      {children}
    </Sidebar>
  );
};

export default UserLayout;
