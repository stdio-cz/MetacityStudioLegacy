import * as GL from "@bananagl/bananagl";
import { EditorModel } from "@editor/data/EditorModel";
import { Metadata, Style } from "@editor/data/types";
import { vec3 } from "gl-matrix";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export type SelectFunction = (
  selection: SelectionType,
  toggle?: boolean,
  extend?: boolean,
) => void;
export type SelectionType = Map<EditorModel, Set<number>>;
export type Tooltip = { data: any; x: number; y: number } | null;

type EditorContextProps = {
  scene: GL.Scene;
  renderer: GL.Renderer;
  activeView: number;
  models: EditorModel[];
  setModels: Dispatch<SetStateAction<EditorModel[]>>;
  selection: SelectionType;
  setSelection: Dispatch<SetStateAction<SelectionType>>;
  tooltip: Tooltip | null;
  setTooltip: Dispatch<SetStateAction<Tooltip | null>>;
  camTargetZ: number;
  setCamTargetZ: Dispatch<SetStateAction<number>>;
  minShade: number;
  setMinShade: Dispatch<SetStateAction<number>>;
  maxShade: number;
  setMaxShade: Dispatch<SetStateAction<number>>;
  gridVisible: boolean;
  setGridVisible: Dispatch<SetStateAction<boolean>>;
  globalShift: vec3 | null;
  setGlobalShift: Dispatch<SetStateAction<vec3 | null>>;
  metadata: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
  styles: Style;
  setStyles: Dispatch<SetStateAction<Style>>;
  usedStyle: string[] | null;
  setUsedStyle: Dispatch<SetStateAction<string[] | null>>;
  lastUsedStyle: string[] | null;
  setLastUsedStyle: Dispatch<SetStateAction<string[] | null>>;
  greyscale: boolean;
  setGreyscale: Dispatch<SetStateAction<boolean>>;
  darkmode: boolean;
  setDarkmode: Dispatch<SetStateAction<boolean>>;
};

export const context = createContext<EditorContextProps>(
  {} as EditorContextProps,
);

export function EditorProvider(props: { children: ReactNode }) {
  const [renderer] = useState(new GL.Renderer());
  const [scene] = useState(new GL.Scene());
  const [models, setModels] = useState<EditorModel[]>([]);
  const [selection, setSelection] = useState<SelectionType>(new Map());
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [camTargetZ, setCamTargetZ] = useState<number>(0);
  const [minShade, setMinShade] = useState<number>(0);
  const [maxShade, setMaxShade] = useState<number>(10);
  const [gridVisible, setGridVisible] = useState<boolean>(false);
  const [globalShift, setGlobalShift] = useState<vec3 | null>(null);
  const [metadata, setMetadata] = useState<Metadata>({});
  const [styles, setStyles] = useState<Style>({});
  const [lastUsedStyle, setLastUsedStyle] = useState<string[] | null>(null);
  const [usedStyle, setUsedStyle] = useState<string[] | null>(null);
  const [greyscale, setGreyscale] = useState<boolean>(false);

  //TODO darkmode load from user device settings
  const sd = localStorage.getItem("darkmode");
  const [darkmode, setDarkmode] = useState<boolean>(
    true, //sd === "true" ? true : false,
  );

  const activeView = 0;

  useEffect(() => {
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (const model of models) {
      const bbox = model.boundingBox;
      minZ = Math.min(minZ, bbox.min[2]);
      maxZ = Math.max(maxZ, bbox.max[2]);
    }
    setMinShade(minZ);
    setMaxShade(maxZ);
    if (isFinite(minZ)) setCamTargetZ(minZ);
  }, [models]);

  useEffect(() => {
    models.forEach((object) => {
      if (object instanceof EditorModel) {
        object.uniforms = {
          uZMin: minShade,
        };
      }
    });
  }, [minShade, models]);

  useEffect(() => {
    models.forEach((object) => {
      if (object instanceof EditorModel) {
        object.uniforms = {
          uZMax: maxShade,
        };
      }
    });
  }, [maxShade, models]);

  useEffect(() => {
    console.log("models", models);
  }, [models]);

  useEffect(() => {
    const view = renderer.views?.[activeView].view;
    if (!view) return;
    view.camera.z = camTargetZ;
  }, [activeView, renderer.views, camTargetZ]);

  useEffect(() => {
    if (darkmode) {
      renderer.clearColor = [0.1, 0.1, 0.1, 1];
      document.documentElement.style.setProperty("color-scheme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkmode", "true");
    } else {
      renderer.clearColor = [1, 1, 1, 1];
      document.documentElement.style.setProperty("color-scheme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkmode", "false");
    }
  }, [darkmode, renderer]);

  return (
    <context.Provider
      value={{
        scene,
        renderer,
        activeView: activeView,
        models,
        setModels,
        selection,
        setSelection,
        tooltip,
        setTooltip,
        camTargetZ,
        setCamTargetZ,
        minShade,
        setMinShade,
        maxShade,
        setMaxShade,
        gridVisible,
        setGridVisible,
        globalShift,
        setGlobalShift,
        metadata,
        setMetadata,
        styles,
        setStyles,
        usedStyle,
        setUsedStyle,
        lastUsedStyle,
        setLastUsedStyle,
        greyscale: greyscale,
        setGreyscale: setGreyscale,
        darkmode,
        setDarkmode,
      }}
    >
      {props.children}
    </context.Provider>
  );
}