# REST TEST

A Visual Studio Code extension for testing REST APIs directly from your editor with a clean and intuitive interface.


## Features

- **🌙 Sleek Dark Theme**: Modern dark UI with teal accent colors for comfortable API testing
- **🚀 High-Performance Interface**: Lightning-fast, optimized UI with minimal animations
- **⚡ Instant Loading**: Sub-second page load times with optimized font loading
- **📱 Responsive Design**: Clean, unified request bar layout

- **Support for Multiple HTTP Methods**: 
  - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

- **Request Configuration**:
  - Unified request bar with method selector and URL input
  - Dynamic query parameters builder with instant add/remove
  - Custom headers management
  - JSON body editor with syntax highlighting
  
- **Advanced Features**:
  - Save and manage your API requests
  - Method-specific color coding
  - Beautiful JSON response formatting with syntax highlighting
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

### Saving Requests

- Click **Save** to save the current request with a custom name
- Access saved requests from the sidebar with method-specific icons

### Response Handling

- Status code and formatted JSON response with syntax highlighting
- Clear error messages for HTTP and network errors
- Copy response data and cURL commands

## State Management

The extension automatically saves your last used method, URL, parameters, headers, body, and saved requests across VS Code sessions.

## Requirements

- Visual Studio Code version 1.60.0 or higher
- Internet connection for making API requests

## Release Notes

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