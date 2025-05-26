"use client";

import { useState } from "react";
import TaskModal from "app/components/TaskModal";
import { Task } from "@prisma/client";

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  // Format date in a consistent way that doesn't depend on locale
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.status === "DONE"
                ? "bg-green-100 text-green-800"
                : task.status === "IN_PROGRESS"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Created on {formatDate(task.createdAt)}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
      />
    </>
  );
}
