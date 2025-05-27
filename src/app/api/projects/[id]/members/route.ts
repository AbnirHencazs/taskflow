import { NextResponse } from "next/server";
import { db } from "lib/db";
import { verifySession } from "lib/dal";
import { z } from "zod";

const addMemberSchema = z.object({
  userId: z.string(),
  role: z.string().default("MEMBER"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAuthorized, userId } = await verifySession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify project ownership
    const { id } = await params;
    const project = await db.project.findUnique({
      where: { id: id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json(
        { error: "Only project owner can add members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId: newMemberId, role } = addMemberSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: newMemberId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add member to project
    const member = await db.projectMember.create({
      data: {
        userId: newMemberId,
        projectId: id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Error adding team member:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
