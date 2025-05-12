import 'server-only';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { db } from './db';


export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token) {
    redirect('/login');
  }
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
  );
  const { payload } = await jwtVerify(token.value, secret);


  return { isAuthorized: !!payload?.userId, userId: payload?.userId }
});

export const getProject = cache(async(projectId: string) => {
  const { isAuthorized, userId } = await verifySession();
  if(!isAuthorized) return null;
  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId as string,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return project;
  }
  catch (error) {
    console.log('Failed to fetch project', error);
    return null
  }
});