"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjectPageData(projectId: string) {
  try {
    // Revalidate the entire project route including all nested paths
    revalidatePath(`/projects/${projectId}`);
  } catch (e) {
    console.error("Error revalidating projects data", e);
    return { success: false };
  }

  return { success: true };
}

export async function revalidateRootLayout() {
  try {
    // Revalidate the root layout which contains the user data
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("Error revalidating root layout", e);
    return { success: false };
  }

  return { success: true };
}
