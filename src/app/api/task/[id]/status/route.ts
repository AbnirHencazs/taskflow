import { NextResponse } from "next/server";
import { z } from "zod";
import { updateTaskStatus } from "lib/dal";

const VALID_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

const updateTaskStatusSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTaskStatusSchema.parse(body);

    const result = await updateTaskStatus(id, validatedData.status);

    if (typeof result === "number") {
      return NextResponse.json(
        { message: "Failed to update task status" },
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
