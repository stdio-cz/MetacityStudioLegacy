import { ProjectionType } from "@bananagl/camera/cameraInterface";
import { CameraView } from "@bananagl/camera/cameraView";

/**
 * Serializable state of a view including camera and camera lock properties
 */
export interface ViewState {
  // View properties
  x: number;
  y: number;
  width: number;
  height: number;

  // Camera properties
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    up: [number, number, number];
    right: [number, number, number];
    projectionType: ProjectionType;
    fovYRadian: number;
    aspectRatio: number;
    near: number;
    far: number;
    // Orthographic specific properties
    orthographicBounds?: {
      left: number;
      right: number;
      bottom: number;
      top: number;
    };
    orthographicZoomFactor?: number;
  };

  // Camera lock properties
  cameraLock: {
    mode: CameraView;
    coords: [number, number];
  };

  // Canvas dimensions when saved (for rescaling)
  canvasDimensions: {
    width: number;
    height: number;
  };
}
