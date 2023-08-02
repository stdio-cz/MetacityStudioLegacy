import clsx from 'clsx';
import React from 'react';

import { getValueOrDefault } from '@utils/placeholders';
import { isEmpty } from '@utils/predicates';
import { MetadataNode } from '@utils/types';

import { HierarchyBracketsButton, HierarchyMainButton, HierarchyNode } from '@elements/Hierarchy';

export type MetadataMenuPickFunciton = (node: MetadataNode, value: any) => void;

interface MetadataValueProps {
    node: MetadataNode;
    onValuePick: MetadataMenuPickFunciton;
    depth?: number;
}

export function MetadataValue(props: MetadataValueProps) {
    const { node, onValuePick, depth } = props;
    const [displayCount, setDisplayCount] = React.useState(10);

    const handleUseMetadata = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any) => {
        onValuePick(node, value);
        e.stopPropagation();
    };

    const unique = Array.from(new Set(node.values)).sort();

    return (
        <>
            {unique.slice(0, displayCount).map((value, i) => (
                <HierarchyNode key={value} depth={(depth !== undefined && depth + 1) || undefined}>
                    <HierarchyBracketsButton onClick={(e) => handleUseMetadata(e, value)} />
                    <HierarchyMainButton
                        onClick={(e) => handleUseMetadata(e, value)}
                        className={clsx(isEmpty(value) && 'text-neutral-500')}
                    >
                        {getValueOrDefault(value)}
                    </HierarchyMainButton>
                </HierarchyNode>
            ))}
            {unique.length > displayCount && (
                <HierarchyNode depth={(depth !== undefined && depth + 1) || undefined}>
                    <button
                        onClick={() =>
                            setDisplayCount((count) => Math.min(count + 10, unique.length))
                        }
                        className="text-neutral-300 px-2"
                    >
                        {unique.length - displayCount} more values
                    </button>
                </HierarchyNode>
            )}
        </>
    );
}
