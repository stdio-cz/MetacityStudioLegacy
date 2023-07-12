import React from 'react';

import { filterStyles } from '@utils/modifiers/filterStyles';
import { StyleNode } from '@utils/types';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';
import { Input } from '@elements/Input';

import { useStyle } from '@shared/Context/hooks';

import { StyleNodeComponent } from './StyleNode';

export const rootNodeLabel = 'Styles';

interface StyleHierarchyProps {
    onValuePick: (root: StyleNode, node: StyleNode) => void;
}

export function StyleHierarchy(props: StyleHierarchyProps) {
    const [style] = useStyle();
    const [fitlered, setFiltered] = React.useState<StyleNode>(style);
    const [search, setSearch] = React.useState<string>('');
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    React.useEffect(() => {
        setFiltered(filterStyles(style, '', search));
    }, [style, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setSearch(value);
        }, 500);
    };

    return (
        <div className="flex-1 w-full">
            <ColumnContainer>
                <Input
                    placeholder="Search..."
                    className="px-2 bg-neutral-100 w-full"
                    onChange={handleSearchChange}
                />
                <StretchContainer>
                    <OverflowAbsoluteContainer>
                        {!fitlered.children && !fitlered.style && <Empty>No metadata</Empty>}
                        {(fitlered.children || fitlered.style) && (
                            <StyleNodeComponent
                                category={rootNodeLabel}
                                node={fitlered}
                                onValuePick={(node) => props.onValuePick(fitlered, node)}
                                depth={0}
                                initialOpen={true}
                            />
                        )}
                    </OverflowAbsoluteContainer>
                </StretchContainer>
            </ColumnContainer>
        </div>
    );
}