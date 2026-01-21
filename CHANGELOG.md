# Changelog

All notable changes to the "REST TEST" extension will be documented in this file.

## [3.5.0] - 2026-01-21

### Added
- **Query Parameter Checkboxes**: Enable/disable individual params like Postman
- **Auto-Detect Query Params**: Automatically parse params from pasted URLs
- **Postman-Style Table Layout**: Clean table design with Key/Value columns

### Improved
- Custom styled checkboxes with blue fill and white checkmark
- Red delete button for better visibility
- Fixed column alignment in parameter tables

### Fixed
- Delete button functionality in new table structure
- Checkbox alignment in table cells

## [3.3.0] - 2025-11-20


### Added
- **GraphQL Support**: Full GraphQL query and mutation support
  - GraphQL endpoint URL input
  - Query editor with syntax highlighting
  - Variables support with JSON editor
  - Headers management for GraphQL requests
  - Dedicated GraphQL tab with Query/Variables/Headers sections

### Changed
- **UI Redesign**: Complete UI overhaul with Postman-inspired professional design
  - Clean, minimal interface with professional gray color scheme
  - Postman's signature orange (#FF6C37) as primary accent color
  - Underline tab navigation (REST/GraphQL switcher)
  - Cleaner card design with subtle shadows
  - Removed decorative elements for faster loading

### Improved
- **Performance Optimizations**:
  - Removed external font imports (Google Fonts) - now uses system fonts
  - Faster transitions (0.08-0.15s instead of 0.12-0.3s)
  - Removed slow animations (slideIn, scaleIn, bounceIn, pulse, shimmer, glow)
  - Instant tab switching with no animation delays
  - Faster page load and rendering

- **UI Enhancements**:
  - Removed link icons from URL input fields
  - Better alignment and responsive design
  - Cleaner, more professional appearance
  - Improved visual hierarchy

### Technical
- Updated color palette to match Postman's professional aesthetic
- Optimized CSS for faster rendering
- Removed unnecessary animations and decorative effects
- Improved state management for GraphQL requests

## [3.2.0] - Previous Version

### Features
- REST API testing with multiple HTTP methods
- Request saving and management
- Response formatting and display
- Headers and query parameters support
- Copy as cURL functionality

---

## Migration Notes

### From 3.2.0 to 3.3.0
- No breaking changes
- All existing saved requests will continue to work
- New GraphQL functionality is additive
- UI changes are visual only, no functional impact