# REST TEST

A Visual Studio Code extension for testing REST APIs directly from your editor with a clean and intuitive interface.


## Features

- **Simple and Intuitive Interface**: Clean, user-friendly interface for making HTTP requests
- **Support for Multiple HTTP Methods**: 
  - GET
  - POST
  - PUT
  - DELETE
  - PATCH

- **Request Configuration**:
  - URL input with validation
  - Query parameters builder
  - Custom headers management
  - JSON body editor
  
- **Advanced Features**:
  - Save and manage your API requests
  - Method-specific icons for easy identification
  - JSON response formatting with syntax highlighting
  - Error handling with clear messages
  - Request state persistence across sessions
  - Real-time request status updates

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

1. **Select HTTP Method**:
   - Choose from the dropdown: GET, POST, PUT, DELETE, or PATCH

2. **Enter URL**:
   - Input the full URL of your API endpoint
   - The extension validates the URL format

3. **Add Query Parameters** (Optional):
   - Click "Add Query Parameter"
   - Enter key-value pairs
   - Parameters are automatically appended to the URL

4. **Add Headers** (Optional):
   - Click "Add Header"
   - Enter key-value pairs for custom headers
   - Common headers like Content-Type are supported

5. **Add Request Body** (Optional):
   - For POST, PUT, and PATCH requests
   - Enter valid JSON in the body textarea
   - JSON validation is performed before sending

6. **Send Request**:
   - Click the "Send Request" button
   - View the response in the panel below

### Saving Requests

1. **Save Current Request**:
   - Click the "Save" button
   - Enter a name for your request
   - The request will appear in the "Saved Requests" section

2. **Using Saved Requests**:
   - Access saved requests from the sidebar
   - Each request shows with a method-specific icon
   - Click to load and execute the saved request

### Response Handling

- **Success Responses**:
  - Status code and status text displayed
  - Response body formatted as pretty JSON
  - Syntax highlighting for different JSON types
  - Easy to read color-coded display

- **Error Responses**:
  - Clear error messages
  - HTTP error status codes
  - Network error handling
  - JSON parsing error detection

## State Management

The extension automatically saves:
- Last used HTTP method
- Previous URL
- Query parameters
- Headers
- Request body
- Saved requests with custom names

This state persists across VS Code sessions for convenience.

## Requirements

- Visual Studio Code version 1.95.0 or higher
- Internet connection for making API requests

## Extension Settings

## Release Notes

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