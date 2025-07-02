import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { SavedView } from "@features/db/entities/savedView";

type UpdateSavedViewData = {
  name?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  projectionType?: ProjectionType;
  fovYRadian?: number;
  orthographicZoomFactor?: number;
  canvasWidth?: number;
  canvasHeight?: number;
};

export async function updateSavedView(id: number, data: UpdateSavedViewData): Promise<SavedView> {
  const response = await fetch(`/api/savedViews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update saved view: ${response.statusText}`);
  }

  return response.json();
}
