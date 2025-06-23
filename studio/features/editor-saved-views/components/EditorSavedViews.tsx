"use client";

import {
  ActionBar,
  ActionBarContainer,
  ActionGroup,
  Button,
  Flex,
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
import { SavedView } from "@features/db/entities/savedView";
import { useSavedViews } from "@features/saved-views/hooks/useSavedViews";
import { Key, useCallback, useEffect, useState } from "react";

type EditorSavedViewsProps = {
  projectId: number;
};

export default function EditorSavedViews({ projectId }: EditorSavedViewsProps) {
  const { savedViews, loading, error, fetchSavedViews, createView, updateView, deleteView } = useSavedViews(projectId);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [editingView, setEditingView] = useState<SavedView | null>(null);
  const [newViewName, setNewViewName] = useState<string>("Untitled View");

  useEffect(() => {
    fetchSavedViews();
  }, [fetchSavedViews]);

  const handleSelection = useCallback((keys: any) => {
    setSelectedKeys(keys);
  }, []);

  const handleSaveCurrentView = useCallback(async () => {
    try {
      // TODO: Get current camera position from the editor context
      await createView(
        newViewName || `View ${savedViews.length + 1}`,
        [0, 0, 10], // TODO: Get from camera
        [0, 0, 0], // TODO: Get from camera
      );
      setNewViewName("Untitled View");
    } catch (err) {
      console.error("Failed to save view:", err);
    }
  }, [newViewName, savedViews.length, createView]);

  const handleLoadView = useCallback((view: SavedView) => {
    // TODO: Set camera position in the editor context
    console.log("Loading view:", view);
  }, []);

  const handleDeleteView = useCallback(
    async (view: SavedView) => {
      try {
        await deleteView(view.id);
      } catch (err) {
        console.error("Failed to delete view:", err);
      }
    },
    [deleteView],
  );

  const handleRenameView = useCallback(
    async (view: SavedView, newName: string) => {
      try {
        await updateView(view.id, { name: newName });
        setEditingView(null);
      } catch (err) {
        console.error("Failed to rename view:", err);
      }
    },
    [updateView],
  );

  const handleItemAction = useCallback(
    (key: Key, view: SavedView) => {
      switch (key) {
        case "load":
          handleLoadView(view);
          break;
        case "rename":
          setEditingView(view);
          break;
        case "delete":
          handleDeleteView(view);
          break;
      }
    },
    [handleLoadView, handleDeleteView],
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
                <Button variant="primary" onPress={() => handleRenameView(editingView, editingView.name)}>
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
      </Flex>
    </PositioningContainer>
  );
}
