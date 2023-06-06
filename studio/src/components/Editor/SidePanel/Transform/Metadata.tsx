import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { useSelection } from '@utils/utils';

import { EmptyDetail, EmptyMetadata } from '@elements/Empty';

export function Metadata() {
    const [, selectedModel, selectedSubmodels] = useSelection();

    if (selectedModel === null) return <EmptyDetail />;
    if (selectedSubmodels.length === 0) return <EmptyMetadata />;

    return (
        <div className="p-4 space-y-4">
            {selectedSubmodels.map((id) => (
                <div key={id}>
                    <div className="text-2xl text-neutral-300">Part {id}</div>
                    <JsonView src={selectedModel.data[id]} />
                </div>
            ))}
        </div>
    );
}