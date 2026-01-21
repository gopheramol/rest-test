# REST TEST v3.5.0 Release Notes

## 🚀 New Features

### Postman-Style Query Parameters Table
- **Checkbox Toggle** - Enable/disable individual query parameters with a single click
- **Table Layout** - Clean, structured table view with Key/Value columns like Postman
- **Visual Feedback** - Disabled params show strikethrough text and greyed styling
- **Two-way Sync** - Changes in the table update the URL and vice versa

### Auto-Detect Query Parameters from URL
- **Smart Parsing** - Automatically extracts query parameters when you paste or type a URL
- **Instant Population** - Parameters are immediately added to the table as separate rows
- **Debounced Updates** - Prevents excessive updates while typing (300ms debounce)

### UI Improvements
- **Custom Styled Checkboxes** - Beautiful checkboxes with rounded corners and blue fill when checked
- **Red Delete Button** - Clearly visible delete icon for removing parameters
- **Fixed Column Widths** - Proper alignment with 50px checkbox column, equal Key/Value columns

## 🐛 Bug Fixes
- Fixed delete button not working due to HTML structure change
- Fixed checkbox alignment in table cells
- Fixed function hoisting issues with event listeners

## 📋 How to Use

### Query Parameters
1. Add parameters using the "Add Query Parameter" button
2. Click the checkbox to enable/disable each parameter
3. Disabled parameters won't be sent with the request but remain saved

### Auto-Detect from URL
1. Paste a URL with query params: `https://api.example.com/users?page=1&limit=10`
2. Parameters are automatically extracted and added to the table
3. Edit individual values in the table as needed

---

**Full Changelog**: v3.4.0 → v3.5.0
