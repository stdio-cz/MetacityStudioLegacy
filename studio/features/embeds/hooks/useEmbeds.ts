import { useQuery } from "@core/hooks/useQuery";
import { useCallback } from "react";
import getEmbeds from "../queries/getEmbeds";

export default function useEmbeds(projectId: number) {
  const queryFn = useCallback(() => getEmbeds(projectId), [projectId]);

  const { data, isLoading, refetch } = useQuery({
    queryFn,
    defaultValue: [],
  });

  // New: Rename embed
  const renameEmbed = useCallback(
    async (embedId: number, name: string) => {
      const res = await fetch(`/api/embeds/${embedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to rename embed");
      await refetch();
    },
    [refetch],
  );

  // New: Delete embed
  const deleteEmbed = useCallback(
    async (embedId: number) => {
      const res = await fetch(`/api/embeds/${embedId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete embed");
      await refetch();
    },
    [refetch],
  );

  return { embeds: data, isLoading, refetch, renameEmbed, deleteEmbed };
}
