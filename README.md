# 📝 Overview — Custom High-Performance Text Editor Engine (Built From Scratch)

This repository contains a fully custom, high-performance text editor engine designed from the ground up with scalable system architecture, clean code, and zero third-party libraries.
Every subsystem — layout, rendering, cursor logic, text model, pagination, undo/redo, selection, command system — is entirely hand-crafted.

The goal is to demonstrate real engineering depth:
low-level data structures + OS-grade rendering + editor engine architecture + scalable system design.

This is not a wrapper around contenteditable, canvas libraries, or existing editors.
Everything is built from scratch.

---

# 🚀 Current Completed Features

## ✅ 1. Multi-Page Document Rendering

The editor supports:

- automatic page creation
- dynamic page removal
- correct cursor behavior across pages
- mouse event mapping to multi-page coordinates
- independent canvas per page

This matches the behavior of full document editors like Google Docs and MS Word.

## ✅ 2. Fully Custom Rendering Engine (Canvas-Based)

- Fast, GPU-accelerated canvas drawing
- Efficient text layout
- Cursor rendering
- Selection highlighting
- Text updates without full re-paints
- Supports configurable style: font, font size, line height, foreground color, background color, and more

Renderer is architected for future migration to:

- native C++ rendering engines (Skia, Metal, Vulkan)
- WebAssembly renderers
- background/offscreen canvases

## ✅ 3. Fast Lazy Rendering System

The editor uses a custom lazy rendering pipeline:

- Only the regions affected by edits or cursor movement re-render
- No unnecessary redraws
- Optimized for large documents
- Uses pub/sub events for rendering updates
- Avoids layout thrashing and redundant paints

## ✅ 4. Custom Text Model (Linked-List / Deque / Gap-Buffer Inspired)

Built with:

- Doubly-linked list nodes
- Custom Deque structure
- Efficient cursor-based insert/delete
- Supports high-speed local editing
- Clean separation between text model & rendering layer

This enables:

- O(1) inserts and deletes near cursor
- Efficient navigation
- Proper undo/redo tracking
- Safe extension into distributed editing algorithms (OT/CRDT)

## ✅ 5. Cursor Engine & Selection System

Includes:

- Smart cursor movement
- Word selection
- Line selection
- Drag selection
- Keyboard navigation (Arrow keys, Shift+Arrow, Ctrl+Arrow)
- Pub/Sub notifications for cursor updates
- Support for multiple pages and wrapped lines

The cursor system is separated from:

- layout
- text model
- rendering
- input controller

## ✅ 6. Powerful Undo/Redo System (Operation-Based)

Implemented without libraries:

- InsertOperation & DeleteOperation
- History stack
- Redo stack
- Operation chaining for continuous typing
- Precise position-aware undo logic
- Works with cursor updates & multi-page layout

## ✅ 7. Command Registry + Input Controller

A clean abstraction layer for:

- Keyboard shortcuts
- Command execution
- Rebindable actions
- Arrow key handling
- Tab, Enter, Backspace, custom commands

Uses the classic Command Pattern.

## ✅ 8. Strong System Design Concepts Throughout

- Pub/Sub (Observer pattern)
- Dependency Injection (DI)
- Separation of concerns
- Clean modular architecture
- DocumentService as orchestration layer
- SOLID principles
- Layered editor-engine design

---

# 🔧 Tech Stack

- TypeScript
- HTML5 Canvas
- Custom data structures (no libraries)
- Zero external dependencies for core engine

---

# 🛠️ In Progress: Collaborative Editing Engine (OT/CRDT – From Scratch)

Including:

- Central server that serializes/transforms operations
- Custom OT or Sequence CRDT algorithm
- Per-user undo/redo
- Conflict-free merging
- Cursor syncing
- Multi-user realtime updates
- Offline-safe merging (future)
