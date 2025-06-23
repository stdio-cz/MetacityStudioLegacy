"use client";

import {
  ActionBar,
  ActionBarContainer,
  ActionMenu,
  Button,
  Flex,
  Item,
  ListView,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { NoData } from "@core/components/Empty";
import { PositioningContainer } from "@core/components/PositioningContainer";
import { MdiBookmark } from "@core/icons/MdiBookmark";
import { MdiRename } from "@core/icons/MdiRename";
import { MdiTrash } from "@core/icons/MdiTrash";
import { Key, useCallback, useState } from "react";

type SavedView = {
  id: string;
  name: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  timestamp: Date;
};

type EditorSavedViewsProps = {
  projectId: number;
};

export default function EditorSavedViews({ projectId }: EditorSavedViewsProps) {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [editingView, setEditingView] = useState<SavedView | null>(null);
  const [newViewName, setNewViewName] = useState("");

  const handleSelection = useCallback((keys: any) => {
    setSelectedKeys(keys);
  }, []);

  const handleSaveCurrentView = useCallback(() => {
    // TODO: Get current camera position from the editor context
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName || `View ${savedViews.length + 1}`,
      cameraPosition: [0, 0, 10], // TODO: Get from camera
      cameraTarget: [0, 0, 0], // TODO: Get from camera
      timestamp: new Date(),
    };

    setSavedViews((prev) => [...prev, newView]);
    setNewViewName("");
  }, [newViewName, savedViews.length]);

  const handleLoadView = useCallback((view: SavedView) => {
    // TODO: Set camera position in the editor context
    console.log("Loading view:", view);
  }, []);

  const handleDeleteView = useCallback((view: SavedView) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== view.id));
  }, []);

  const handleRenameView = useCallback((view: SavedView, newName: string) => {
    setSavedViews((prev) => prev.map((v) => (v.id === view.id ? { ...v, name: newName } : v)));
    setEditingView(null);
  }, []);

  const dispatchAction = useCallback(
    (view: SavedView, key: Key) => {
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

  return (
    <PositioningContainer>
      <Flex direction="column" height="100%" gap="size-100" marginX="size-200">
        <View position="relative" overflow="hidden" marginTop="size-200">
          <Flex gap="size-100" alignItems="end">
            <TextField
              label="View name"
              value={newViewName}
              onChange={setNewViewName}
              placeholder="Enter view name"
              width="size-3000"
            />
            <Button variant="primary" onPress={handleSaveCurrentView} isDisabled={!newViewName.trim()}>
              <MdiBookmark />
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
                <Item key={view.id} textValue={view.name}>
                  <Flex alignItems="center" gap="size-100" width="100%">
                    <MdiBookmark />
                    <Flex direction="column" flex>
                      <Text>{view.name}</Text>
                      <Text
                        UNSAFE_style={{
                          fontSize: "var(--spectrum-global-dimension-font-size-75)",
                          color: "var(--spectrum-global-color-gray-500)",
                        }}
                      >
                        {view.timestamp.toLocaleDateString()}
                      </Text>
                    </Flex>
                    <ActionMenu onAction={(key) => dispatchAction(view, key)}>
                      <Item key="load" textValue="Load view">
                        <MdiBookmark />
                        <Text>Load view</Text>
                      </Item>
                      <Item key="rename" textValue="Rename view">
                        <MdiRename />
                        <Text>Rename view</Text>
                      </Item>
                      <Item key="delete" textValue="Delete view">
                        <MdiTrash />
                        <Text>Delete view</Text>
                      </Item>
                    </ActionMenu>
                  </Flex>
                </Item>
              )}
            </ListView>
            {selectedCount > 0 && (
              <ActionBar
                isEmphasized
                selectedItemCount={selectedCount}
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
