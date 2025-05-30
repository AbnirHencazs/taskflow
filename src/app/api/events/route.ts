// src/app/api/events/route.ts
import { getProject } from "lib/dal";
import { updateTracker } from "lib/updateTracker";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId)
    return NextResponse.json({ error: "No Project ID" }, { status: 400 });
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode("event: connected\ndata:{helloWorld: 'helloworld'}\n\n")
      );

      // Set up interval to check for updates
      const interval = setInterval(async () => {
        // try {
        //   const hasUpdate = updateTracker.hasUpdate(projectId);
        //   if (hasUpdate) {
        //     const project = await getProject(projectId);
        //     if (project && typeof project !== "number") {
        //       controller.enqueue(
        //         encoder.encode(`data: ${JSON.stringify(project.tasks)}\n\n`)
        //       );
        //       updateTracker.removeLastUpdate(projectId);
        //     }
        //   }
        // } catch (e) {
        //   console.error("Error in SSE:", e);
        // }
        try {
          // Get the last known update time for this project
          const lastUpdate = updateTracker.getLastUpdate(projectId);

          // Fetch current project data
          const project = await getProject(projectId);

          if (project && typeof project !== "number") {
            // Get the most recent updatedAt date from all tasks
            const mostRecentTaskUpdate = project.tasks.reduce(
              (latest, task) => {
                const taskUpdate = new Date(task.updatedAt);
                return taskUpdate > latest ? taskUpdate : latest;
              },
              new Date(0)
            ); // Start with epoch time as initial value

            // console.log(lastUpdate, mostRecentTaskUpdate);
            // If we have a last update and it's different from current
            // if (lastUpdate && mostRecentTaskUpdate > lastUpdate) {
            controller.enqueue(
              encoder.encode(
                `event: taskUpdated\ndata: ${JSON.stringify(project.tasks)}\n\n`
              )
            );
            // Update the tracker with the new timestamp
            // updateTracker.setLastUpdate(projectId, mostRecentTaskUpdate);
            // }
            // If we don't have a last update yet, set it
            // else if (!lastUpdate) {
            //   updateTracker.setLastUpdate(projectId, mostRecentTaskUpdate);
            // }
          }
        } catch (error) {
          console.error("Error in SSE:", error);
        }
      }, 2500); // Check every second

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
