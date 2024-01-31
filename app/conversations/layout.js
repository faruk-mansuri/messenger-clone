import Sidebar from '@/components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';
import getConversations from '../actions/getConversation';
import getUser from '../actions/getUsers';

const ConversationLayout = async ({ children }) => {
  const conversations = await getConversations();
  const users = await getUser();

  return (
    <Sidebar>
      <div className='h-screen'>
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationLayout;
