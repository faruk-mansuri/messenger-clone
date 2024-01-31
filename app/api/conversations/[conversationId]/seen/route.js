import { getCurrentUser } from '@/app/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export const POST = async (req, { params }) => {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { include: { seen: true } }, users: true },
    });

    if (!conversation) {
      return new NextResponse('Invalid ConversationId', { status: 400 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // update seen of last message
    const updatedMessage = await prisma.message.update({
      where: { id: lastMessage.id },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: { id: currentUser.id },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationId,
      'message:update',
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.log('SEEN_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
