import { Item, Picker, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { CameraView } from "@features/bananagl/camera/cameraView";
import { SavedView } from "@features/db/entities/savedView";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback, useState } from "react";

type SavedViewsToolbarProps = {
  savedViews?: SavedView[];
  embedMode?: boolean;
};

export default function SavedViewsToolbar({ savedViews = [], embedMode = false }: SavedViewsToolbarProps) {
  const { renderer, activeView, updateContextFromView } = useEditorContext();
  const [selectedViewId, setSelectedViewId] = useState<string | number | null>(null);

  const handleSelectionChange = useCallback(
    (selectedKey: string | number) => {
      if (!selectedKey) return;
      const view = savedViews.find((v) => v.id.toString() === selectedKey.toString());
      if (!view) return;
      const currentView = renderer.views?.[activeView];
      if (!currentView) {
        console.error("No active view found");
        return;
      }
      currentView.view.cameraLock.mode = CameraView.Free;
      if (view.viewState) {
        currentView.view.deserialize(view.viewState, currentView.view.width, currentView.view.height);
        updateContextFromView(view.viewState);
      } else if (view.cameraPosition && view.cameraTarget && view.projectionType) {
        currentView.view.camera.set({
          position: view.cameraPosition,
          target: view.cameraTarget,
          projectionType: view.projectionType,
          fovYRadian: view.fovYRadian || Math.PI / 4,
        });
        if (
          view.projectionType === ProjectionType.ORTHOGRAPHIC &&
          view.orthographicZoomFactor &&
          view.canvasWidth &&
          view.canvasHeight
        ) {
          currentView.view.camera.setOrthographicViewWithRescale(
            view.orthographicZoomFactor,
            view.canvasWidth,
            view.canvasHeight,
          );
        }
        currentView.view.camera.updateProjectionViewMatrix();
      }
      currentView.view.camera.updateProjectionViewMatrix();
      setSelectedViewId(selectedKey);
      console.log("Loaded saved view from DB:", view.name);
    },
    [renderer.views, activeView, savedViews, updateContextFromView],
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
