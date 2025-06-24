import { Item, Picker, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { SavedView } from "@features/db/entities/savedView";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback } from "react";

type SavedViewsToolbarProps = {
  savedViews?: SavedView[];
  embedMode?: boolean;
};

export default function SavedViewsToolbar({ savedViews = [], embedMode = false }: SavedViewsToolbarProps) {
  const { renderer, activeView } = useEditorContext();

  const handleSelectionChange = useCallback(
    (selectedKey: string | number) => {
      if (!selectedKey) return;

      const selectedView = savedViews.find((view) => view.id.toString() === selectedKey.toString());

      if (!selectedView) return;

      // Set camera position in the editor context
      const currentView = renderer.views?.[activeView];
      if (!currentView) {
        console.error("No active view found");
        return;
      }

      // Set camera position and target to the saved view values
      currentView.view.camera.set({
        position: selectedView.cameraPosition,
        target: selectedView.cameraTarget,
        projectionType: selectedView.projectionType,
        fovYRadian: selectedView.fovYRadian,
      });

      // For orthographic projection, set the saved orthographic bounds
      if (selectedView.projectionType === ProjectionType.ORTHOGRAPHIC) {
        currentView.view.camera.setOrthographicBounds(
          selectedView.orthographicLeft,
          selectedView.orthographicRight,
          selectedView.orthographicBottom,
          selectedView.orthographicTop,
        );
      }

      // Update the camera matrices to reflect the new position
      currentView.view.camera.updateProjectionViewMatrix();

      console.log("Loaded saved view:", selectedView.name);
    },
    [renderer.views, activeView, savedViews],
  );

  // Only show in embed mode and if there are saved views
  if (!embedMode || savedViews.length === 0) {
    return null;
  }

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="savedViews"
    >
      <TooltipTrigger delay={0} placement="bottom">
        <Picker onSelectionChange={handleSelectionChange} isQuiet placeholder="Saved Views" items={savedViews}>
          {(item) => (
            <Item key={item.id.toString()} textValue={item.name}>
              {item.name}
            </Item>
          )}
        </Picker>
        <Tooltip>Select saved view</Tooltip>
      </TooltipTrigger>
    </View>
  );
}
