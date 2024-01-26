import bcrypt from 'bcrypt';

import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const body = await req.json();
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return new NextResponse('Missing Info', { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const isUserAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserAlreadyExists) {
      return new NextResponse('Email is already taken', { status: 400 });
    }

    const user = await prisma.user.create({
      data: { name, email, hashedPassword },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.log('[REGISTRATION_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
