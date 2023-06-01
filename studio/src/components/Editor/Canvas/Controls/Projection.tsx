import React from 'react';
import { BiRectangle } from 'react-icons/bi';
import { TbPerspective } from 'react-icons/tb';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@editor/Context/EditorContext';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function ProjectionControls() {
    const { renderer, activeView } = React.useContext(EditorContext);

    const [projection, setProjection] = React.useState<GL.ProjectionType>(
        GL.ProjectionType.ORTHOGRAPHIC
    );

    const setPerspective = () => {
        const view = renderer.views[activeView].view;
        view.camera.projectionType = GL.ProjectionType.PERSPECTIVE;
        setProjection(GL.ProjectionType.PERSPECTIVE);
    };

    const setOrtho = () => {
        const view = renderer.views[activeView].view;
        view.camera.projectionType = GL.ProjectionType.ORTHOGRAPHIC;
        setProjection(GL.ProjectionType.ORTHOGRAPHIC);
    };

    return (
        <MenuGroup>
            <MenuButton
                onClick={setOrtho}
                tipTitle="Orthographic Camera"
                tipPosition="top"
                active={projection === GL.ProjectionType.ORTHOGRAPHIC}
            >
                <BiRectangle className="text-2xl" />
            </MenuButton>
            <MenuButton
                onClick={setPerspective}
                tipTitle="Perspective Camera"
                tipPosition="top"
                active={projection === GL.ProjectionType.PERSPECTIVE}
            >
                <TbPerspective className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}