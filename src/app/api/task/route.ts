import { createTask } from 'lib/dal';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createTaskValidationSchema = z.object({
  title: z.string().min(2, 'Task title is required').max(32, 'Title must be no longer than 32 characters'),
  description: z.string().max(256, 'Description must be no longer than 256 characters').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    errorMap: () => ({ message: 'Status must be either TODO, IN_PROGRESS, or DONE' })
  }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Priority must be either LOW, MEDIUM, or HIGH' })
  }).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  estimatedTime: z.number().int().min(0, 'Estimated time must be a positive number').optional(),
  order: z.number().int().min(0, 'Order must be a positive number').default(0),
  projectId: z.string().min(1, 'Project ID is required'),
});

export type createTaskValidationSchema = z.infer<typeof createTaskValidationSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
  
    const validatedData = createTaskValidationSchema.parse({...body, projectId});

    const createdTask = await createTask(validatedData);

    return NextResponse.json(
      { createdTask },
      { status: 201 }
    )
  }
  catch (e) {
    console.error('Error creating task:', e)

    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body data', details: e.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error', details: e },
      { status: 500 }
    )
  }
}