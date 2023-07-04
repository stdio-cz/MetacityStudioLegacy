import clsx from 'clsx';
import { BiCopy, BiLink } from 'react-icons/bi';

import { useActiveSheet, useRowTypes, useTables } from '@editor/EditorContext';

export type AssignToGeometryCallback = (data: any) => void;

interface TableRowProps {
    index: number;
    row: string[];
    rowType: string;
    assignToGeometry: AssignToGeometryCallback;
}

function ActionButton(props: { children: React.ReactNode; onClick?: () => void; title?: string }) {
    return (
        <button
            className="hover:text-amber-500 active:text-amber-600 cursor-pointer"
            onClick={props.onClick}
            title={props.title}
        >
            {props.children}
        </button>
    );
}

export function TableRow(props: TableRowProps) {
    const { index, row, rowType } = props;
    const [activeSheet] = useActiveSheet();
    const [tables] = useTables();

    const updateRowType = useRowTypes();

    const handleRowTypeUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        updateRowType(activeSheet, index, value);
    };

    const handleCopyClipboard = () => {
        const json = tables.getJSON(activeSheet, index);
        navigator.clipboard.writeText(JSON.stringify(json, null, 4));
    };

    const handleLinkToSelection = () => {
        const json = tables.getJSON(activeSheet, index);
        props.assignToGeometry(json);
    };

    return (
        <tr className="odd:bg-neutral-50">
            <td className="text-neutral-400 bg-neutral-100 border-r border-b sticky left-0">
                <div className="w-full h-full flex flex-row text-xl space-x-2 px-1">
                    <ActionButton title="Copy to clipboard" onClick={handleCopyClipboard}>
                        <BiCopy className="inline-block ml-1" />
                    </ActionButton>
                    <ActionButton
                        title="Assign to selected geometry"
                        onClick={handleLinkToSelection}
                    >
                        <BiLink className="inline-block ml-1" />
                    </ActionButton>
                </div>
            </td>
            <Td className="text-neutral-500 bg-neutral-100">
                <select
                    name="rowType"
                    id="rowType"
                    defaultValue={rowType}
                    onChange={handleRowTypeUpdate}
                    className="text-neutral-500 bg-transparent outline-none cursor-pointer"
                >
                    <option value="key">key</option>
                    <option value="value">value</option>
                    <option value="value">units</option>
                </select>
            </Td>
            {row.map((cell, cindex) => (
                <Td key={activeSheet + '_' + index + '_' + cindex}>{cell}</Td>
            ))}
        </tr>
    );
}

export function Td(props: { children: React.ReactNode; className?: string }) {
    return (
        <td className={clsx('border-r border-b whitespace-pre px-2 h-full', props.className)}>
            {props.children}
        </td>
    );
}
