import { SavedView } from "@features/db/entities/savedView";

export async function getSavedViews(projectId: number): Promise<SavedView[]> {
  const response = await fetch(`/api/savedViews?projectId=${projectId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch saved views: ${response.statusText}`);
  }

  return response.json();
}
