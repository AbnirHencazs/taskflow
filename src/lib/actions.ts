"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjectPageData(projectId: string) {
    revalidatePath(`projects/${projectId}`);

    return { success: true }
}