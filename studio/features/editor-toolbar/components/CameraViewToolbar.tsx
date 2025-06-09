import { ActionGroup, Item, Selection, Tooltip, TooltipTrigger, View } from "@adobe/react-spectrum";
import { CameraView } from "@bananagl/bananagl";
import { CubeEmpty } from "@core/icons/CubeEmpty";
import { CubeLeft } from "@core/icons/CubeLeft";
import { CubeRight } from "@core/icons/CubeRight";
import { CubeTop } from "@core/icons/CubeTop";

import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useCallback } from "react";

export default function CameraViewToolbar({ embedMode = false }: { embedMode?: boolean }) {
  const { viewMode, setViewMode } = useEditorContext();

  const handleAction = useCallback(
    (keys: Selection) => {
      //ignore if all keys are selected
      if (keys === "all") return;

      //get first key
      const viewMode = (keys.values().next().value as CameraView) ?? CameraView.Free;
      setViewMode(viewMode);
    },
    [setViewMode],
  );

  // Camera options
  const cameraOptions = [
    {
      key: CameraView.Free,
      icon: <CubeEmpty />,
      label: "Free camera",
    },
    {
      key: CameraView.Top,
      icon: <CubeTop />,
      label: "Top view",
    },
    // Only show these in editor mode
    ...(!embedMode
      ? [
          {
            key: CameraView.Front,
            icon: <CubeLeft />,
            label: "Front view",
          },
          {
            key: CameraView.Right,
            icon: <CubeRight />,
            label: "Right view",
          },
          {
            key: CameraView.Left,
            icon: <CubeLeft />,
            label: "Left view",
          },
          {
            key: CameraView.Back,
            icon: <CubeRight />,
            label: "Back view",
          },
        ]
      : []),
  ];

  return (
    <View
      backgroundColor="gray-50"
      padding="size-50"
      borderRadius="medium"
      borderColor="gray-300"
      borderWidth="thin"
      gridArea="camera"
    >
      <ActionGroup
        selectionMode="single"
        overflowMode="collapse"
        onSelectionChange={handleAction}
        selectedKeys={[viewMode]}
        isQuiet
      >
        {cameraOptions.map((opt) => (
          <TooltipTrigger key={opt.key} delay={0} placement="bottom">
            <Item key={opt.key}>{opt.icon}</Item>
            <Tooltip>{opt.label}</Tooltip>
          </TooltipTrigger>
        ))}
      </ActionGroup>
    </View>
  );
}
