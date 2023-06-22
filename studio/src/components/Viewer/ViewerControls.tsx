import clsx from 'clsx';
import React from 'react';
import { VscFolderOpened } from 'react-icons/vsc';

import { CoordinateMode, load, useCreateModels } from '@utils/utils';

import { ButtonFileInput } from '@elements/Button';
import { MenuButton, MenuGroup, getMenuButtonStyle } from '@elements/Button';
import { useLoadingStatus, useProcessing } from '@elements/Context';
import { DirectionControls } from '@elements/Controls/ControlsDirection';
import { ProjectionControls } from '@elements/Controls/ControlsProjection';
import { SelectionControls } from '@elements/Controls/ControlsSelect';
import { ShaderControls } from '@elements/Controls/ControlsShader';
import { ControlsView } from '@elements/Controls/ControlsView';

export function Controls() {
    return (
        <div className="absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2">
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
            <ControlsView />
        </div>
    );
}