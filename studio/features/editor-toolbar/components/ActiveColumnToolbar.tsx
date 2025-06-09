import { ComboBox, Item, View } from "@adobe/react-spectrum";
import useMetadataContext from "@features/editor-metadata/hooks/useMetadataContext";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useMemo } from "react";

export default function ActiveColumnToolbar() {
  const { columns } = useMetadataContext();
  const { activeMetadataColumn, setActiveMetadataColumn } = useEditorContext();

  // Find the label for the currently selected key
  const selectedLabel = useMemo(() => {
    const found = columns.find((col) => col.key === activeMetadataColumn);
    return found ? found.key : "";
  }, [columns, activeMetadataColumn]);

  // If there's only one column, don't show the dropdown
  if (columns.length <= 1) {
    return null;
  }

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="style"
    >
      <ComboBox
        aria-label="Metadata column"
        defaultItems={columns}
        width="size-3000"
        onSelectionChange={(key) => setActiveMetadataColumn(key?.toString() || "")}
        selectedKey={activeMetadataColumn}
        inputValue={selectedLabel}
        onInputChange={() => {}}
        allowsCustomValue={false}
      >
        {(item) => <Item key={item.key}>{item.key}</Item>}
      </ComboBox>
    </View>
  );
}
