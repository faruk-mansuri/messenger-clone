import { getCurrentUser } from '@/app/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, image } = body;

    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log('[SETTINGS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
