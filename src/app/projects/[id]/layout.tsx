import { getProject } from "lib/dal";
import Link from "next/link";
import AddTaskButton from "app/components/AddTaskButton";
import ViewSwitcher from "app/components/ViewSwitcher";
import { TeamMemberSearch } from "app/components/TeamMemberSearch";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project || typeof project === "number") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Error
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            {"Project not found"}
          </p>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-500 text-sm sm:text-base"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          {/* Project Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <TeamMemberSearch projectId={project.id} />
              <AddTaskButton projectId={project.id} />
            </div>
          </div>

          {/* Project Description */}
          {project.description && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
              {project.description}
            </p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-3 sm:px-4 py-4 sm:py-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                Tasks
              </h2>
              <ViewSwitcher />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
