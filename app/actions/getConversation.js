import prisma from '@/lib/prismadb';
import { getCurrentUser } from './getCurrentUser';

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        users: true,
        messages: {
          include: { sender: true, seen: true },
        },
      },
    });

    return conversations;
  } catch (error) {
    return [];
  }
};

export default getConversations;
