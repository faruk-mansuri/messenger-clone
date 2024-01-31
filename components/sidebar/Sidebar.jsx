import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import { getCurrentUser } from '@/app/actions/getCurrentUser';

const Sidebar = async ({ children }) => {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <DesktopSidebar currentUser={currentUser} />
      <MobileFooter />
      <main className='lg:pl-20'>{children}</main>
    </div>
  );
};

export default Sidebar;
