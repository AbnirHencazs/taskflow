"use client";

import { usePathname, useRouter } from "next/navigation";

const VIEWS = [
  { id: "list", label: "List", icon: "📋" },
  { id: "kanban", label: "Board", icon: "📊" },
  { id: "calendar", label: "Calendar", icon: "📅" },
] as const;

export default function ViewSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentView = pathname.split("/").pop() || "list";

  const handleViewChange = (viewId: string) => {
    const newPath = pathname.replace(/\/[^/]+$/, `/${viewId}`);
    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          onClick={() => handleViewChange(view.id)}
          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
            currentView === view.id
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>{view.icon}</span>
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}
