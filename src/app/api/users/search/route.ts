import { NextResponse } from "next/server";
import { db } from "lib/db";
import { verifySession } from "lib/dal";

export async function GET(request: Request) {
  try {
    const { isAuthorized } = await verifySession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const projectId = searchParams.get("projectId");

    if (!query || !projectId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get current project members to exclude them from results
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const memberIds = new Set([
      project.ownerId,
      ...project.members.map((m) => m.userId),
    ]);

    // Search for users by email, excluding current members
    const users = await db.user.findMany({
      where: {
        email: {
          contains: query,
          // mode: "insensitive",
        },
        id: {
          notIn: Array.from(memberIds),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
      take: 5,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
