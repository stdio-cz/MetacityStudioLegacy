import React from 'react';

import { MetadataNode } from '@utils/types';

interface ViewerContextProps {
    style: MetadataNode | undefined;
    setStyle: React.Dispatch<React.SetStateAction<MetadataNode | undefined>>;
}

const context = React.createContext<ViewerContextProps>({} as ViewerContextProps);

export function ViewerContext(props: { children: React.ReactNode }) {
    const [style, setStyle] = React.useState<MetadataNode | undefined>();

    return (
        <context.Provider
            value={{
                style,
                setStyle,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useViewerContext(): ViewerContextProps {
    return React.useContext(context);
}

export function useStyle(): [
    MetadataNode | undefined,
    React.Dispatch<React.SetStateAction<MetadataNode | undefined>>
] {
    const { style, setStyle } = useViewerContext();
    return [style, setStyle];
}
