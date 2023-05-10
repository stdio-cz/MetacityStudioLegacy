import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import clsx from 'clsx';
import React from 'react';

import { GridModel } from '@utils/models/GridModel';

import * as GL from '@bananagl/bananagl';

import { SizeGuard } from '@elements/SizeGuard';

import { ProcessingScreen } from './Processing';
import { SidePanel } from './SidePanel';
import { ViewControls } from './ViewControls';

export const EditorContext = React.createContext<{
    processing: boolean;
    setProcessing: (processing: boolean) => void;
} | null>(null);

export function ModelEditor() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());
    const [processing, setProcessing] = React.useState(false);
    const [selection, setSelection] = React.useState<GL.SelectionManager>(
        new GL.SelectionManager()
    );

    React.useEffect(() => {
        const grid = GridModel();
        scene.add(grid);
        renderer.clearColor = [1, 1, 1, 1];
    }, [scene]);

    return (
        <EditorContext.Provider value={{ processing, setProcessing }}>
            <SizeGuard minWidth={600} minHeight={400}>
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200} className="bg-white">
                        <ViewControls scene={scene} renderer={renderer} view={0} />
                        <GL.Canvas renderer={renderer} className="w-full h-full">
                            <GL.View scene={scene} left={0} top={0} width={100} height={100} />
                        </GL.Canvas>
                    </Allotment.Pane>
                    <Allotment.Pane minSize={200} preferredSize={400}>
                        <SidePanel scene={scene} renderer={renderer} selection={selection} />
                    </Allotment.Pane>
                </Allotment>
            </SizeGuard>
            <ProcessingScreen />
        </EditorContext.Provider>
    );
}
