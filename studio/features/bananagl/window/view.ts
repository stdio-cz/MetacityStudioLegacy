import { vec2 } from "gl-matrix";

import { Camera } from "@bananagl/camera/camera";
import { CameraLock } from "@bananagl/camera/cameraLock";
import { Scene } from "@bananagl/scene/scene";

import { viewRenderPass } from "../renderer/pass";
import { Renderer } from "../renderer/renderer";
import { ViewState } from "./viewState";

export class View {
  x: number = 0;
  y: number = 0;
  private width_: number = 0;
  private height_: number = 0;
  readonly camera: Camera = new Camera();
  readonly cameraLock = new CameraLock(this.camera);

  constructor(readonly scene: Scene) {}

  resize(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width_ = width;
    this.height_ = height;
    this.camera.updateAspectRatio(width, height);
  }

  /**
   * Adjust the view for canvas size changes while preserving the current view state
   * This is useful when the canvas is resized after a view has been loaded
   * @param savedViewState The original saved view state to reference for rescaling
   */
  adjustForCanvasSize(savedViewState: ViewState): void {
    const canvasSizeChanged =
      savedViewState.canvasDimensions.width !== this.width_ || savedViewState.canvasDimensions.height !== this.height_;

    if (!canvasSizeChanged) {
      return; // No adjustment needed
    }

    // Update camera aspect ratio
    this.camera.updateAspectRatio(this.width_, this.height_);

    // Adjust orthographic bounds if applicable
    if (savedViewState.camera.orthographicBounds && this.camera.projectionType === "ORTHOGRAPHIC") {
      const { left, right, bottom, top } = savedViewState.camera.orthographicBounds;
      this.camera.setOrthographicBoundsWithRescale(
        left,
        right,
        bottom,
        top,
        savedViewState.canvasDimensions.width,
        savedViewState.canvasDimensions.height,
      );
    }

    // Update matrices
    this.camera.updateProjectionViewMatrix();
  }

  render(renderer: Renderer) {
    const gl = renderer.gl;
    gl.viewport(this.x, this.y, this.width, this.height);
    gl.scissor(this.x, this.y, this.width, this.height);
    viewRenderPass(this.scene, renderer, this.camera);
  }

  toLocal(x: number, y: number): vec2 {
    return [x - this.x, y - this.y];
  }

  toLocalPerct(x: number, y: number): vec2 {
    return [
      ((x - this.x) / this.width_) * window.devicePixelRatio,
      ((y - this.y) / this.height_) * window.devicePixelRatio,
    ];
  }

  get width() {
    return this.width_;
  }

  get height() {
    return this.height_;
  }

  toNDC(x: number, y: number): vec2 {
    const invDpr = 1 / window.devicePixelRatio;
    return [
      ((x - this.x * invDpr) / (this.width_ * invDpr)) * 2 - 1,
      -((y - this.y * invDpr) / (this.height_ * invDpr)) * 2 + 1,
    ];
  }

  /**
   * Serialize the current view state including camera and camera lock properties
   */
  serialize(): ViewState {
    const cameraState: ViewState["camera"] = {
      position: [this.camera.position[0], this.camera.position[1], this.camera.position[2]] as [number, number, number],
      target: [this.camera.target[0], this.camera.target[1], this.camera.target[2]] as [number, number, number],
      up: [this.camera.upVector[0], this.camera.upVector[1], this.camera.upVector[2]] as [number, number, number],
      right: [this.camera.rightVector[0], this.camera.rightVector[1], this.camera.rightVector[2]] as [
        number,
        number,
        number,
      ],
      projectionType: this.camera.projectionType,
      fovYRadian: this.camera.fovYRadian,
      aspectRatio: this.camera.aspectRatio,
      near: this.camera.near,
      far: this.camera.far,
    };

    // Add orthographic-specific properties
    if (this.camera.projectionType === "ORTHOGRAPHIC") {
      cameraState.orthographicBounds = {
        left: this.camera.orthographicLeft,
        right: this.camera.orthographicRight,
        bottom: this.camera.orthographicBottom,
        top: this.camera.orthographicTop,
      };
      cameraState.orthographicZoomFactor = this.camera.getOrthographicZoomFactor();
    }

    return {
      x: this.x,
      y: this.y,
      width: this.width_,
      height: this.height_,
      camera: cameraState,
      cameraLock: {
        mode: this.cameraLock.mode,
        coords: [...this.cameraLock.coords] as [number, number],
      },
      canvasDimensions: {
        width: this.width_,
        height: this.height_,
      },
    };
  }

  /**
   * Restore view state from serialized data
   * @param state The serialized view state to restore
   * @param currentCanvasWidth Optional current canvas width (if not provided, uses current view width)
   * @param currentCanvasHeight Optional current canvas height (if not provided, uses current view height)
   */
  deserialize(state: ViewState, currentCanvasWidth?: number, currentCanvasHeight?: number): void {
    const targetWidth = currentCanvasWidth ?? this.width_;
    const targetHeight = currentCanvasHeight ?? this.height_;
    const canvasSizeChanged =
      state.canvasDimensions.width !== targetWidth || state.canvasDimensions.height !== targetHeight;

    this.x = state.x;
    this.y = state.y;
    // Don't overwrite current width/height - preserve current canvas size

    // --- FIX: Set projection type first if it differs ---
    if (this.camera.projectionType !== state.camera.projectionType) {
      this.camera.projectionType = state.camera.projectionType;
    }

    // Now set the rest of the camera state
    this.camera.set({
      position: state.camera.position,
      target: state.camera.target,
      up: state.camera.up,
      right: state.camera.right,
      // projectionType: state.camera.projectionType, // already set above
      fovYRadian: state.camera.fovYRadian,
      near: state.camera.near,
      far: state.camera.far,
    });

    if (canvasSizeChanged) {
      this.camera.updateAspectRatio(targetWidth, targetHeight);
    }

    if (state.camera.orthographicBounds && state.camera.projectionType === "ORTHOGRAPHIC") {
      const { left, right, bottom, top } = state.camera.orthographicBounds;
      if (canvasSizeChanged) {
        this.camera.setOrthographicBoundsWithRescale(
          left,
          right,
          bottom,
          top,
          state.canvasDimensions.width,
          state.canvasDimensions.height,
        );
      } else {
        this.camera.setOrthographicBounds(left, right, bottom, top);
      }
    }

    this.cameraLock.mode = state.cameraLock.mode;
    this.cameraLock.coords[0] = state.cameraLock.coords[0];
    this.cameraLock.coords[1] = state.cameraLock.coords[1];
    this.camera.updateProjectionViewMatrix();
  }
}
