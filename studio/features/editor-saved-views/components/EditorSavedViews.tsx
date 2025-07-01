"use client";

import {
  ActionBar,
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
import { MdiBookmark } from "@core/icons/MdiBookmark";
import { MdiRename } from "@core/icons/MdiRename";
import { MdiTrash } from "@core/icons/MdiTrash";
import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { SavedView } from "@features/db/entities/savedView";
import { useEditorContext } from "@features/editor/hooks/useEditorContext";
import { useSavedViews } from "@features/saved-views/hooks/useSavedViews";
import { Key, useCallback, useEffect, useState } from "react";

type EditorSavedViewsProps = {
  projectId: number;
};

export default function EditorSavedViews({ projectId }: EditorSavedViewsProps) {
  const { savedViews, loading, error, fetchSavedViews, createView, updateView, deleteView } = useSavedViews(projectId);
  const { renderer, activeView } = useEditorContext();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [editingView, setEditingView] = useState<SavedView | null>(null);
  const [newViewName, setNewViewName] = useState<string>("Untitled View");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<SavedView | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [viewToRename, setViewToRename] = useState<SavedView | null>(null);

  useEffect(() => {
    fetchSavedViews();
  }, [fetchSavedViews]);

  const handleSelection = useCallback((keys: any) => {
    setSelectedKeys(keys);
  }, []);

  const handleSaveCurrentView = useCallback(async () => {
    try {
      // Get current camera position from the editor context (same as embed export)
      const view = renderer.views?.[activeView];
      if (!view) {
        console.error("No active view found");
        return;
      }

      const cameraPosition: [number, number, number] = [
        view.view.camera.position[0],
        view.view.camera.position[1],
        view.view.camera.position[2],
      ];

      const cameraTarget: [number, number, number] = [
        view.view.camera.target[0],
        view.view.camera.target[1],
        view.view.camera.target[2],
      ];

      // Capture zoom-related data
      const projectionType = view.view.camera.projectionType;
      const fovYRadian = view.view.camera.fovYRadian;

      // Get orthographic bounds using the getter methods from the camera class
      const orthographicLeft = view.view.camera.orthographicLeft;
      const orthographicRight = view.view.camera.orthographicRight;
      const orthographicBottom = view.view.camera.orthographicBottom;
      const orthographicTop = view.view.camera.orthographicTop;

      await createView(
        newViewName || `View ${savedViews.length + 1}`,
        cameraPosition,
        cameraTarget,
        projectionType,
        fovYRadian,
        orthographicLeft,
        orthographicRight,
        orthographicBottom,
        orthographicTop,
      );
      setNewViewName("Untitled View");
    } catch (err) {
      console.error("Failed to save view:", err);
    }
  }, [newViewName, savedViews.length, createView, renderer.views, activeView]);

  const handleLoadView = useCallback(
    (view: SavedView) => {
      // Set camera position in the editor context (same as embed export)
      const currentView = renderer.views?.[activeView];
      if (!currentView) {
        console.error("No active view found");
        return;
      }

      // Set camera position and target to the saved view values
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

      console.log("Loaded view:", view.name);
    },
    [renderer.views, activeView],
  );

  const handleOpenDelete = useCallback((view: SavedView) => {
    setViewToDelete(view);
    setDeleteDialogOpen(true);
  }, []);

  const handleOpenRename = useCallback((view: SavedView) => {
    setViewToRename(view);
    setRenameValue(view.name);
    setRenameDialogOpen(true);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    if (!viewToDelete) return;
    await deleteView(viewToDelete.id);
    setDeleteDialogOpen(false);
    setViewToDelete(null);
  }, [viewToDelete, deleteView]);

  const handleRenameConfirmed = useCallback(async () => {
    if (!viewToRename) return;
    await updateView(viewToRename.id, { name: renameValue });
    setRenameDialogOpen(false);
    setViewToRename(null);
  }, [viewToRename, renameValue, updateView]);

  const handleItemAction = useCallback(
    (key: Key, view: SavedView) => {
      switch (key) {
        case "load":
          handleLoadView(view);
          break;
        case "rename":
          handleOpenRename(view);
          break;
        case "delete":
          handleOpenDelete(view);
          break;
      }
    },
    [handleLoadView, handleOpenDelete, handleOpenRename],
  );

  const selectedCount = selectedKeys.size;

  if (loading) {
    return (
      <PositioningContainer>
        <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
          <Text>Loading saved views...</Text>
        </Flex>
      </PositioningContainer>
    );
  }

  if (error) {
    return (
      <PositioningContainer>
        <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
          <Text>Error: {error}</Text>
        </Flex>
      </PositioningContainer>
    );
  }

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View position="relative" overflow="hidden" marginTop="size-200">
          <Flex gap="size-100" alignItems="end">
            <TextField label="View Name" value={newViewName} onChange={setNewViewName} width="size-3000" />
            <Button variant="primary" onPress={handleSaveCurrentView} isDisabled={!newViewName.trim()}>
              <Text>Save View</Text>
            </Button>
          </Flex>
        </View>

        {editingView && (
          <View
            position="absolute"
            top="50%"
            left="50%"
            UNSAFE_style={{ transform: "translate(-50%, -50%)" }}
            backgroundColor="gray-50"
            padding="size-200"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="gray-300"
            zIndex={1000}
          >
            <Flex direction="column" gap="size-100">
              <TextField
                label="Rename view"
                value={editingView.name}
                onChange={(value) => setEditingView((prev) => (prev ? { ...prev, name: value } : null))}
                autoFocus
              />
              <Flex gap="size-100">
                <Button variant="primary" onPress={() => handleItemAction("rename", editingView)}>
                  Save
                </Button>
                <Button variant="secondary" onPress={() => setEditingView(null)}>
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </View>
        )}

        <View position="relative" flex height="100%" overflow="hidden" marginBottom="size-100">
          <ActionBarContainer height="100%" width="100%">
            <ListView
              selectionMode="multiple"
              aria-label="Saved views list"
              width="100%"
              marginBottom="size-100"
              height="100%"
              onSelectionChange={handleSelection}
              items={savedViews}
              selectedKeys={selectedKeys}
              renderEmptyState={() => <NoData heading="No saved views" />}
            >
              {(view) => (
                <Item key={view.id.toString()} textValue={view.name}>
                  <Text>{view.name}</Text>

                  <ActionGroup isQuiet onAction={(key) => handleItemAction(key, view)}>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="load" textValue="Load view">
                        <MdiBookmark />
                      </Item>
                      <Tooltip>Load view</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="rename" textValue="Rename view">
                        <MdiRename />
                      </Item>
                      <Tooltip>Rename view</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0} placement="bottom">
                      <Item key="delete" textValue="Delete view">
                        <MdiTrash />
                      </Item>
                      <Tooltip>Delete view</Tooltip>
                    </TooltipTrigger>
                  </ActionGroup>
                </Item>
              )}
            </ListView>
            {selectedKeys.size > 0 && (
              <ActionBar
                isEmphasized
                selectedItemCount={selectedKeys.size}
                onClearSelection={() => setSelectedKeys(new Set())}
              >
                <Item key="delete">
                  <MdiTrash />
                  <Text>Delete views</Text>
                </Item>
              </ActionBar>
            )}
          </ActionBarContainer>
        </View>

        {/* Rename Dialog */}
        <DialogContainer onDismiss={() => setRenameDialogOpen(false)}>
          {renameDialogOpen && (
            <Dialog>
              <Heading>Rename View</Heading>
              <Content>
                <Form maxWidth="size-6000" validationBehavior="native">
                  <TextField
                    label="View name"
                    name="name"
                    isRequired
                    validate={(value) => {
                      if (!value) {
                        return "View name is required";
                      }
                    }}
                    value={renameValue}
                    onChange={setRenameValue}
                  />
                </Form>
              </Content>
              <ButtonGroup marginTop={20}>
                <Button variant="secondary" onPress={() => setRenameDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="accent" onPress={handleRenameConfirmed}>
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
              title="Delete View"
              variant="destructive"
              primaryActionLabel="Delete"
              cancelLabel="Cancel"
              onPrimaryAction={handleDeleteConfirmed}
              onCancel={() => setDeleteDialogOpen(false)}
            >
              Are you sure you want to delete this view?
            </AlertDialog>
          )}
        </DialogContainer>
      </Flex>
    </PositioningContainer>
  );
}
