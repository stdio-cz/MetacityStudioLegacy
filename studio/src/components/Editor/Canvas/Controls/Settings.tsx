import React from 'react';
import { GoSettings } from 'react-icons/go';
import { MdOutlineClose } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

import { CameraGroundWidget } from './SettingsWidgets/CameraGround';
import { ShadingWidget } from './SettingsWidgets/Shading';
import { ShowGridWidget } from './SettingsWidgets/ShowGrid';

export function ViewSettings() {
    const [open, setOpen] = React.useState(false);

    if (!open)
        return (
            <div className="absolute bottom-4 right-4">
                <MenuGroup>
                    <MenuButton onClick={() => setOpen(true)}>
                        <GoSettings className="text-2xl" />
                    </MenuButton>
                </MenuGroup>
            </div>
        );

    return (
        <div className="absolute bottom-4 right-4 bg-white p-2 border rounded-md shadow-even w-80">
            <div className="flex flex-row justify-end absolute right-2 bottom-2">
                <button
                    className="px-2 py-2 rounded-md hover:bg-neutral-200"
                    onClick={() => setOpen(false)}
                >
                    <MdOutlineClose />
                </button>
            </div>
            <div className="space-y-2 ">
                <ShadingWidget />
                <CameraGroundWidget />
                <ShowGridWidget />
            </div>
        </div>
    );
}