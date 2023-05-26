import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@utils/models/models/EditorModel';
import { changeSelection } from '@utils/seleciton/selection';

import * as GL from '@bananagl/bananagl';

interface EditorContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    setModels: React.Dispatch<React.SetStateAction<EditorModel[]>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    selectedModel: EditorModel | null;
    selectedSubmodels: number[];
    select: (
        model: EditorModel | null,
        submodelIDs?: number[],
        toggle?: boolean,
        extend?: boolean
    ) => void;
}

export const EditorContext = React.createContext<EditorContextProps>({} as EditorContextProps);

export function ContextComponent(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);
    const [selectedSubmodels, setSelectedSubmodels] = React.useState<number[]>([]);

    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);
            if (selectedModel !== null && !copy.includes(selectedModel)) setSelectedModel(null);
        };

        scene.addChangeListener(onChange);

        return () => {
            scene.removeChangeListener(onChange);
        };
    }, [scene, selectedModel]);

    //selection callback, still a bit hacky but nicer than before
    function select(
        model: EditorModel | null,
        submodelIDs: number[] = [],
        toggle: boolean = false,
        extend: boolean = false
    ) {
        submodelIDs = changeSelection(
            selectedModel,
            model,
            selectedSubmodels,
            submodelIDs,
            toggle,
            extend
        );

        setSelectedModel(model);
        setSelectedSubmodels(submodelIDs);
    }

    return (
        <EditorContext.Provider
            value={{
                processing,
                setProcessing,
                scene,
                renderer,
                activeView: 0,
                models,
                setModels,
                loadingStatus,
                setLoadingStatus,
                selectedModel,
                selectedSubmodels,
                select,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    );
}

interface EditorViewerContextProps {
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
}

export const EditorViewerContext = React.createContext<EditorViewerContextProps>(
    {} as EditorViewerContextProps
);

export function ViewContextComponent(props: { children: React.ReactNode }) {
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(true);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);

    return (
        <EditorViewerContext.Provider
            value={{
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
            }}
        >
            {props.children}
        </EditorViewerContext.Provider>
    );
}