"use client";

import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Your Projects</h2>
        <button
          onClick={() => router.push("/projects/create")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You haven&apos;t created any projects yet.
          </p>
          <button
            onClick={() => router.push("/projects/create")}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <h3 className="font-medium text-lg mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {project.description}
                </p>
              )}
              <div className="text-xs text-gray-500">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
