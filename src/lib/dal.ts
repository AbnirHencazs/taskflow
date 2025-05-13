import 'server-only';
//DATA ACCESS LAYER - Implementation for a more secure application
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { db } from './db';
import { Task } from '@prisma/client';


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

export const createTask = async (task: any) => {
  enum ERROR_TYPES {
    NOT_CREATED = -10,
    NOT_AUTHORIZED = -20
  }
  const { isAuthorized, userId } = await verifySession();
  if(!isAuthorized) return ERROR_TYPES.NOT_AUTHORIZED

  try {
    const taskCreated = await db.task.create({
      data: {
        ...task,
        creatorId: userId
      }
    });

    return taskCreated
  }
  catch (e) {
    console.log('Failed to create task', e);
    return ERROR_TYPES.NOT_CREATED
  }
}