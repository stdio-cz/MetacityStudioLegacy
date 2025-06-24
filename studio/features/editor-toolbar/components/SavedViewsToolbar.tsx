import { Item, Picker, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { SavedView } from "@features/db/entities/savedView";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback, useState } from "react";

type SavedViewsToolbarProps = {
  savedViews?: SavedView[];
  embedMode?: boolean;
};

export default function SavedViewsToolbar({ savedViews = [], embedMode = false }: SavedViewsToolbarProps) {
  const { renderer, activeView } = useEditorContext();
  const [selectedViewId, setSelectedViewId] = useState<string | number | null>(null);

  const handleSelectionChange = useCallback(
    (selectedKey: string | number) => {
      if (!selectedKey) return;

      const view = savedViews.find((v) => v.id.toString() === selectedKey.toString());
      if (!view) return;

      // Set camera position in the editor context
      const currentView = renderer.views?.[activeView];
      if (!currentView) {
        console.error("No active view found");
        return;
      }

      // Always reset to the exact database values, regardless of current state
      currentView.view.camera.set({
        position: view.cameraPosition,
        target: view.cameraTarget,
        projectionType: view.projectionType,
        fovYRadian: view.fovYRadian,
      });

      // For orthographic projection, set the saved orthographic bounds
      if (view.projectionType === ProjectionType.ORTHOGRAPHIC) {
        currentView.view.camera.setOrthographicBounds(
          view.orthographicLeft,
          view.orthographicRight,
          view.orthographicBottom,
          view.orthographicTop,
        );
      }

      // Update the camera matrices to reflect the new position
      currentView.view.camera.updateProjectionViewMatrix();

      // Update local state to track selection
      setSelectedViewId(selectedKey);

      console.log("Loaded saved view from DB:", view.name, "with position:", view.cameraPosition);
    },
    [renderer.views, activeView, savedViews],
  );

  // Only show in embed mode and if there are saved views
  if (!embedMode || savedViews.length === 0) {
    return null;
  }

  const selectedView = savedViews.find((v) => v.id.toString() === selectedViewId?.toString());

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
        <Picker
          onSelectionChange={handleSelectionChange}
          isQuiet
          placeholder={selectedView ? selectedView.name : "Saved Views"}
          items={savedViews}
          selectedKey={selectedViewId}
        >
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
