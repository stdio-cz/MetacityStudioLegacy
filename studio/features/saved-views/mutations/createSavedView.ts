import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import type { ViewState } from "@features/bananagl/window/viewState";
import { SavedView } from "@features/db/entities/savedView";

type CreateSavedViewData = {
  name: string;
  projectId: number;
  // Legacy fields for backward compatibility
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  projectionType?: ProjectionType;
  fovYRadian?: number;
  orthographicZoomFactor?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  // New serialized view state
  viewState?: ViewState;
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
