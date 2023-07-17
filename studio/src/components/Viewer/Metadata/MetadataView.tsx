import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { Empty } from '@elements/Empty';

import { useSelectedModels } from '@shared/Context/hooks';
import { combineData } from '@shared/Context/metadata';

function joinNums(nums: Set<number>) {
    return Array.from(nums).sort().join('-');
}

export function MetaView() {
    const selected = useSelectedModels();
    const [content, setContent] = React.useState({});
    const [key, setKey] = React.useState('');

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    React.useEffect(() => {
        const { common } = combineData(selected);
        setContent(common);
        setKey(
            Array.from(selected)
                .map(([model, submodels]) => model.name + joinNums(submodels))
                .join('-')
        );
    }, [selected, setContent]);

    let size = 0;
    selected.forEach((set) => (size += set.size));
    if (size === 0) return <Empty>Nothing selected</Empty>;

    return (
        <div className="w-full h-full p-2 px-4" onKeyDown={handleKey} onKeyUp={handleKey}>
            <JsonView src={content} key={key} />
        </div>
    );
}