import { getProject } from 'lib/dal';
import Link from 'next/link';
import AddTaskButton from 'app/components/AddTaskButton';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{'Project not found'}</p>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (typeof project === "number") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="mt-2 text-sm text-gray-600">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <AddTaskButton projectId={project.id} />
          </div>
          {project.description && (
            <p className="mt-4 text-gray-600">{project.description}</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 