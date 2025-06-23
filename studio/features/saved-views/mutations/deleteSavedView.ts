export async function deleteSavedView(id: number): Promise<void> {
  const response = await fetch(`/api/savedViews/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete saved view: ${response.statusText}`);
  }
}
