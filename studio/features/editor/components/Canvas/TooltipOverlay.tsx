import { Heading, Text, View } from "@adobe/react-spectrum";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";

export function TooltipOverlay({ onlyTooltipInfo = false }: { onlyTooltipInfo?: boolean }) {
  const { tooltip, activeMetadataColumn } = useEditorContext();

  if (!tooltip) return null;

  let content;
  if (onlyTooltipInfo) {
    content = Object.entries(tooltip.data)
      .map(([key, value]) => `${key}: ${value ?? "N/A"}`)
      .join("\n");
  } else {
    content = tooltip.data[activeMetadataColumn] ?? "N/A";
  }

  // If content is empty, display 'N/A'
  if (!content) content = "N/A";

  return (
    <View
      position="absolute"
      width="100%"
      height="100%"
      top="size-0"
      left="size-0"
      UNSAFE_style={{
        pointerEvents: "none",
      }}
      zIndex={100}
    >
      <View
        top={tooltip.y + 10}
        left={tooltip.x + 10}
        position="absolute"
        backgroundColor="gray-50"
        padding="size-100"
        borderRadius="regular"
      >
        <View>
          <Heading level={6} margin="0">
            {onlyTooltipInfo ? "Data" : activeMetadataColumn}
          </Heading>
        </View>
        <View>
          <Text>
            {onlyTooltipInfo
              ? content.split("\n").map((line: string, i: number) => <div key={i}>{line}</div>)
              : content}
          </Text>
        </View>
      </View>
    </View>
  );
}
