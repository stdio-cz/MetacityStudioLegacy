import { ActionGroup, Item, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { MdiCamera } from "@core/icons/MdiCamera";
import { useRenderer } from "@features/editor/hooks/useRender";
import { useCallback } from "react";

export default function ScreenshotToolbar() {
  const renderer = useRenderer();

  const handleScreenshot = useCallback(() => {
    if (!renderer) return;

    // Use the renderer's afterRenderOnce callback to capture the canvas
    renderer.afterRenderOnce = () => {
      const canvas = renderer.window.rawCanvas;
      if (!canvas) return;

      // Convert canvas to data URL
      const image = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.download = `Metacity-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`;
      link.href = image;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }, [renderer]);

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="screenshot"
    >
      <ActionGroup overflowMode="collapse" onAction={handleScreenshot} isQuiet>
        <TooltipTrigger delay={0} placement="bottom">
          <Item key="screenshot">
            <MdiCamera />
          </Item>
          <Tooltip>Take screenshot</Tooltip>
        </TooltipTrigger>
      </ActionGroup>
    </View>
  );
}
