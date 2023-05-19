import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@utils/models/models/EditorModel';

import * as GL from '@bananagl/bananagl';

export const EditorContext = React.createContext<{
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    scene: GL.Scene;
    renderer: GL.Renderer;
    selection: GL.SelectionManager;
    activeView: number;
    models: EditorModel[];
    setModels: React.Dispatch<React.SetStateAction<EditorModel[]>>;
    selectedModel: EditorModel | null;
    selectModel: (model: EditorModel | null) => void;
    camTargetZ: number;
    setCamTargetZ: React.Dispatch<React.SetStateAction<number>>;
    minShade: number;
    setMinShade: React.Dispatch<React.SetStateAction<number>>;
    maxShade: number;
    setMaxShade: React.Dispatch<React.SetStateAction<number>>;
    gridVisible: boolean;
    setGridVisible: React.Dispatch<React.SetStateAction<boolean>>;
    globalShift: vec3 | null;
    setGlobalShift: React.Dispatch<React.SetStateAction<vec3 | null>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    selectedSubmodels: number[];
    setSelectedSubmodels: React.Dispatch<React.SetStateAction<number[]>>;
} | null>(null);

export function ContextComponent(props: { children: React.ReactNode }) {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());
    const [processing, setProcessing] = React.useState(false);
    const [selection, setSelection] = React.useState(new GL.SelectionManager());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);
    const [selectedSubmodels, setSelectedSubmodels] = React.useState<number[]>([]);

    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(true);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);
    const [loadingStatus, setLoadingStatus] = React.useState<string>('');

    const selectModel = (model: EditorModel | null) => {
        setSelectedModel((prev) => {
            if (prev !== null && prev !== model) prev.selected = false;
            if (model !== null && prev !== model) model.selected = true;
            if (model === null || prev !== model) selection.clearSelection();
            return model;
        });
    };

    React.useEffect(() => {
        const onChange = () => {
            setSelectedSubmodels(selection.selected.map((obj) => obj.identifier));
        };

        selection.onSelect = onChange;

        return () => {
            selection.removeOnSelect(onChange);
        };
    }, [selection, setSelectedSubmodels]);

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);
            if (selectedModel !== null && !copy.includes(selectedModel)) setSelectedModel(null);
        };

        scene.onChange = onChange;

        return () => {
            scene.removeChange = onChange;
        };
    }, [scene, selectedModel]);

    React.useEffect(() => {
        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.onPick = (m: GL.Pickable) => {
                const model = m as EditorModel;
                selectModel(model);
            };
        };
    }, [renderer]);

    return (
        <EditorContext.Provider
            value={{
                processing,
                setProcessing,
                scene,
                renderer,
                selection,
                activeView: 0,
                models,
                setModels,
                selectedModel,
                selectModel,
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
                loadingStatus,
                setLoadingStatus,
                selectedSubmodels,
                setSelectedSubmodels,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    );
}