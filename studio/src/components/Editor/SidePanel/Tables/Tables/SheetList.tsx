import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

import { useActiveSheet, useSheets, useTables } from '@editor/EditorContext';

import { colorActive, colorBase } from '@elements/Colors';
import { RowContainer } from '@elements/Containers';

export function TablesSheetList() {
    const [tables] = useTables();
    const [addSheet, removeSheet] = useSheets();
    const [activeSheet, updateActiveSheet] = useActiveSheet();

    const handleRemoveSheet = (index: number) => {
        removeSheet(index);
        if (index === activeSheet) {
            updateActiveSheet(0);
        }
    };

    if (tables.empty) return null;

    return (
        <RowContainer className="overflow-y-auto border-t">
            {tables.sheets.map((_, index) => (
                <RowContainer
                    className={clsx('border-r', activeSheet === index ? colorActive : colorBase)}
                    key={index}
                >
                    <button
                        key={index}
                        className={clsx(
                            'px-2 py-1',
                            activeSheet === index ? colorActive : colorBase
                        )}
                        onClick={() => updateActiveSheet(index)}
                    >
                        Sheet {index}
                    </button>
                    <button className="px-2 h-full" onClick={() => handleRemoveSheet(index)}>
                        <IoClose />
                    </button>
                </RowContainer>
            ))}
        </RowContainer>
    );
}