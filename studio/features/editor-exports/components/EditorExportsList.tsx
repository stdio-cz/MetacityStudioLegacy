"use client";

import {
  ActionBarContainer,
  ActionGroup,
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Form,
  Heading,
  Image,
  Item,
  ListView,
  Text,
  TextField,
  Tooltip,
  TooltipTrigger,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { MdiEye } from "@core/icons/MdiEye";
import { MdiRename } from "@core/icons/MdiRename";
import { MdiTrash } from "@core/icons/MdiTrash";
import useEmbeds from "@features/embeds/hooks/useEmbeds";
import { useCallback, useState } from "react";

type EditorExportListProps = {
  projectId: number;
};

type Embed = {
  id: number;
  name?: string;
  thumbnailContents: string;
};

export default function EditorExportList({ projectId }: EditorExportListProps) {
  const { embeds, renameEmbed, deleteEmbed } = useEmbeds(projectId);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmbed, setSelectedEmbed] = useState<Embed | null>(null);
  const [newName, setNewName] = useState("");

  // Handlers
  const handleOpenRename = useCallback((embed: Embed) => {
    setSelectedEmbed(embed);
    setNewName(embed.name || "");
    setRenameDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((embed: Embed) => {
    setSelectedEmbed(embed);
    setDeleteDialogOpen(true);
  }, []);

  const handleRename = useCallback(async () => {
    if (!selectedEmbed) return;
    await renameEmbed(selectedEmbed.id, newName);
    setRenameDialogOpen(false);
    setSelectedEmbed(null);
  }, [selectedEmbed, newName, renameEmbed]);

  const handleDelete = useCallback(async () => {
    if (!selectedEmbed) return;
    await deleteEmbed(selectedEmbed.id);
    setDeleteDialogOpen(false);
    setSelectedEmbed(null);
  }, [selectedEmbed, deleteEmbed]);

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View position="relative" flex height="100%" overflow="hidden" marginTop="size-200" marginBottom="size-100">
          <ActionBarContainer height="100%" width="100%">
            <ListView
              aria-label="Embed list"
              width="100%"
              marginBottom="size-100"
              height="100%"
              items={embeds as Iterable<Embed>}
              renderEmptyState={() => <NoData heading="No embeds in the project" />}
            >
              {(embed: Embed) => (
                <Item key={embed.id} textValue={embed.name || ""}>
                  <Image src={embed.thumbnailContents} alt={embed.name || ""} objectFit="cover" />
                  <Text>{embed.name || "(no name)"}</Text>
                  <ActionGroup
                    isQuiet
                    onAction={(key) => {
                      if (key === "view") window.open(`/embeds/${embed.id}`, "_blank");
                      else if (key === "rename") handleOpenRename(embed);
                      else if (key === "delete") handleOpenDelete(embed);
                    }}
                  >
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="view" textValue="View">
                        <MdiEye />
                      </Item>
                      <Tooltip>View</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="rename" textValue="Rename">
                        <MdiRename />
                      </Item>
                      <Tooltip>Rename</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="delete" textValue="Delete">
                        <MdiTrash />
                      </Item>
                      <Tooltip>Delete</Tooltip>
                    </TooltipTrigger>
                  </ActionGroup>
                </Item>
              )}
            </ListView>
          </ActionBarContainer>
        </View>
      </Flex>
      {/* Rename Dialog */}
      <DialogContainer onDismiss={() => setRenameDialogOpen(false)}>
        {renameDialogOpen && (
          <Dialog>
            <Heading>Rename Export</Heading>
            <Content>
              <Form maxWidth="size-6000" validationBehavior="native">
                <TextField
                  label="Export name"
                  name="name"
                  isRequired
                  validate={(value) => {
                    if (!value) {
                      return "Export name is required";
                    }
                  }}
                  value={newName}
                  onChange={setNewName}
                />
              </Form>
            </Content>
            <ButtonGroup marginTop={20}>
              <Button variant="secondary" onPress={() => setRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" onPress={handleRename}>
                Rename
              </Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogContainer>
      {/* Delete Confirmation Dialog */}
      <DialogContainer onDismiss={() => setDeleteDialogOpen(false)}>
        {deleteDialogOpen && (
          <AlertDialog
            title="Delete Export"
            variant="destructive"
            primaryActionLabel="Delete"
            cancelLabel="Cancel"
            onPrimaryAction={handleDelete}
            onCancel={() => setDeleteDialogOpen(false)}
          >
            Are you sure you want to delete this export?
          </AlertDialog>
        )}
      </DialogContainer>
    </PositioningContainer>
  );
}
