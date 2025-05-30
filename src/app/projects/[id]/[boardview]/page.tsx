import { getProject } from "lib/dal";
import TaskCard from "app/components/TaskCard";
import KanbanBoard from "app/components/KanbanBoard";

export default async function BoardViewPage({
  params,
}: {
  params: Promise<{ id: string; boardview: string }>;
}) {
  const { id, boardview } = await params;
  const project = await getProject(id);

  if (!project || typeof project === "number") {
    return null;
  }

  if (project.tasks.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks yet. Create your first task!</p>
        </div>
      </div>
    );
  }

  // Handle different board views
  switch (boardview) {
    case "list":
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 max-w-4xl mx-auto">
            {project.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      );
    case "kanban":
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <KanbanBoard tasks={project.tasks} projectId={id} />
        </div>
      );
    case "calendar":
      // TODO: Implement Calendar view
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Calendar view coming soon!</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Invalid view type</p>
          </div>
        </div>
      );
  }
}
