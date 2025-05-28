import UserInfo from "app/components/dashboard/UserInfo";
import ProjectList from "app/components/dashboard/ProjectList";
import { getUser, getProjects } from "lib/dal";

export default async function DashboardPage() {
  const [user, projects] = await Promise.all([getUser(), getProjects()]);

  if (typeof projects === "number" || typeof user === "number") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{"Error"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserInfo user={user} />
      <ProjectList projects={projects} />
    </>
  );
}
