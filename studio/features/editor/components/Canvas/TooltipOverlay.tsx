import { Heading, Text, View } from "@adobe/react-spectrum";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useEffect, useRef, useState } from "react";

// Function to detect URLs in text
const detectUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: "#0078D4", textDecoration: "underline" }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export function TooltipOverlay({ onlyTooltipInfo = false }: { onlyTooltipInfo?: boolean }) {
  const { tooltip, activeMetadataColumn } = useEditorContext();
  const [visibleTooltip, setVisibleTooltip] = useState(tooltip);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle tooltip show/hide based on context
  useEffect(() => {
    if (tooltip) {
      setVisibleTooltip(tooltip);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    } else if (visibleTooltip) {
      if (!hideTimeout.current) {
        hideTimeout.current = setTimeout(() => {
          setVisibleTooltip(null);
          hideTimeout.current = null;
        }, 200); // 2s delay
      }
    }
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltip, visibleTooltip]);

  // Handler for mouse enter/leave on the tooltip itself
  const handleMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (!hideTimeout.current) {
      hideTimeout.current = setTimeout(() => {
        setVisibleTooltip(null);
        hideTimeout.current = null;
      }, 200); // 2s delay
    }
  };

  if (!visibleTooltip) return null;

  let content;
  if (onlyTooltipInfo) {
    content = Object.entries(visibleTooltip.data)
      .map(([key, value]) => `${key}: ${value ?? "N/A"}`)
      .join("\n");
  } else {
    content = visibleTooltip.data[activeMetadataColumn] ?? "N/A";
  }

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
      <div
        style={{
          position: "absolute",
          top: visibleTooltip.y + 10,
          left: visibleTooltip.x + 10,
          pointerEvents: "auto",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <View backgroundColor="gray-50" padding="size-100" borderRadius="regular">
          <View>
            <Heading level={6} margin="0">
              {onlyTooltipInfo ? "Data" : activeMetadataColumn}
            </Heading>
          </View>
          <View>
            <Text>
              {onlyTooltipInfo
                ? content.split("\n").map((line: string, i: number) => <div key={i}>{detectUrls(line)}</div>)
                : detectUrls(content)}
            </Text>
          </View>
        </View>
      </div>
    </View>
  );
}
