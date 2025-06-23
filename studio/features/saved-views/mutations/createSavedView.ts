import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { SavedView } from "@features/db/entities/savedView";

type CreateSavedViewData = {
  name: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  projectionType: ProjectionType;
  fovYRadian: number;
  orthographicLeft: number;
  orthographicRight: number;
  orthographicBottom: number;
  orthographicTop: number;
  projectId: number;
};

export async function createSavedView(data: CreateSavedViewData): Promise<SavedView> {
  const response = await fetch("/api/savedViews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create saved view: ${response.statusText}`);
  }

  return response.json();
}
