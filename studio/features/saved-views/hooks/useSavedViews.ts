import { SavedView } from "@features/db/entities/savedView";
import { useCallback, useState } from "react";
import { createSavedView } from "../mutations/createSavedView";
import { deleteSavedView } from "../mutations/deleteSavedView";
import { updateSavedView } from "../mutations/updateSavedView";
import { getSavedViews } from "../queries/getSavedViews";

export function useSavedViews(projectId: number) {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedViews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const views = await getSavedViews(projectId);
      setSavedViews(views);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch saved views");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createView = useCallback(
    async (name: string, cameraPosition: [number, number, number], cameraTarget: [number, number, number]) => {
      try {
        setError(null);
        const newView = await createSavedView({
          name,
          cameraPosition,
          cameraTarget,
          projectId,
        });
        setSavedViews((prev) => [newView, ...prev]);
        return newView;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create saved view");
        throw err;
      }
    },
    [projectId],
  );

  const updateView = useCallback(
    async (
      id: number,
      data: { name?: string; cameraPosition?: [number, number, number]; cameraTarget?: [number, number, number] },
    ) => {
      try {
        setError(null);
        const updatedView = await updateSavedView(id, data);
        setSavedViews((prev) => prev.map((view) => (view.id === id ? updatedView : view)));
        return updatedView;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update saved view");
        throw err;
      }
    },
    [],
  );

  const deleteView = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteSavedView(id);
      setSavedViews((prev) => prev.filter((view) => view.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete saved view");
      throw err;
    }
  }, []);

  return {
    savedViews,
    loading,
    error,
    fetchSavedViews,
    createView,
    updateView,
    deleteView,
  };
}
