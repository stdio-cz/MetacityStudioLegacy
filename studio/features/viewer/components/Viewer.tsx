"use client";

import { Grid, View } from "@adobe/react-spectrum";
//import Brush from "@spectrum-icons/workflow/Brush";
import useMetadataModelStyle from "@features/editor-metadata/hooks/useMetadataModelStyle";
import ActiveColumnToolbar from "@features/editor-toolbar/components/ActiveColumnToolbar";
import CameraViewToolbar from "@features/editor-toolbar/components/CameraViewToolbar";
import ColorSchemeToolbar from "@features/editor-toolbar/components/ColorSchemeToolbar";
import ProjectionToolbar from "@features/editor-toolbar/components/ProjectionToolbar";
import SelectionToolbar from "@features/editor-toolbar/components/SelectionToolbar";

import { CanvasWrapper } from "@features/editor/components/Canvas/CanvasWrapper";
import { TooltipOverlay } from "@features/editor/components/Canvas/TooltipOverlay";
import { useEmbed } from "@features/embeds/hooks/useEmbed";

type ViewerProps = {
  embedId: number;
};

export default function Viewer(props: ViewerProps) {
  useMetadataModelStyle();

  // If embedId is present, we are in embed mode
  const embedMode = typeof props.embedId === "number";
  const { data: embed } = useEmbed(props.embedId);

  return (
    <View width="100%" height="100%" position="relative">
      <CanvasWrapper />
      <TooltipOverlay onlyTooltipInfo={!!embed?.onlyTooltipInfo} />
      <View position="absolute" top="size-100" left="size-100">
        <Grid
          areas={["projection camera selection scheme style"]}
          columns={["auto auto auto auto"]}
          rows={["auto"]}
          gap="size-100"
          width="size-100"
        >
          <ProjectionToolbar />
          <CameraViewToolbar embedMode={embedMode} />
          <SelectionToolbar />
          <ColorSchemeToolbar />
          {!embed?.onlyTooltipInfo && <ActiveColumnToolbar />}
        </Grid>
      </View>
    </View>
  );
}
