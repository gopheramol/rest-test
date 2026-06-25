# REST TEST

A Visual Studio Code extension for testing REST APIs directly from your editor with a clean and intuitive interface.


## Features

- **🎨 Modern Glass UI**: Sleek, glassmorphic interface with an indigo accent that **adapts to your VS Code theme** — looks great in both dark and light mode
- **🚀 High-Performance Interface**: Lightning-fast, optimized UI with minimal animations
- **📱 Responsive Design**: Clean, unified request bar layout

- **Support for Multiple HTTP Methods**:
  - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

- **REST & GraphQL**: Dedicated tabs for both REST requests and GraphQL queries/variables

- **🗂️ Collections**:
  - Organize saved requests into named collections (folders)
  - Create, rename, and delete collections from the sidebar
  - Move requests between collections via right-click or **drag & drop**
  - **Import / export Postman Collection v2.1** files

- **Request Configuration**:
  - Unified request bar with method selector and URL input
  - Dynamic query parameters builder with instant add/remove
  - Custom headers management
  - JSON body editor with syntax highlighting

- **Advanced Features**:
  - Save and manage your API requests in collections
  - Method-specific color coding
  - Beautiful JSON response formatting with syntax highlighting
  - Searchable responses with match navigation
  - Colored status pills and real request timing breakdown (DNS / TCP / TLS / transfer)
  - Request cancellation for in-flight requests
  - Comprehensive error handling with clear messages
  - Request state persistence across sessions
  - Copy response data and cURL commands
  - Response time and size metrics

## Installation

1. Open Visual Studio Code
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS)
3. Type `ext install gopher-amol.rest-test`
4. Press Enter

## Usage

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "REST TEST" and select it
3. The REST TEST interface will open in a new tab

### Making Requests

1. **Select HTTP Method**: Choose from the dropdown (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
2. **Enter URL**: Input the full URL of your API endpoint
3. **Add Query Parameters** (Optional): Click "Add Query Parameter" and enter key-value pairs
4. **Add Headers** (Optional): Click "Add Header" and enter key-value pairs
5. **Add Request Body** (Optional): Enter valid JSON in the body textarea (POST, PUT, PATCH)
6. **Send Request**: Click "Send" and view the response below

### Saving Requests & Collections

- Click **Save** to save the current request — choose an existing collection or create a new one in the dialog
- Access saved requests from the sidebar, grouped under their collections with method-specific icons
- Use the **New Collection** button in the sidebar title bar to add a collection
- **Right-click** a collection to rename, delete, or export it; right-click a request to move or delete it
- **Drag & drop** requests between collections (or reorder within one)

### Importing & Exporting (Postman)

- **Import**: click the **Import Postman Collection** button in the sidebar title bar and pick a `*.json` Postman Collection v2.1 file — it's added as a new collection
- **Export**: right-click a collection → **Export as Postman Collection** to save it as a Postman v2.1 `.json` file

### Response Handling

- Status code and formatted JSON response with syntax highlighting
- Clear error messages for HTTP and network errors
- Copy response data and cURL commands

## State Management

The extension automatically saves your last used method, URL, parameters, headers, body, and saved requests across VS Code sessions.

## Requirements

- Visual Studio Code version 1.67.0 or higher
- Internet connection for making API requests

## Release Notes

### [4.1.x] - 2026-06-25

#### 🗂️ Collections + Theme-Adaptive Glass UI

### Added
- **Collections**: organize saved requests into named collections (folders); create, rename, delete
- **Drag & drop**: move requests between collections and reorder them
- **Postman v2.1 import/export**: bring collections in from Postman or export them out
- **Modern glass UI** that adapts to the active VS Code theme (dark *and* light)
- Searchable responses with match navigation, colored status pills, and a real timing breakdown

### Changed
- Accent color refreshed to **indigo**, with surfaces driven by VS Code theme tokens
- Existing saved requests are automatically migrated into a "Default" collection
- Minimum VS Code version raised to 1.67.0 (required for tree drag & drop)

### [4.0.0] - 2026-02-23

#### 🌙 Complete Dark Theme UI Overhaul

### Added
- **🎨 Dark theme**: New sleek dark UI with teal (#00d4aa) accent colors
- **📐 Unified request bar**: Method selector and URL input merged into a single dark, rounded bar
- **🏷️ Pill-style tabs**: Clean uppercase tab labels (Params, Headers, Body)

### Changed
- **Color palette**: Migrated from Postman-inspired orange (#FF6C37) to modern dark theme with teal accents
- **CSS architecture**: Removed ~70 unused CSS variables for a leaner, faster stylesheet
- **Animations**: Stripped heavy animations (typewriter, morph, slideUpFade) — kept only essential fade-in and spin
- **Tab switching**: Instant tab switching replacing animated transitions
- **Tab labels**: Simplified from icon+text to clean text-only labels
- **Typography**: Streamlined font stack
- **Transitions**: Performance-optimized with specific property targeting instead of `all`

### Removed
- Removed unused glassmorphism effects, gradient cards, and complex shadow hierarchy
- Removed decorative animations that impacted performance
- Removed redundant spacing and radius variables

### [3.2.0] - 2025-06-11

#### 🚀 Major Performance Optimization Release

- Lightning-fast loading (80% faster page load times)
- Precise hover effects with proper z-index hierarchy
- Performance metrics, response time and size tracking
- Copy response data and cURL commands
- 50% reduction in CSS complexity with hardware acceleration

### [2.8.4] - 2024-03-14

### Added
- Save and manage API requests with custom names
- Method-specific icons for saved requests
- Improved JSON response formatting with syntax highlighting
- Visual indicators for different HTTP methods

### Changed
- Updated sidebar interface with new icons
- Improved JSON response display
- Better organization of saved requests

### Fixed
- Fixed JSON formatting issues
- Improved response readability

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

**Enjoy testing your REST APIs with REST TEST!**