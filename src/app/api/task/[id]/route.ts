import { NextResponse } from "next/server";
import { z } from "zod";
import { updateTask, deleteTask } from "lib/dal";

const updateTaskValidationSchema = z.object({
  title: z
    .string()
    .min(2, "Task title is required")
    .max(32, "Title must be no longer than 32 characters"),
  description: z
    .string()
    .max(256, "Description must be no longer than 256 characters")
    .optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export type UpdateTaskInput = z.infer<typeof updateTaskValidationSchema>;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const validatedData = updateTaskValidationSchema.parse(body);

    const result = await updateTask(id, validatedData);

    if (typeof result === "number") {
      return NextResponse.json(
        { message: "Failed to update task" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteTask(params.id);

    if (typeof result === "number") {
      return NextResponse.json(
        { message: "Failed to delete task" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
