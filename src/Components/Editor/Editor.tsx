import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { SizeGuard } from '@elements/SizeGuard';

import { SidePanel } from './SidePanel';
import { Canvas } from './Utils/Canvas';
import { ContextComponent } from './Utils/Context';
import { ProcessingScreen } from './Utils/Processing';
import { SpashScreen } from './Utils/Splash';
import { ViewControls } from './ViewControls';

export function ModelEditor() {
    return (
        <ContextComponent>
            <SizeGuard minWidth={600} minHeight={400}>
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200}>
                        <ViewControls />
                        <Canvas />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={200} preferredSize={400} className="bg-neutral-100">
                        <SidePanel />
                    </Allotment.Pane>
                </Allotment>
            </SizeGuard>
            <ProcessingScreen />
            <SpashScreen />
        </ContextComponent>
    );
}