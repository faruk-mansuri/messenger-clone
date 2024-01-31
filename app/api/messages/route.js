import { getCurrentUser } from '@/app/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export const POST = async (req) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: { id: currentUser.id },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: { id: newMessage.id },
        },
      },
      include: {
        users: true,
        messages: {
          include: { seen: true },
        },
      },
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessages =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email, 'conversation:update', {
        id: conversationId,
        messages: [lastMessages],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log('[MESSAGE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
