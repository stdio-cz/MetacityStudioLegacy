# Saved Views Feature

This feature allows users to save and restore camera positions in the 3D editor.

## Components

- `EditorSavedViews.tsx` - Main component for managing saved views
- `MdiBookmark.tsx` - Bookmark icon for the saved views tab

## Features

- Save current camera position with a custom name
- List all saved views with timestamps
- Load saved views to restore camera position
- Rename saved views
- Delete saved views
- Multi-select and bulk delete views

## TODO

- Integrate with camera system to actually save/restore camera positions
- Persist saved views to database
- Add view thumbnails
- Add view categories/tags

## Usage

The saved views tab is accessible from the main editor side panel, positioned between the "Style" and "Exports" tabs.
