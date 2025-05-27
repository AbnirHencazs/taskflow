"use client";

import { Task } from "@prisma/client";
import DraggableTaskCard from "./DraggableTaskCard";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import TaskCard from "app/components/TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface KanbanBoardProps {
  tasks: Task[];
}

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

function DroppableColumn({
  id,
  title,
  children,
}: {
  id: ColumnId;
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg p-3 sm:p-4 min-h-[300px] sm:min-h-[500px]"
    >
      <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
        {title}
      </h3>
      <div className="space-y-3 sm:space-y-4">{children}</div>
    </div>
  );
}

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const tasksByStatus = localTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetColumnId = over.id as ColumnId;

    // Optimistically update the UI
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: targetColumnId } : task
      )
    );

    try {
      // Call the API to update the task status
      const response = await fetch(`/api/task/${taskId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: targetColumnId }),
      });

      if (!response.ok) {
        // If the API call fails, revert the optimistic update
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, status: activeTask?.status || "TODO" }
              : task
          )
        );
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      // The UI will be reverted to its previous state
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {COLUMNS.map((column) => (
          <DroppableColumn key={column.id} id={column.id} title={column.title}>
            {tasksByStatus[column.id]?.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
            {(!tasksByStatus[column.id] ||
              tasksByStatus[column.id].length === 0) && (
              <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
                No tasks
              </div>
            )}
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
