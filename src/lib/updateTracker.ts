// src/lib/updateTracker.ts
// This will persist across requests in the same server instance
const projectUpdateTracker = new Map<string, Date>();

export const updateTracker = {
  setLastUpdate: (projectId: string, date: Date) => {
    projectUpdateTracker.set(projectId, date);
  },

  removeLastUpdate: (projectId: string) => {
    projectUpdateTracker.delete(projectId);
  },

  getLastUpdate: (projectId: string) => {
    return projectUpdateTracker.get(projectId);
  },

  hasUpdate: (projectId: string) => {
    return projectUpdateTracker.has(projectId);
  },
};
