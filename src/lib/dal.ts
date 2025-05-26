import 'server-only';
//DATA ACCESS LAYER - Implementation for a more secure application
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { db } from 'lib/db';
import { Project, Task, User } from '@prisma/client';
import { createTaskInput } from 'app/api/task/route';
import { UpdateTaskInput } from 'app/api/task/[id]/route';

type sessionReturnType = {
  isAuthorized: boolean
  userId: string
}
export enum ERROR_TYPES {
  NOT_FOUND = -40,
  NOT_CREATED = -10,
  NOT_AUTHORIZED = -20
}

type ProjectWithTasks = Project & {
  tasks: Task[]
}

export const verifySession = cache(async (): Promise<sessionReturnType > => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token) {
    redirect('/login');
  }
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
  );
  const { payload } = await jwtVerify(token.value, secret);

  return { isAuthorized: !!payload?.userId, userId: payload.userId as string}
});

export const getProject = cache(async(projectId: string): Promise<ProjectWithTasks | ERROR_TYPES> => {
  const { isAuthorized, userId } = await verifySession();
  if(!isAuthorized  || !userId) return ERROR_TYPES.NOT_AUTHORIZED;
  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!project) return ERROR_TYPES.NOT_FOUND;
    return project;
  }
  catch (error) {
    console.log('Failed to fetch project', error);
    return ERROR_TYPES.NOT_FOUND;
  }
});

export const createTask = async (task: createTaskInput): Promise<Task | ERROR_TYPES> => {
  const { isAuthorized, userId } = await verifySession();
  if(!isAuthorized || !userId) return ERROR_TYPES.NOT_AUTHORIZED

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


export const updateTask = async (taskId: string, data: UpdateTaskInput): Promise<Task | ERROR_TYPES> => {
  const { isAuthorized, userId } = await verifySession();
  if(!isAuthorized || !userId) return ERROR_TYPES.NOT_AUTHORIZED;

  try {
    // First verify the task exists and belongs to a project owned by the user
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: userId
        }
      }
    });

    if (!task) return ERROR_TYPES.NOT_FOUND;

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data
    });

    return updatedTask;
  } catch (e) {
    console.log('Failed to update task', e);
    return ERROR_TYPES.NOT_FOUND;
  }
}

export const getUser = async (): Promise<User | ERROR_TYPES> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
  );

  if (token) {
    const { payload } = await jwtVerify(token.value, secret);
  
    if(!payload.userId) return ERROR_TYPES.NOT_AUTHORIZED;
    try {
      const user = await db.user.findUnique({
        where: {
          id: payload.userId as string
        }
      });
  
      if (!user) return ERROR_TYPES.NOT_FOUND;
      return user;
    }
    catch(e) {
      console.error('Failed to get User', e);
      return ERROR_TYPES.NOT_FOUND;
    }
  }

  return ERROR_TYPES.NOT_FOUND;
}