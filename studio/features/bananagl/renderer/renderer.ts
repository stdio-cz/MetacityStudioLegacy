import { Window } from "../window/window";

export class Renderer {
  private context?: WebGL2RenderingContext;
  private window_?: Window;
  private onInitCallbacks: (() => void)[] = [];
  //private needsRedraw_ = false;

  constructor(canvas?: HTMLCanvasElement, options?: WebGLContextAttributes) {
    if (canvas) this.init(canvas, options);
  }

  init(canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
    if (this.context || this.window_) return;

    //init with highest performance settings
    const gl = canvas.getContext("webgl2", {
      antialias: options?.antialias ?? true,
      alpha: options?.alpha ?? false,
      depth: options?.depth ?? true,
      stencil: options?.stencil ?? false,
      powerPreference: options?.powerPreference ?? "high-performance",
      premultipliedAlpha: options?.premultipliedAlpha ?? false,
      preserveDrawingBuffer: options?.preserveDrawingBuffer ?? false,
      failIfMajorPerformanceCaveat:
        options?.failIfMajorPerformanceCaveat ?? false,
    });

    if (!gl) throw new Error("WebGL2 not supported");

    this.context = gl;
    this.window_ = new Window(canvas);

    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.onInitCallbacks.forEach((callback) => callback());
    this.onInitCallbacks = [];
  }

  set onInit(callback: () => void) {
    if (this.context) callback();
    else this.onInitCallbacks.push(callback);
  }

  get gl() {
    if (!this.context) throw new Error("Renderer not initialized");
    return this.context;
  }

  get views() {
    //if (!this.window_) throw new Error("Renderer not initialized");
    if (!this.window_) return undefined;
    return this.window_.views;
  }

  get window() {
    if (!this.window_) throw new Error("Renderer not initialized");
    return this.window_;
  }

  get controls() {
    return this.window_?.controls;
  }

  set clearColor(color: [number, number, number, number]) {
    if (!this.context) throw new Error("Renderer not initialized");
    this.context.clearColor(color[0], color[1], color[2], color[3]);
  }

  render() {
    this.window.render(this);
  }

  dispose() {
    this.window.dispose();
    this.context = undefined;
    this.window_ = undefined;
  }

  public frameTimeLog = new Array(60).fill(0);
  public running = false;
  private frameTimeIndex = 0;
  private lastFrameTime = 0;

  animationLoop() {
    //if (!this.needsRedraw_) return;
    if (!this.context) return;

    this.running = true;
    this.render();

    this.afterRenderCallbacks.forEach((callback) => callback());
    this.afterRenderCallbacks = [];

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.frameTimeLog[this.frameTimeIndex] = frameTime;
    this.frameTimeIndex = (this.frameTimeIndex + 1) % this.frameTimeLog.length;

    //TODO add handling of needs redraw from outside
    //this.needsRedraw_ = false;
    requestAnimationFrame(() => this.animationLoop());
  }

  private afterRenderCallbacks: (() => void)[] = [];

  set afterRenderOnce(callback: () => void) {
    this.afterRenderCallbacks.push(callback);
  }

  //set needsRedraw(value: boolean) {
  //  this.needsRedraw_ = this.needsRedraw_ || value;
  //}
}
