import { NextResponse } from "next/server";
import { z } from "zod";
import { getProjects, createProject } from "lib/dal";
import { ERROR_TYPES } from "lib/constants";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const projects = await getProjects();

    if (projects === ERROR_TYPES.NOT_AUTHORIZED) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (projects === ERROR_TYPES.NOT_FOUND) {
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 404 }
      );
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await createProject(validatedData);

    if (project === ERROR_TYPES.NOT_AUTHORIZED) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (project === ERROR_TYPES.NOT_CREATED) {
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

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
