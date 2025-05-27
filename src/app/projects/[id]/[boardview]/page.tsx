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
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  // Handle different board views
  switch (boardview) {
    case "list":
      return (
        <div className="space-y-4">
          {project.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      );
    case "kanban":
      return <KanbanBoard tasks={project.tasks} />;
    case "calendar":
      // TODO: Implement Calendar view
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Calendar view coming soon!</p>
        </div>
      );
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Invalid view type</p>
        </div>
      );
  }
}
