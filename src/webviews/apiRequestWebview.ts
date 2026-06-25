/**
 * Generates HTML content for the API request webview
 */
export function getWebviewContent(
  initialState: any,
  iconCssUri?: string,
  collections: { id: string; name: string }[] = [],
  currentCollectionId?: string
): string {
  // Escape user-supplied collection names before interpolating into HTML.
  const escapeForAttr = (s: string) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Prefer the locally-bundled icon font (always available, even with a strict
  // CSP or no network); fall back to the CDN if no webview URI was provided.
  const iconStylesheet = iconCssUri
    ? `<link href="${iconCssUri}" rel="stylesheet">`
    : `<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
      <noscript><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></noscript>`;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>REST API Tester</title>
      ${iconStylesheet}
      <style>
        :root {
          /* ===== Adaptive base — driven by VS Code theme tokens, hex fallback ===== */
          --bg: var(--vscode-editor-background, #0d1117);
          --surface: var(--vscode-editorWidget-background, #161b22);
          --surface-2: var(--vscode-list-hoverBackground, #21262d);
          --fg: var(--vscode-editor-foreground, #e6edf3);
          --fg-soft: var(--vscode-foreground, #c9d1d9);
          --fg-muted: var(--vscode-descriptionForeground, #8b949e);
          --fg-subtle: var(--vscode-disabledForeground, #6e7681);
          --border: var(--vscode-widget-border, var(--vscode-panel-border, #30363d));
          --border-strong: var(--vscode-contrastBorder, #484f58);
          --input-bg: var(--vscode-input-background, #0d1117);
          --input-fg: var(--vscode-input-foreground, #e6edf3);

          /* ===== Branded accent + vibrant layer ===== */
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --primary-light: #818cf8;
          --accent: #6366f1;
          --accent-soft: rgba(99, 102, 241, 0.16);
          --accent-glow: rgba(99, 102, 241, 0.34);
          --success: #3fb950;
          --error: #f85149;
          --error-dark: #da3633;
          --warning: #d29922;
          --info: #58a6ff;

          /* Gray Scale (kept for any legacy refs) */
          --gray-200: var(--border);
          --gray-300: var(--border);
          --gray-400: var(--border-strong);
          --gray-500: var(--fg-subtle);
          --gray-600: var(--fg-muted);

          /* ===== Glass / depth ===== */
          --glass-bg: rgba(255, 255, 255, 0.035);
          --glass-bg-strong: rgba(255, 255, 255, 0.05);
          --glass-blur: 16px;
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
          --ambient: radial-gradient(900px 500px at 12% -8%, rgba(99, 102, 241, 0.12), transparent 60%),
                     radial-gradient(800px 480px at 100% 0%, rgba(129, 140, 248, 0.09), transparent 55%);

          /* ===== JSON syntax (light-aware, overridden under vscode-light) ===== */
          --syn-key: #7ee787;
          --syn-string: #a5d6ff;
          --syn-number: #79c0ff;
          --syn-bool: #ff7b72;
          --syn-null: #ff7b72;

          /* Method Colors */
          --method-get: #00d4aa;
          --method-post: #58a6ff;
          --method-put: #d29922;
          --method-delete: #f85149;
          --method-patch: #bc8cff;
          --method-head: #39d2c0;
          --method-options: #8b949e;

          /* Gradients */
          --gradient-primary: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          --gradient-success: linear-gradient(135deg, #3fb950 0%, #2ea043 100%);
          --gradient-error: linear-gradient(135deg, #f85149 0%, #da3633 100%);

          /* Shadows */
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
          --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.4);
          --shadow-2xl: 0 16px 48px rgba(0, 0, 0, 0.5);

          /* Border Radius */
          --radius-sm: 6px;
          --radius: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;
          --radius-full: 9999px;
          
          /* Performance-optimized Transitions */
          --transition-fast: color 0.08s ease, background-color 0.08s ease;
          --transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          
          /* Typography */
          --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          
          /* Spacing */
          --space-1: 0.25rem;
          --space-2: 0.5rem;
          --space-3: 0.75rem;
          --space-4: 1rem;
          --space-5: 1.25rem;
          --space-6: 1.5rem;
          --space-8: 2rem;
          --space-10: 2.5rem;
          --space-16: 4rem;
        }

        /* ===== Light / high-contrast-light: tone the vibrant layer down for legibility ===== */
        body.vscode-light,
        body.vscode-high-contrast-light {
          --accent: #4f46e5;
          --accent-soft: rgba(79, 70, 229, 0.13);
          --accent-glow: rgba(79, 70, 229, 0.24);
          --glass-bg: rgba(0, 0, 0, 0.025);
          --glass-bg-strong: rgba(0, 0, 0, 0.04);
          --glass-blur: 10px;
          --glass-border: rgba(0, 0, 0, 0.08);
          --glass-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
          --ambient: radial-gradient(900px 500px at 12% -8%, rgba(99, 102, 241, 0.09), transparent 60%),
                     radial-gradient(800px 480px at 100% 0%, rgba(129, 140, 248, 0.07), transparent 55%);
          /* Syntax tuned for a light editor background */
          --syn-key: #116329;
          --syn-string: #0a3069;
          --syn-number: #0550ae;
          --syn-bool: #cf222e;
          --syn-null: #cf222e;
        }

        /* Minimal Fast Animations Only */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Theme-adaptive body with a fixed ambient vibrant glow */
        body {
          font-family: var(--font-family);
          line-height: 1.5;
          background: var(--bg);
          color: var(--fg);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0;
          padding: 0;
        }

        /* Ambient gradient sits behind everything, doesn't scroll, doesn't capture clicks */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: var(--ambient);
          pointer-events: none;
          z-index: 0;
        }
        .main-container,
        #responseContainer {
          position: relative;
          z-index: 1;
        }

        /* Main Container */
        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-5);
          position: relative;
        }

        /* Dark Request Card */
        .request-card {
          background: transparent;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 0;
          border: none;
          transition: var(--transition);
        }

        .request-card:hover {
          box-shadow: none;
        }

        .card-header {
          display: none;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--fg);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .card-title .material-icons {
          color: var(--primary);
          font-size: 1.25rem;
        }

        .card-description {
          color: var(--fg-muted);
          font-size: 1rem;
          font-weight: 400;
        }

        /* Request Row */
        .request-row {
          display: flex;
          gap: var(--space-3);
          padding: 0;
          align-items: center;
          margin-bottom: var(--space-5);
        }

        /* Unified dark bar containing method + url */
        .request-bar {
          display: flex;
          align-items: center;
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          height: 48px;
          box-shadow: var(--glass-shadow);
          transition: var(--transition);
        }

        .request-bar:focus-within {
          border-color: var(--accent);
          box-shadow: var(--glass-shadow), 0 0 0 3px var(--accent-soft);
        }

        @media (max-width: 768px) {
          .request-row {
            grid-template-columns: 1fr;
            gap: var(--space-3);
          }
        }

        /* Dark Method Select — inside the unified bar */
        .method-select {
          height: 100%;
          font-weight: 700;
          font-size: 0.8125rem;
          cursor: pointer;
          background: transparent !important;
          color: var(--method-get) !important;
          border: none;
          border-right: 1px solid var(--border);
          text-align: center;
          border-radius: 0;
          box-shadow: none;
          padding: 0 var(--space-2) 0 var(--space-4);
          text-align-last: center;
          transition: var(--transition);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e7681' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 6px center !important;
          background-size: 12px !important;
          padding-right: 24px !important;
          position: relative;
          overflow: hidden;
          min-width: 80px;
          flex-shrink: 0;
        }

        /* Method-specific text colors */
        .method-select[value="GET"] {
          color: var(--method-get) !important;
        }

        .method-select[value="POST"] {
          color: var(--method-post) !important;
        }

        .method-select[value="PUT"] {
          color: var(--method-put) !important;
        }

        .method-select[value="DELETE"] {
          color: var(--method-delete) !important;
        }

        .method-select[value="PATCH"] {
          color: var(--method-patch) !important;
        }

        .method-select[value="HEAD"] {
          color: var(--method-head) !important;
        }

        .method-select[value="OPTIONS"] {
          color: var(--method-options) !important;
        }

        .method-select:hover {
          background: var(--surface-2) !important;
        }

        .method-select:focus {
          outline: none;
        }

        .method-select:active {
          transform: none;
        }

        /* Dropdown options */
        .method-select option {
          background: var(--surface) !important;
          color: var(--fg) !important;
          font-weight: 700;
          padding: var(--space-3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          font-size: 0.8125rem;
        }

        .method-select option:checked {
          background: var(--surface-2) !important;
        }

        /* Dark URL Input */
        .url-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .url-input-icon {
          position: absolute;
          left: var(--space-4);
          color: var(--border-strong);
          font-size: 1.125rem;
          pointer-events: none;
          transition: var(--transition);
          z-index: 1;
        }

        .url-input:focus + .url-input-icon,
        .url-input-wrapper:hover .url-input-icon {
          color: var(--primary);
        }

        .url-input {
          width: 100%;
          height: 100%;
          padding: 0 var(--space-4);
          border: none;
          border-radius: 0;
          background: transparent;
          color: var(--fg);
          font-size: 0.875rem;
          font-family: var(--font-mono);
          transition: var(--transition);
          position: relative;
          box-shadow: none;
          flex: 1;
        }

        .url-input:hover {
          background: transparent;
          transform: none;
          box-shadow: none;
        }

        .url-input:focus {
          outline: none;
          background: transparent;
          box-shadow: none;
        }

        .url-input::placeholder {
          color: var(--border-strong);
          font-style: normal;
          font-weight: 400;
          transition: var(--transition);
        }

        .url-input:focus::placeholder {
          color: var(--border);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }

        @media (max-width: 768px) {
          .action-buttons {
            justify-content: stretch;
          }
          
          .action-buttons > * {
            flex: 1;
          }
        }

        /* Dark Professional Buttons */
        .send-button,
        .save-button {
          height: 46px;
          padding: 0 var(--space-8);
          border: none;
          border-radius: var(--radius-xl);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          box-shadow: none;
          position: relative;
          overflow: hidden;
          min-width: 90px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
        }


        .send-button {
          background: var(--gradient-primary);
          color: #ffffff;
          box-shadow: 0 4px 16px var(--accent-glow);
        }

        .send-button:hover {
          box-shadow: 0 6px 22px var(--accent-glow), 0 0 0 1px var(--accent);
          transform: translateY(-1px);
        }

        .send-button:active {
          transform: scale(0.97);
          box-shadow: 0 2px 10px var(--accent-glow);
        }

        .send-button.is-cancelling {
          background: var(--error);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(248, 81, 73, 0.3);
        }

        .send-button.is-cancelling:hover {
          background: var(--error-dark);
          box-shadow: 0 6px 22px rgba(248, 81, 73, 0.35);
        }

        .send-button .material-icons {
          display: none;
        }

        .save-button {
          background: var(--glass-bg-strong);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          color: var(--fg-muted);
          border: 1px solid var(--glass-border);
        }

        .save-button:hover {
          color: var(--accent);
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        .save-button:active {
          transform: scale(0.98);
          transition: var(--transition-fast);
        }

        .save-button .material-icons {
          transition: var(--transition);
        }

        .send-button:disabled,
        .save-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .send-button:disabled:hover,
        .save-button:disabled:hover {
          transform: none;
        }

        /* Enhanced Loading State */
        .send-button.loading,
        .save-button.loading {
          pointer-events: none;
          background: var(--gray-400);
          position: relative;
        }

        .send-button.loading .material-icons,
        .save-button.loading .material-icons {
          animation: spin 1s linear infinite;
        }

        /* Glass tab strip — top of the request card */
        .tabs {
          display: flex;
          background: var(--glass-bg);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          padding: 0 var(--space-2);
          margin: var(--space-5) 0 0 0;
          border: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--border);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          gap: 0;
          position: relative;
        }

        .tab {
          flex: none;
          padding: var(--space-3) var(--space-5);
          background: transparent;
          color: var(--fg-muted);
          border: none;
          border-radius: 0;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.75rem;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab:hover {
          color: var(--fg);
        }

        .tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
          text-shadow: 0 0 12px var(--accent-soft);
        }

        .tab .material-icons {
          display: none;
        }


        /* Glass tab content — body of the request card, merges with .tabs above */
        .tab-content {
          padding: var(--space-5);
          background: var(--glass-bg);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-top: none;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          box-shadow: var(--glass-shadow);
        }

        .content-section {
          display: none;
        }

        .content-section.active {
          display: block;
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Dark Parameter Rows */
        .param-table {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--surface-2);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-4);
          background: var(--bg);
        }

        .param-table-header {
          display: grid;
          grid-template-columns: 50px 1fr 1fr 50px;
          gap: 0;
          background: var(--surface);
          border-bottom: 1px solid var(--surface-2);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .param-table-header span {
          padding: var(--space-3) var(--space-4);
          border-right: 1px solid var(--surface-2);
        }

        .param-table-header span:last-child {
          border-right: none;
        }

        .param-rows {
          display: flex;
          flex-direction: column;
        }

        .param-row {
          display: grid;
          grid-template-columns: 50px 1fr 1fr 50px;
          gap: 0;
          align-items: center;
          background: var(--bg);
          border-bottom: 1px solid var(--surface-2);
          transition: var(--transition);
          position: relative;
        }

        .param-row:last-child {
          border-bottom: none;
        }

        .param-row:hover {
          background: var(--surface);
          border-left: 2px solid var(--primary);
          padding-left: calc(var(--space-4) - 2px);
        }

        .param-row.disabled {
          background: var(--bg);
          opacity: 0.5;
        }

        .param-row.disabled input[type="text"] {
          color: var(--border-strong);
          text-decoration: line-through;
        }

        .param-row > * {
          padding: var(--space-3) var(--space-4);
          border-right: 1px solid var(--surface-2);
          height: 100%;
          display: flex;
          align-items: center;
        }

        .param-row > *:last-child {
          border-right: none;
          justify-content: center;
        }

        .param-checkbox-wrapper {
          justify-content: center;
          display: flex;
          align-items: center;
          min-height: 44px;
        }


        /* Dark checkbox */
        .param-checkbox {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          min-width: 20px;
          min-height: 20px;
          max-width: 20px;
          max-height: 20px;
          flex-shrink: 0;
          border: 2px solid var(--border);
          border-radius: 4px;
          background: var(--bg);
          cursor: pointer;
          margin: 0;
          position: relative;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .param-checkbox:hover {
          border-color: var(--primary);
        }

        .param-checkbox:checked {
          background: var(--primary);
          border-color: var(--primary);
        }

        .param-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 1px;
          width: 5px;
          height: 10px;
          border: solid var(--bg);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .param-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.2);
        }




        .param-row input[type="text"] {
          width: 100%;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--fg);
          font-size: 0.875rem;
          font-family: var(--font-family);
          transition: var(--transition);
        }

        .param-row input[type="text"]:focus {
          outline: none;
        }

        .param-row input[type="text"]::placeholder {
          color: var(--border-strong);
          font-weight: 400;
        }


        .param-input-cell {
          flex: 1;
        }

        .param-action-cell {
          width: 40px;
          padding: var(--space-2) !important;
        }

        .remove-param-button {
          width: 28px;
          height: 28px;
          background: transparent;
          color: var(--error);
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .remove-param-button:hover {
          background: var(--error);
          color: white;
        }

        .remove-param-button:active {
          transform: scale(0.95);
        }


        .remove-param-button .material-icons {
          font-size: 1rem;
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }

        .remove-param-button:hover .material-icons {
          transform: scale(1.2);
        }

        /* Dark Add Parameter Button */
        .add-param-button {
          width: 100%;
          padding: var(--space-3);
          background: transparent;
          color: var(--border-strong);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.8125rem;
          position: relative;
          overflow: hidden;
        }

        .add-param-button:hover {
          background: var(--surface);
          border-color: var(--primary);
          color: var(--primary);
          border-style: solid;
        }





        /* Code Textarea */
        textarea {
          width: 100%;
          min-height: 200px;
          padding: var(--space-4);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--input-bg);
          color: var(--input-fg);
          font-size: 0.875rem;
          font-family: var(--font-mono);
          line-height: 1.6;
          transition: var(--transition);
          resize: vertical;
          box-shadow: none;
        }

        textarea:hover {
          border-color: var(--border-strong);
          box-shadow: none;
          transform: none;
        }

        textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
          transform: none;
        }

        textarea::placeholder {
          color: var(--border-strong);
          font-style: normal;
          transition: var(--transition);
        }

        textarea:focus::placeholder {
          color: var(--border);
        }

        /* Glass Response Container */
        .response-container {
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          box-shadow: var(--glass-shadow);
          overflow: hidden;
          border: 1px solid var(--glass-border);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          transition: var(--transition);
          margin-top: var(--space-5);
        }

        .response-container:hover {
          box-shadow: var(--glass-shadow);
        }

        /* Accent edge that reflects response status */
        .response-container.response-success { border-top: 2px solid var(--success); }
        .response-container.response-error { border-top: 2px solid var(--error); }
        .response-container.response-warning { border-top: 2px solid var(--warning); }

        .response-container.response-success {
          border-left: none;
        }

        .response-container.response-error {
          border-left: none;
        }

        .response-container.response-warning {
          border-left: none;
        }

        /* Dark Response Header */
        .response-header {
          padding: var(--space-4) var(--space-5);
          background: var(--surface);
          border-bottom: 1px solid var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .response-status {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        /* Colored status pill for the response status code */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1.4;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .status-pill .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }
        .status-pill.success { color: var(--success); background: rgba(63, 185, 80, 0.12); border-color: rgba(63, 185, 80, 0.35); }
        .status-pill.redirect { color: var(--info); background: rgba(88, 166, 255, 0.12); border-color: rgba(88, 166, 255, 0.35); }
        .status-pill.warning { color: var(--warning); background: rgba(210, 153, 34, 0.12); border-color: rgba(210, 153, 34, 0.35); }
        .status-pill.error { color: var(--error); background: rgba(248, 81, 73, 0.12); border-color: rgba(248, 81, 73, 0.35); }
        .status-text { color: var(--fg-soft); font-weight: 500; margin-left: var(--space-2); }

        /* While empty, hide the response chrome and show only the placeholder */
        .response-container.is-empty .response-header,
        .response-container.is-empty .response-tabs,
        .response-container.is-empty .response-controls,
        .response-container.is-empty #response-headers-section,
        .response-container.is-empty #response-timing-section {
          display: none;
        }

        /* Empty state shown before the first request */
        .response-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: 3rem 1.5rem;
          color: var(--fg-subtle);
          text-align: center;
        }
        .response-empty .material-icons {
          font-size: 2.75rem;
          opacity: 0.5;
        }
        .response-empty .response-empty-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--fg-muted);
        }
        .response-empty .response-empty-hint {
          font-size: 0.8125rem;
        }

        .response-time,
        .response-size {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.8125rem;
          color: var(--fg-muted);
          font-weight: 500;
        }

        .response-time .material-icons,
        .response-size .material-icons {
          font-size: 0.875rem;
          color: var(--fg-subtle);
        }

        /* Dark Response Tabs */
        .response-tabs {
          display: flex;
          background: transparent;
          border-bottom: 1px solid var(--surface-2);
          padding: 0;
          margin: 0;
          gap: 0;
          border-radius: 0;
        }

        .response-tab {
          flex: none;
          padding: var(--space-3) var(--space-4);
          background: transparent;
          color: var(--fg-muted);
          border: none;
          border-radius: 0;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.8125rem;
          position: relative;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .response-tab:hover {
          color: var(--fg);
          background: transparent;
        }

        .response-tab.active {
          background: transparent;
          color: var(--accent);
          box-shadow: none;
          font-weight: 600;
          border-bottom-color: var(--accent);
          text-shadow: 0 0 12px var(--accent-soft);
        }

        .response-tab.active::after {
          display: none;
        }

        .response-tab-badge {
          background: var(--border);
          color: var(--fg-muted);
          font-size: 0.7rem;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-weight: 600;
          min-width: 20px;
          text-align: center;
          margin-left: var(--space-1);
        }

        .response-tab.active .response-tab-badge {
          background: var(--primary);
          color: var(--bg);
        }

        /* Response Content */
        .response-content {
          position: relative;
        }

        .response-section {
          display: none;
          min-height: 200px;
        }

        .response-section.active {
          display: block;
          animation: fadeIn 0.2s ease-in-out;
        }

        /* Dark Response Body */
        .response-body {
          padding: var(--space-5);
          padding-left: var(--space-8);
          background: var(--bg);
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.7;
          white-space: pre-wrap;
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
          position: relative;
          border-radius: 0;
          color: var(--fg);
          border-left: 3px solid var(--surface-2);
        }

        /* Dark Response Headers Table */
        .headers-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg);
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          margin: 0;
          width: 100%;
        }

        .headers-table th,
        .headers-table td {
          padding: var(--space-3) var(--space-5);
          text-align: left;
          border-bottom: 1px solid var(--surface-2);
          font-size: 0.8125rem;
        }

        .headers-table th {
          background: var(--surface);
          font-weight: 600;
          color: var(--fg-muted);
          letter-spacing: 0.025em;
          text-transform: uppercase;
          font-size: 0.7rem;
        }

        .headers-table td {
          color: var(--fg-soft);
          font-family: var(--font-mono);
          font-weight: 500;
        }

        .headers-table td:first-child {
          font-weight: 600;
          color: var(--primary);
        }

        .headers-table tr:last-child td {
          border-bottom: none;
        }

        .headers-table tr:hover {
          background: var(--surface);
        }

        /* Dark Response Controls */
        .response-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-5);
          background: var(--surface);
          border-bottom: 1px solid var(--surface-2);
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .response-search {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          max-width: 360px;
          position: relative;
        }

        /* Only the leading search glyph is absolutely positioned, not the
           nav-button icons (which are grandchildren). */
        .response-search > .material-icons:first-child {
          position: absolute;
          left: var(--space-3);
          color: var(--border-strong);
          font-size: 1rem;
          pointer-events: none;
          z-index: 1;
        }

        .response-search input {
          flex: 1;
          min-width: 0;
          padding: var(--space-2) var(--space-3) var(--space-2) var(--space-10);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.8125rem;
          background: var(--bg);
          color: var(--fg);
          transition: var(--transition);
        }

        .search-count {
          font-size: 0.75rem;
          color: var(--fg-muted);
          white-space: nowrap;
          min-width: 34px;
          text-align: right;
        }

        .search-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--fg-muted);
          cursor: pointer;
          transition: var(--transition);
        }
        .search-nav-btn:hover:not(:disabled) {
          background: var(--surface-2);
          color: var(--fg);
        }
        .search-nav-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .search-nav-btn .material-icons {
          font-size: 1rem;
        }

        mark.search-highlight {
          background: #ffd54f;
          color: #000;
          border-radius: 2px;
        }
        mark.search-highlight.current {
          background: #ff9800;
          box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.4);
        }

        .response-search input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--bg);
          box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.1);
        }

        .response-options {
          display: flex;
          gap: 0;
          align-items: center;
          background: var(--surface-2);
          padding: 2px;
          border-radius: var(--radius);
        }

        .response-option-btn {
          padding: var(--space-2) var(--space-4);
          background: transparent;
          color: var(--fg-muted);
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .response-option-btn:hover {
          background: var(--border);
          color: var(--fg);
          box-shadow: none;
        }

        .response-option-btn.active {
          background: var(--border);
          color: var(--fg);
          box-shadow: none;
          font-weight: 600;
        }

        .response-option-btn .material-icons {
          font-size: 0.875rem;
          display: none;
        }

        /* Dark Button Group */
        .button-group {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }

        .copy-button,
        .copy-as-curl {
          width: 36px;
          height: 36px;
          background: var(--surface-2);
          color: var(--fg-muted);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: none;
          position: relative;
          overflow: hidden;
        }


        .copy-button:hover,
        .copy-as-curl:hover {
          background: var(--border);
          color: var(--fg);
          transform: none;
          box-shadow: none;
          border-color: var(--border-strong);
        }

        .copy-button.success,
        .copy-as-curl.success {
          background: var(--primary);
          color: var(--bg);
          border-color: var(--primary);
        }

        .copy-button .material-icons,
        .copy-as-curl .material-icons {
          font-size: 1rem;
        }

        /* Dark Status Indicators */
        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .status-success {
          background: rgba(0, 212, 170, 0.1);
          color: var(--success);
          border: 1px solid rgba(0, 212, 170, 0.2);
        }

        .status-error {
          background: rgba(248, 81, 73, 0.1);
          color: var(--error);
          border: 1px solid rgba(248, 81, 73, 0.2);
        }

        .status-warning {
          background: rgba(210, 153, 34, 0.1);
          color: var(--warning);
          border: 1px solid rgba(210, 153, 34, 0.2);
        }

        /* Enhanced Loading Animation */
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-16);
          color: var(--gray-500);
          gap: var(--space-4);
          flex-direction: column;
          background: var(--gray-25);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          line-height: 1.5;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Professional Copy Feedback */
        .copy-feedback {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          background: var(--gradient-success);
          color: white;
          padding: var(--space-4) var(--space-6);
          border-radius: var(--radius-xl);
          animation: slideInFade 3s ease-in-out;
          pointer-events: none;
          z-index: 1000;
          box-shadow: var(--shadow-2xl);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-weight: 600;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
        }

        @keyframes slideInFade {
          0% { transform: translateY(100px) scale(0.8); opacity: 0; }
          15%, 85% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
        }

        /* Dark JSON Styling */
        .json-container {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.7;
          white-space: pre;
          padding: var(--space-5);
          background: var(--bg);
          border-radius: 0;
          overflow-x: auto;
          border: none;
          position: relative;
          box-shadow: none;
        }

        .json-string { color: var(--syn-string); font-weight: 500; }
        .json-number { color: var(--syn-number); font-weight: 600; }
        .json-boolean { color: var(--syn-bool); font-weight: 600; }
        .json-null { color: var(--fg-muted); font-style: italic; }
        .json-bracket { color: var(--fg-muted); font-weight: 600; }
        .json-key { color: var(--syn-key); font-weight: 600; }

        /* Dark Save Dialog */
        .save-dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: var(--transition);
          backdrop-filter: blur(8px);
        }

        .save-dialog.active {
          opacity: 1;
          pointer-events: auto;
        }

        .save-dialog-content {
          background: var(--surface);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          width: 540px;
          max-width: 90%;
          box-shadow: var(--shadow-2xl);
          transform: translateY(-30px) scale(0.95);
          transition: var(--transition);
          border: 1px solid var(--border);
        }

        .save-dialog.active .save-dialog-content {
          transform: translateY(0) scale(1);
        }

        .save-dialog-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--fg);
          letter-spacing: -0.025em;
        }

        .save-dialog-title .material-icons {
          color: var(--primary);
          font-size: 1.5rem;
        }

        .save-dialog-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .dialog-select {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--input-bg);
          color: var(--input-fg);
          font-size: 0.875rem;
          font-family: var(--font-family);
          cursor: pointer;
          transition: var(--transition);
        }
        .dialog-select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          margin-top: var(--space-6);
        }

        .dialog-button {
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-lg);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          transition: var(--transition);
          border: none;
          font-size: 0.875rem;
          min-height: 42px;
        }

        .dialog-cancel {
          background: var(--surface-2);
          color: var(--fg-muted);
          border: 1px solid var(--border);
        }

        .dialog-cancel:hover {
          background: var(--border);
          color: var(--fg);
          transform: none;
          box-shadow: none;
        }

        .dialog-save {
          background: var(--primary);
          color: var(--bg);
        }

        .dialog-save:hover {
          background: var(--primary-light);
          transform: none;
          box-shadow: 0 0 12px rgba(0, 212, 170, 0.2);
        }

        /* Professional Timing Breakdown */
        .timing-breakdown {
          padding: var(--space-6);
        }

        .timing-breakdown h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .timing-breakdown h4 .material-icons {
          color: var(--primary);
            font-size: 1.25rem;
          }

        .timing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3);
          background: var(--bg);
          border: 1px solid var(--surface-2);
          border-radius: var(--radius);
          margin-bottom: var(--space-2);
          transition: var(--transition);
        }

        .timing-item:hover {
          border-color: var(--border);
          box-shadow: none;
        }

        .timing-item:last-child {
          margin-bottom: 0;
          border-color: var(--primary);
          background: rgba(0, 212, 170, 0.05);
        }

        .timing-label {
          font-weight: 500;
          color: var(--gray-700);
          font-size: 0.875rem;
        }

        .timing-value {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--primary);
          font-size: 0.875rem;
        }

        /* Mobile Responsive Enhancements */
        @media (max-width: 1200px) {
          .main-container {
            max-width: 100%;
            padding: 0 var(--space-3) var(--space-6);
          }
          
          .header {
            padding: var(--space-5) var(--space-3);
            margin-bottom: var(--space-6);
          }
          
          .request-card {
            border-radius: var(--radius-xl);
          }
          
          .card-header {
            padding: var(--space-5);
          }
          
          .request-row {
            padding: var(--space-5);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: var(--space-4);
          }

          .header-actions {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .response-controls {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }

          .response-search {
            max-width: none;
          }
          
          .response-options {
            justify-content: center;
          }
          
          .button-group {
            justify-content: center;
          }

          .tabs {
            margin: 0 var(--space-3);
            padding: var(--space-1);
          }
          
          .response-tabs {
            margin: 0 var(--space-3);
            padding: var(--space-1);
          }
          
          .tab,
          .response-tab {
            padding: var(--space-3) var(--space-2);
            font-size: 0.8125rem;
          }

          .save-dialog-content {
            padding: var(--space-6);
            width: 95%;
          }

          .dialog-actions {
            flex-direction: column-reverse;
            gap: var(--space-3);
          }

          .dialog-button {
            width: 100%;
            justify-content: center;
          }
        }

        /* Dark Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: var(--bg);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--border-strong);
        }

        /* Focus Styles */
        *:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        /* Dark Collapsible JSON */
        .json-collapsible {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.6;
          padding: 1.5rem;
          background: var(--bg);
          border-radius: 0;
          overflow-x: auto;
          border: none;
          position: relative;
        }

        .json-container {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.5;
          background: var(--bg);
          border: none;
          border-radius: 0;
          padding: 1rem;
          overflow-x: auto;
          max-height: 70vh;
          overflow-y: auto;
        }

        .json-key {
          color: var(--syn-key);
          font-weight: 600;
        }

        .json-string {
          color: var(--syn-string);
        }

        .json-number {
          color: var(--syn-number);
        }

        .json-boolean {
          color: var(--syn-bool);
        }

        .json-null {
          color: var(--fg-muted);
          font-style: italic;
        }

        /* Collapsible JSON Tree Styles */
        .json-tree {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        .json-line {
          display: flex;
          align-items: flex-start;
          padding: 2px 0;
          white-space: nowrap;
        }

        .json-line:hover {
          background: rgba(0, 212, 170, 0.05);
        }

        .json-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          cursor: pointer;
          font-size: 10px;
          color: var(--fg-subtle);
          border: none;
          background: transparent;
          border-radius: 3px;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .json-toggle:hover {
          background: var(--surface-2);
          color: var(--fg);
        }

        .json-toggle.collapsed .toggle-icon {
          transform: rotate(-90deg);
        }

        .toggle-icon {
          transition: transform 0.15s ease;
        }

        .json-toggle-placeholder {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          flex-shrink: 0;
        }

        .json-bracket {
          color: var(--fg-muted);
        }

        .json-children {
          display: block;
          margin-left: 20px;
          border-left: 1px dashed var(--border);
          padding-left: 8px;
        }

        .json-children.collapsed {
          display: none;
        }

        .json-collapsed-preview {
          color: var(--border-strong);
          font-style: italic;
          cursor: pointer;
          display: none;
        }

        .json-collapsed-preview:hover {
          color: var(--fg-muted);
        }

        .json-toggle.collapsed + .json-bracket + .json-collapsed-preview {
          display: inline;
        }

        .json-comma {
          color: var(--gray-600);
        }

        .json-expand-controls {
          display: flex;
          gap: 8px;
          margin: 0 0 12px 0;
          padding: 0 0 8px 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .json-expand-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 10px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--fg-muted);
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1;
          box-shadow: none;
        }

        .json-expand-btn:hover {
          background: var(--primary);
          color: var(--bg);
          border-color: var(--primary);
          box-shadow: none;
        }

        .json-expand-btn .material-icons {
          font-size: 16px;
          line-height: 1;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .json-node-wrapper {
          display: block;
        }

        .json-collapsible-line {
          display: flex;
          align-items: flex-start;
        }

        .json-closing-line {
          display: flex;
          align-items: flex-start;
        }

        /* Glass Request Type Tabs (REST / GraphQL segmented control) */
        .request-type-tabs {
          display: inline-flex;
          gap: var(--space-1);
          margin-bottom: var(--space-5);
          background: var(--glass-bg);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          padding: 4px;
          border-radius: var(--radius);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .type-tab {
          padding: var(--space-2) var(--space-5);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.8125rem;
          color: var(--fg-muted);
          transition: var(--transition);
          position: relative;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .type-tab:hover {
          color: var(--fg);
        }

        .type-tab.active {
          color: #ffffff;
          background: var(--gradient-primary);
          box-shadow: 0 2px 10px var(--accent-glow);
          font-weight: 700;
        }

        .request-content {
          display: none;
        }

        .request-content.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <!-- Main Content Container -->
      <div class="main-container">
        <!-- Request Type Tabs -->
        <div class="request-type-tabs">
          <div class="type-tab active" onclick="switchRequestType('rest')" data-type="rest">REST</div>
          <div class="type-tab" onclick="switchRequestType('graphql')" data-type="graphql">GraphQL</div>
        </div>

        <!-- REST Content -->
        <div id="rest-content" class="request-content active">
          <!-- Request Card -->
          <div class="request-card">
            <div class="card-header">
              <h2 class="card-title">
                <span class="material-icons">http</span>
                REST TEST
              </h2>
            </div>

            <div class="request-row">
              <div class="request-bar">
                <select id="method-select" class="method-select">
                  <option value="GET" ${initialState.method === 'GET' ? 'selected' : ''}>GET</option>
                  <option value="POST" ${initialState.method === 'POST' ? 'selected' : ''}>POST</option>
                  <option value="PUT" ${initialState.method === 'PUT' ? 'selected' : ''}>PUT</option>
                  <option value="DELETE" ${initialState.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
                  <option value="PATCH" ${initialState.method === 'PATCH' ? 'selected' : ''}>PATCH</option>
                  <option value="HEAD" ${initialState.method === 'HEAD' ? 'selected' : ''}>HEAD</option>
                  <option value="OPTIONS" ${initialState.method === 'OPTIONS' ? 'selected' : ''}>OPTIONS</option>
                </select>
                <input type="text" id="url-input" class="url-input" placeholder="https://api.example.com/endpoint" value="${initialState.url || ''}" oninput="debouncedParseURL()" onpaste="setTimeout(parseQueryParamsFromURL, 100)">
              </div>

              <div class="action-buttons">
                <button id="save-btn" class="save-button">
                    <span class="material-icons">bookmark</span>
                  Save
                </button>
                <button id="send-btn" class="send-button">
                  <span class="material-icons">send</span>
                  Send
                </button>
              </div>
            </div>
          </div>

          <div class="tabs">
            <div class="tab active" data-tab="params">
                Params
            </div>
            <div class="tab" data-tab="headers">
              Headers
            </div>
            <div class="tab" data-tab="body">
                Body
            </div>
          </div>

          <div class="tab-content">
            <div id="params-section" class="content-section active">
              <div class="param-table">
                <div class="param-table-header">
                  <span></span>
                  <span>Key</span>
                  <span>Value</span>
                  <span></span>
                </div>
                <div id="queryParams" class="param-rows"></div>
              </div>
              <button class="add-param-button" onclick="addParamRow('queryParams')">
                  <span class="material-icons">add_circle</span>
                  Add Query Parameter
              </button>
            </div>


            <div id="headers-section" class="content-section">
              <div class="param-table">
                <div class="param-table-header">
                  <span></span>
                  <span>Key</span>
                  <span>Value</span>
                  <span></span>
                </div>
                <div id="headers" class="param-rows"></div>
              </div>
              <button class="add-param-button" onclick="addParamRow('headers')">
                  <span class="material-icons">add_circle</span>
                Add Header
              </button>
            </div>


            <div id="body-section" class="content-section">
                <textarea id="body" placeholder="{\n  \"key\": \"value\",\n  \"message\": \"Hello, World!\"\n}" rows="12"></textarea>
            </div>
          </div>
        </div>

        <!-- GraphQL Content -->
        <div id="graphql-content" class="request-content">
          <div class="request-card">
            <div class="card-header">
              <h2 class="card-title">
                <span class="material-icons">hub</span>
                GraphQL
              </h2>
            </div>
            <div class="request-row">
              <div class="request-bar">
                <input type="text" id="graphql-url-input" class="url-input" placeholder="https://api.example.com/graphql" value="${initialState.graphqlUrl || ''}">
              </div>
              <div class="action-buttons">
                <button id="graphql-save-btn" class="save-button">
                    <span class="material-icons">bookmark</span>
                    Save
                </button>
                <button id="graphql-send-btn" class="send-button">
                    <span class="material-icons">send</span>
                    Send
                </button>
              </div>
            </div>
          </div>

          <div class="tabs">
            <div class="tab active" data-tab="query" onclick="switchGraphQLTab('query')">
                <span class="material-icons">code</span>
                Query
            </div>
            <div class="tab" data-tab="variables" onclick="switchGraphQLTab('variables')">
                <span class="material-icons">data_object</span>
                Variables
            </div>
            <div class="tab" data-tab="graphql-headers" onclick="switchGraphQLTab('graphql-headers')">
                <span class="material-icons">http</span>
                Headers
            </div>
          </div>

          <div class="tab-content">
            <div id="query-section" class="content-section active">
                <textarea id="graphql-query" placeholder="query { ... }" rows="12">${initialState.graphqlQuery || ''}</textarea>
            </div>
            <div id="variables-section" class="content-section">
                <textarea id="graphql-variables" placeholder="{ ... }" rows="12">${initialState.graphqlVariables || ''}</textarea>
            </div>
            <div id="graphql-headers-section" class="content-section">
                <div id="graphql-headers" class="param-rows"></div>
                <button class="add-param-button" onclick="addParamRow('graphql-headers')">
                    <span class="material-icons">add_circle</span>
                    Add Header
                </button>
            </div>
          </div>
        </div>
      </div>
      <div id="responseContainer">
          <div id="responseBox" class="response-container is-empty">
            <div id="responseHeader" class="response-header">
              <div class="response-status">
                <span id="responseStatus"></span>
                <span id="responseTime" class="response-time">
                  <span class="material-icons">timer</span>
                  <span></span>
                </span>
                  <span id="responseSize" class="response-size">
                    <span class="material-icons">data_usage</span>
                  <span></span>
                </span>
              </div>
              <div class="button-group">
                  <button id="copyAsCurlButton" class="copy-as-curl" title="Copy as cURL">
                    <span class="material-icons">terminal</span>
                </button>
                  <button id="copyButton" class="copy-button" title="Copy Response">
                  <span class="material-icons">content_copy</span>
                  </button>
                </div>
              </div>

              <!-- Response Tabs -->
              <div class="response-tabs">
                <div class="response-tab active" data-response-tab="body">
                  <span class="material-icons">data_object</span>
                  Body
                </div>
                <div class="response-tab" data-response-tab="headers">
                  <span class="material-icons">list</span>
                  Headers
                  <span id="headersCount" class="response-tab-badge">0</span>
                </div>
                <div class="response-tab" data-response-tab="timing">
                  <span class="material-icons">speed</span>
                  Timing
                </div>
              </div>

              <!-- Response Content -->
              <div class="response-content">
                <!-- Response Body Section -->
                <div id="response-body-section" class="response-section active">
                  <div class="response-controls">
                    <div class="response-search">
                      <span class="material-icons">search</span>
                      <input type="text" id="responseSearch" placeholder="Search in response...">
                      <span id="searchCount" class="search-count"></span>
                      <button id="searchPrev" class="search-nav-btn" title="Previous match (Shift+Enter)">
                        <span class="material-icons">keyboard_arrow_up</span>
                      </button>
                      <button id="searchNext" class="search-nav-btn" title="Next match (Enter)">
                        <span class="material-icons">keyboard_arrow_down</span>
                      </button>
                    </div>
                    <div class="response-options">
                      <button class="response-option-btn active" data-format="pretty">
                        <span class="material-icons">code</span>
                        Pretty
                      </button>
                      <button class="response-option-btn" data-format="raw">
                        <span class="material-icons">text_fields</span>
                        Raw
                      </button>
                      <button class="response-option-btn" data-format="preview">
                        <span class="material-icons">preview</span>
                        Preview
                </button>
              </div>
            </div>
            <div id="responseBody" class="response-body"><div class="response-empty">
              <span class="material-icons">cloud_download</span>
              <div class="response-empty-title">No response yet</div>
              <div class="response-empty-hint">Send a request to see the response here.</div>
            </div></div>
          </div>

                <!-- Response Headers Section -->
                <div id="response-headers-section" class="response-section">
                  <div id="responseHeaders">
                    <table class="headers-table">
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody id="headersTableBody">
                        <tr>
                          <td colspan="2" style="text-align: center; color: var(--gray-500); font-style: italic;">
                            No headers to display
                          </td>
                        </tr>
                      </tbody>
                    </table>
        </div>
      </div>

                <!-- Response Timing Section -->
                <div id="response-timing-section" class="response-section">
                  <div class="timing-breakdown">
                    <h4>
                      <span class="material-icons">schedule</span>
                      Request Timing Breakdown
                    </h4>
                    <div id="timingDetails">
                      <div class="timing-item">
                        <span class="timing-label">DNS Lookup</span>
                        <span class="timing-value" id="dnsTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">TCP Connection</span>
                        <span class="timing-value" id="tcpTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">TLS Handshake</span>
                        <span class="timing-value" id="sslTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">Server Processing &amp; Download</span>
                        <span class="timing-value" id="transferTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">Total Time</span>
                        <span class="timing-value" id="totalTime">--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Dialog -->
      <div id="save-dialog" class="save-dialog">
        <div class="save-dialog-content">
          <div class="save-dialog-title">
            <span class="material-icons">bookmark_add</span>
            Save API Request
          </div>
          <div class="save-dialog-form">
            <div>
              <label for="request-name" style="display: block; margin-bottom: 0.75rem; font-weight: 500; color: var(--fg-muted);">Request Name</label>
              <input type="text" id="request-name" class="url-input" placeholder="My Awesome API Request">
            </div>
            <div>
              <label for="collection-select" style="display: block; margin: 0.5rem 0 0.75rem; font-weight: 500; color: var(--fg-muted);">Collection</label>
              <select id="collection-select" class="dialog-select">
                ${collections.map(c => `<option value="${c.id}"${c.id === currentCollectionId ? ' selected' : ''}>${escapeForAttr(c.name)}</option>`).join('')}
                <option value="__new__">➕ New collection…</option>
              </select>
              <input type="text" id="new-collection-name" class="url-input" placeholder="New collection name" style="display: none; margin-top: 0.75rem;">
            </div>
            <div class="dialog-actions">
              <button id="dialog-cancel" class="dialog-button dialog-cancel">
                <span class="material-icons">close</span>
                Cancel
              </button>
              <button id="dialog-save" class="dialog-button dialog-save">
                <span class="material-icons">save</span>
                Save Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const initialState = ${JSON.stringify(initialState)};
        let currentState = { ...initialState };

        // Enhanced tab switching with animations
        function switchTab(tabId) {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
          
          const activeTab = document.querySelector(\`[data-tab="\${tabId}"]\`);
          const activeSection = document.getElementById(\`\${tabId}-section\`);
          if (activeTab) activeTab.classList.add('active');
          if (activeSection) activeSection.classList.add('active');
        }

        // Enhanced method select color update with animation
        function updateMethodSelectColor() {
          const methodSelect = document.getElementById('method-select');
          const method = methodSelect.value;
          
          // Add transition effect
          methodSelect.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          
          // Update the select element's value attribute for CSS targeting
          methodSelect.setAttribute('value', method);
          
          // Remove any existing method classes
          methodSelect.classList.remove('method-get', 'method-post', 'method-put', 'method-delete', 'method-patch', 'method-head', 'method-options');
          
          // Add the appropriate method class with animation
          methodSelect.classList.add('method-' + method.toLowerCase());
          
          // Add subtle pulse animation
          methodSelect.style.transform = 'scale(1.02)';
          setTimeout(() => {
            methodSelect.style.transform = '';
          }, 200);
        }

        // Enhanced loading state with better animations
        function showLoading() {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseBody = document.getElementById('responseBody');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          
          responseContainer.style.display = 'block';
          responseBox.className = 'response-container';
          responseStatus.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite; margin-right: 8px;">sync</span>Sending request...';
          
          // Clear timing displays with animation
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) {
            timeSpan.style.opacity = '0';
            setTimeout(() => timeSpan.textContent = '', 200);
          }
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) {
            sizeSpan.style.opacity = '0';
            setTimeout(() => sizeSpan.textContent = '', 200);
          }
          
          // Enhanced loading animation
          responseBody.innerHTML = \`
            <div class="loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">🚀 Processing your request</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Please wait while we fetch the data...</div>
              </div>
            </div>
          \`;
          
          // Add entrance animation to response container
          responseContainer.style.opacity = '0';
          responseContainer.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            responseContainer.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            responseContainer.style.opacity = '1';
            responseContainer.style.transform = 'translateY(0)';
          });
        }

        // Enhanced copy feedback with better animations
        function showCopyFeedback(message) {
          // Remove existing feedback with fade out
          const existingFeedback = document.querySelector('.copy-feedback');
          if (existingFeedback) {
            existingFeedback.style.opacity = '0';
            existingFeedback.style.transform = 'translateY(-20px) scale(0.8)';
            setTimeout(() => existingFeedback.remove(), 200);
          }
          
          // Create new feedback with enhanced animation
          const feedback = document.createElement('div');
          feedback.className = 'copy-feedback';
          feedback.innerHTML = \`
            <span class="material-icons">check_circle</span>
            \${message}
          \`;
          
          // Start with hidden state
          feedback.style.opacity = '0';
          feedback.style.transform = 'translateY(100px) scale(0.8)';
          document.body.appendChild(feedback);
          
          // Trigger entrance animation
          requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0) scale(1)';
          });
          
          // Auto-remove with exit animation
          setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-100px) scale(0.8)';
            setTimeout(() => feedback.remove(), 400);
          }, 2600);
        }

        // Enhanced button ripple effect
        function addRippleEffect(button, event) {
          const ripple = document.createElement('span');
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;
          
          ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          \`;
          
          button.style.position = 'relative';
          button.style.overflow = 'hidden';
          button.appendChild(ripple);
          
          setTimeout(() => ripple.remove(), 600);
        }

        // Debounce utility function (defined before initializeForm)
        let urlDebounceTimeout = null;
        function debouncedParseURL() {
          if (urlDebounceTimeout) clearTimeout(urlDebounceTimeout);
          urlDebounceTimeout = setTimeout(function() {
            parseQueryParamsFromURL();
          }, 300);
        }

        // Parse query params from URL and populate the table
        function parseQueryParamsFromURL() {
          const urlInput = document.getElementById('url-input');
          if (!urlInput) return;
          
          const urlValue = urlInput.value.trim();
          console.log('parseQueryParamsFromURL called, URL:', urlValue);
          
          if (!urlValue || urlValue.indexOf('?') === -1) {
            console.log('No query params in URL');
            return;
          }
          
          try {
            // Handle URLs with or without protocol
            let urlToParse = urlValue;
            if (urlValue.indexOf('http://') !== 0 && urlValue.indexOf('https://') !== 0) {
              urlToParse = 'https://' + urlValue;
            }
            
            console.log('Parsing URL:', urlToParse);
            const url = new URL(urlToParse);
            const searchParams = url.searchParams;
            
            // Get params from URL
            const urlParams = [];
            searchParams.forEach(function(value, key) {
              console.log('Found param:', key, '=', value);
              urlParams.push({ key: key, value: value, enabled: true });
            });
            
            console.log('Total params found:', urlParams.length);
            
            // Only update if URL has params
            if (urlParams.length > 0) {
              const queryParamsContainer = document.getElementById('queryParams');
              if (!queryParamsContainer) return;
              
              queryParamsContainer.innerHTML = '';
              
              urlParams.forEach(function(param) {
                addParamRow('queryParams', param);
              });
              
              // Add empty row at the end
              addParamRow('queryParams');
              
              saveState();
            }
          } catch (e) {
            console.log('URL parse error:', e);
          }
        }


        function initializeForm() {

          document.getElementById('method-select').value = currentState.method || 'GET';
          document.getElementById('url-input').value = currentState.url || '';
          document.getElementById('body').value = currentState.body || '';

          // Update method select color on initialization
          updateMethodSelectColor();

          // Restore query parameters - handle empty arrays properly
          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          if (currentState.queryParams && Array.isArray(currentState.queryParams) && currentState.queryParams.length > 0) {
            currentState.queryParams.forEach(param => {
              if (param && (param.key || param.value)) {
                addParamRow('queryParams', param);
              }
            });
          }
          // Always ensure at least one empty row exists
          if (queryParamsContainer.children.length === 0) {
            addParamRow('queryParams');
          }

          // Restore headers - handle empty arrays properly
          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          if (currentState.headers && Array.isArray(currentState.headers) && currentState.headers.length > 0) {
            currentState.headers.forEach(header => {
              if (header && (header.key || header.value)) {
                addParamRow('headers', header);
              }
            });
          }
          // Always ensure at least one empty row exists
          if (headersContainer.children.length === 0) {
            addParamRow('headers');
          }

          // Setup URL input listener for auto-detecting query params
          const urlInput = document.getElementById('url-input');
          urlInput.addEventListener('input', debouncedParseURL);
          urlInput.addEventListener('paste', () => {
            setTimeout(parseQueryParamsFromURL, 100);
          });
        }


        let saveStateTimeout = null;
        
        function saveState() {
          // Clear existing timeout
          if (saveStateTimeout) {
            clearTimeout(saveStateTimeout);
          }
          
          // Debounce save to avoid excessive writes
          saveStateTimeout = setTimeout(() => {
            currentState = {
              type: document.querySelector('.type-tab.active').dataset.type,
              method: document.getElementById('method-select').value,
              url: document.getElementById('url-input').value,
              body: document.getElementById('body').value,
              queryParams: collectParamsArray('queryParams'),
              headers: collectParamsArray('headers'),
              graphqlUrl: document.getElementById('graphql-url-input').value,
              graphqlQuery: document.getElementById('graphql-query').value,
              graphqlVariables: document.getElementById('graphql-variables').value,
              graphqlHeaders: collectParamsArray('graphql-headers')
            };
            
            vscode.postMessage({
              type: 'saveState',
              state: currentState
            });
          }, 300); // 300ms debounce
        }

        function addParamRow(containerId, initialValue = { key: '', value: '', enabled: true }) {
          const container = document.getElementById(containerId);
          const row = document.createElement('div');
          const isEnabled = initialValue.enabled !== false; // Default to true if not specified
          row.className = isEnabled ? 'param-row' : 'param-row disabled';
          
          row.innerHTML = \`
            <div class="param-checkbox-wrapper">
              <input type="checkbox" class="param-checkbox" \${isEnabled ? 'checked' : ''} title="Enable/disable this parameter" />
            </div>
            <div class="param-input-cell">
              <input type="text" placeholder="Key" value="\${initialValue.key}" />
            </div>
            <div class="param-input-cell">
              <input type="text" placeholder="Value" value="\${initialValue.value}" />
            </div>
            <div class="param-action-cell">
              <button class="remove-param-button" onclick="removeParamRow(this)" aria-label="Delete parameter">
                <span class="material-icons">delete</span>
              </button>
            </div>
          \`;


          // Handle checkbox change
          const checkbox = row.querySelector('.param-checkbox');
          checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
              row.classList.remove('disabled');
            } else {
              row.classList.add('disabled');
            }
            if (containerId === 'queryParams') {
              updateURLWithParams();
            } else {
              saveState();
            }
          });

          const inputs = row.querySelectorAll('input[type="text"]');
          for (const input of inputs) {
            input.addEventListener('input', () => {
              if (containerId === 'queryParams') {
                updateURLWithParams();
              } else if (containerId === 'graphql-headers') {
                saveState();
              } else {
                saveState();
              }
            });

            // Simplified focus animations
            input.addEventListener('focus', () => {
              row.style.transform = 'translateY(-1px)';
              row.style.boxShadow = 'var(--shadow-sm)';
            });

            input.addEventListener('blur', () => {
              row.style.transform = '';
              row.style.boxShadow = '';
            });
          }

          // Simplified entrance animation - no double animation layers
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          container.appendChild(row);
          
          // Single animation trigger - much faster
          requestAnimationFrame(() => {
            row.style.transition = 'all 0.2s ease-out';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          });
          
          // Immediate focus for better UX - no delay
          if (initialValue.key === '' && initialValue.value === '') {
            requestAnimationFrame(() => inputs[0].focus());
          }
        }



        function removeParamRow(button) {
          const row = button.closest('.param-row');
          const container = row.parentElement;

          
          // Simplified removal animation - much faster
          row.style.transition = 'all 0.15s ease-out';
          row.style.transform = 'translateX(-10px)';
          row.style.opacity = '0';
          
          setTimeout(() => {
            container.removeChild(row);
            
            // Always ensure at least one empty row exists
            if (container.children.length === 0) {
              addParamRow(container.id);
            }
            
            // Save state after removal
            if (container.id === 'queryParams') {
              updateURLWithParams();
            } else {
              saveState();
            }
          }, 150);
        }

        function formatResponseTime(ms) {
          if (ms < 1000) {
            return \`\${ms}ms\`;
          }
          return \`\${(ms / 1000).toFixed(2)}s\`;
        }

        function formatResponseSize(bytes) {
          if (!bytes) return '-- KB';
          if (bytes < 1024) return \`\${bytes} B\`;
          if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
          return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
        }

        function switchResponseTab(tabId) {
          // Switch response tabs
          document.querySelectorAll('.response-tab').forEach(tab => {
            tab.classList.remove('active');
          });
          document.querySelectorAll('.response-section').forEach(section => {
            section.classList.remove('active');
          });
          
          document.querySelector(\`[data-response-tab="\${tabId}"]\`).classList.add('active');
          document.getElementById(\`response-\${tabId}-section\`).classList.add('active');
        }

        function switchResponseFormat(format) {
          document.querySelectorAll('.response-option-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          document.querySelector(\`[data-format="\${format}"]\`).classList.add('active');
          
          // Re-format the current response based on the selected format
          const responseBody = document.getElementById('responseBody');
          const currentData = responseBody.dataset.rawData;
          
          if (currentData) {
            displayResponseData(JSON.parse(currentData), format);
          }
        }

        function displayResponseData(data, format = 'pretty') {
          const responseBody = document.getElementById('responseBody');
          responseBody.dataset.rawData = JSON.stringify(data);
          
          if (format === 'raw') {
            responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data);
            responseBody.className = 'response-body';
          } else if (format === 'preview') {
            try {
              const parsed = typeof data === 'string' ? JSON.parse(data) : data;
              responseBody.innerHTML = createJsonPreview(parsed);
              responseBody.className = 'response-body';
            } catch (e) {
              responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data);
              responseBody.className = 'response-body';
            }
          } else { // pretty
            try {
              const jsonContent = formatJSONWithCollapsible(data);
              if (typeof jsonContent === 'string') {
                responseBody.textContent = jsonContent;
              } else {
                responseBody.innerHTML = '';
                responseBody.appendChild(jsonContent);
              }
              responseBody.className = 'response-body';
            } catch (error) {
              responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
              responseBody.className = 'response-body';
            }
          }
        }

        function createJsonPreview(obj, depth = 0) {
          if (depth > 2) return '<span class="json-truncated">...</span>';
          
          if (obj === null) return '<span class="json-null">null</span>';
          if (typeof obj === 'boolean') return '<span class="json-boolean">' + obj + '</span>';
          if (typeof obj === 'number') return '<span class="json-number">' + obj + '</span>';
          if (typeof obj === 'string') {
            const truncated = obj.length > 50 ? obj.substring(0, 50) + '...' : obj;
            return '<span class="json-string">"' + truncated + '"</span>';
          }
          
          if (Array.isArray(obj)) {
            if (obj.length === 0) return '<span class="json-bracket">[]</span>';
            const items = obj.slice(0, 3).map(item => createJsonPreview(item, depth + 1));
            const more = obj.length > 3 ? '<br>&nbsp;&nbsp;<span class="json-truncated">... (' + (obj.length - 3) + ' more items)</span>' : '';
            return '<span class="json-bracket">[</span><div style="margin-left: 1rem; border-left: 2px solid var(--gray-200); padding-left: 1rem;">' + items.join(',<br>') + more + '</div><span class="json-bracket">]</span>';
          }
          
          if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '<span class="json-bracket">{}</span>';
            const items = keys.slice(0, 5).map(key => 
              '<span class="json-key">"' + key + '"</span>: ' + createJsonPreview(obj[key], depth + 1)
            );
            const more = keys.length > 5 ? '<br>&nbsp;&nbsp;<span class="json-truncated">... (' + (keys.length - 5) + ' more properties)</span>' : '';
            return '<span class="json-bracket">{</span><div style="margin-left: 1rem; border-left: 2px solid var(--gray-200); padding-left: 1rem;">' + items.join(',<br>') + more + '</div><span class="json-bracket">}</span>';
          }
          
          return String(obj);
        }

        function displayResponseHeaders(headers) {
          const headersTableBody = document.getElementById('headersTableBody');
          const headersCount = document.getElementById('headersCount');
          
          if (!headers || Object.keys(headers).length === 0) {
            headersTableBody.innerHTML = \`
              <tr>
                <td colspan="2" style="text-align: center; color: var(--gray-500); font-style: italic;">
                  No headers to display
                </td>
              </tr>
            \`;
            headersCount.textContent = '0';
            return;
          }
          
          const headerEntries = Object.entries(headers);
          headersCount.textContent = headerEntries.length;
          
          headersTableBody.innerHTML = headerEntries.map(([key, value]) => \`
            <tr>
              <td>\${escapeHtml(String(key))}</td>
              <td>\${escapeHtml(String(value))}</td>
            </tr>
          \`).join('');
        }

        function updateTimingBreakdown(timing, responseTime) {
          // Real, measured connection-phase durations from the extension host.
          // Phases that didn't occur (e.g. TLS on http, DNS for an IP) come back
          // as null and are shown as "n/a".
          const set = (id, ms) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (ms === null || ms === undefined || isNaN(ms)) {
              el.textContent = 'n/a';
            } else {
              el.textContent = formatResponseTime(Math.max(0, Math.round(ms)));
            }
          };

          timing = timing || {};
          set('dnsTime', timing.dns);
          set('tcpTime', timing.tcp);
          set('sslTime', timing.tls);
          set('transferTime', timing.transfer);
          // Fall back to the round-trip time if the host didn't send a total.
          set('totalTime', timing.total != null ? timing.total : responseTime);
        }

        // Index of the currently focused search match.
        let searchCurrentIndex = 0;

        function runResponseSearch(query) {
          const responseBody = document.getElementById('responseBody');
          const countEl = document.getElementById('searchCount');
          const prevBtn = document.getElementById('searchPrev');
          const nextBtn = document.getElementById('searchNext');
          const rawData = responseBody.dataset.rawData;

          const setNavDisabled = (disabled) => {
            if (prevBtn) prevBtn.disabled = disabled;
            if (nextBtn) nextBtn.disabled = disabled;
          };

          // Empty query: restore the original formatted (collapsible) view.
          if (!query) {
            if (rawData) {
              try {
                displayResponseData(JSON.parse(rawData), 'pretty');
              } catch (e) {
                responseBody.textContent = rawData;
              }
            }
            if (countEl) countEl.textContent = '';
            setNavDisabled(true);
            return;
          }

          // Build a plain-text representation of the response to search within.
          let plainText;
          if (rawData) {
            try {
              plainText = JSON.stringify(JSON.parse(rawData), null, 2);
            } catch (e) {
              plainText = rawData;
            }
          } else {
            plainText = responseBody.textContent;
          }

          const lowerText = plainText.toLowerCase();
          const lowerQuery = query.toLowerCase();
          let startIndex = 0;
          let result = '';
          let matchCount = 0;

          // Escape every text segment before inserting into innerHTML so JSON
          // containing <, >, & (or markup) cannot break the layout or inject.
          while (true) {
            const index = lowerText.indexOf(lowerQuery, startIndex);
            if (index === -1) {
              result += escapeHtml(plainText.substring(startIndex));
              break;
            }
            result += escapeHtml(plainText.substring(startIndex, index));
            result += '<mark class="search-highlight" data-match="' + matchCount + '">'
              + escapeHtml(plainText.substring(index, index + query.length))
              + '</mark>';
            matchCount++;
            startIndex = index + query.length;
          }

          responseBody.innerHTML = result;

          if (matchCount === 0) {
            if (countEl) countEl.textContent = '0/0';
            setNavDisabled(true);
            return;
          }

          setNavDisabled(false);
          if (searchCurrentIndex >= matchCount) searchCurrentIndex = 0;
          if (searchCurrentIndex < 0) searchCurrentIndex = matchCount - 1;
          focusSearchMatch(searchCurrentIndex, matchCount);
        }

        function focusSearchMatch(index, total) {
          const responseBody = document.getElementById('responseBody');
          const countEl = document.getElementById('searchCount');
          const marks = responseBody.querySelectorAll('mark.search-highlight');
          if (!marks.length) return;
          if (index < 0) index = marks.length - 1;
          if (index >= marks.length) index = 0;
          searchCurrentIndex = index;

          marks.forEach(m => m.classList.remove('current'));
          const active = marks[index];
          active.classList.add('current');
          active.scrollIntoView({ block: 'center' });
          if (countEl) countEl.textContent = (index + 1) + '/' + (total || marks.length);
        }

        function gotoSearchMatch(delta) {
          const responseBody = document.getElementById('responseBody');
          const marks = responseBody.querySelectorAll('mark.search-highlight');
          if (!marks.length) return;
          focusSearchMatch(searchCurrentIndex + delta, marks.length);
        }

        // Clear the search box and match counter (called when a fresh response arrives).
        function resetResponseSearch() {
          const input = document.getElementById('responseSearch');
          const countEl = document.getElementById('searchCount');
          const prevBtn = document.getElementById('searchPrev');
          const nextBtn = document.getElementById('searchNext');
          if (input) input.value = '';
          if (countEl) countEl.textContent = '';
          searchCurrentIndex = 0;
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = true;
        }

        function setupResponseSearch() {
          const searchInput = document.getElementById('responseSearch');
          const prevBtn = document.getElementById('searchPrev');
          const nextBtn = document.getElementById('searchNext');

          searchInput.addEventListener('input', (e) => {
            searchCurrentIndex = 0;
            runResponseSearch(e.target.value);
          });

          // Enter jumps to the next match, Shift+Enter to the previous.
          searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              gotoSearchMatch(e.shiftKey ? -1 : 1);
            }
          });

          if (prevBtn) prevBtn.addEventListener('click', () => gotoSearchMatch(-1));
          if (nextBtn) nextBtn.addEventListener('click', () => gotoSearchMatch(1));
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = true;
        }

        function collectParamsArray(containerId) {
          const params = [];
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const checkbox = row.querySelector('.param-checkbox');
            const textInputs = row.querySelectorAll('input[type="text"]');
            const key = textInputs[0].value.trim();
            const value = textInputs[1].value.trim();
            const enabled = checkbox ? checkbox.checked : true;
            // Only include non-empty parameters to avoid cluttering storage
            if (key || value) {
              params.push({ key, value, enabled });
            }
          }
          
          return params;
        }


        function collectParams(containerId) {
          const params = {};
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const checkbox = row.querySelector('.param-checkbox');
            const textInputs = row.querySelectorAll('input[type="text"]');
            const key = textInputs[0].value.trim();
            const value = textInputs[1].value.trim();
            const enabled = checkbox ? checkbox.checked : true;
            // Only include enabled parameters with a key
            if (key && enabled) {
              params[key] = value;
            }
          }
          
          return params;
        }

        function updateURLWithParams() {
          const urlInput = document.getElementById('url-input');
          const baseURL = urlInput.value.split('?')[0];
          const queryParams = collectParamsArray('queryParams');
          
          // Only include enabled params in URL
          const enabledParams = queryParams.filter(param => param.enabled !== false);
          
          if (enabledParams.length > 0 && enabledParams.some(param => param.key)) {
            const searchParams = new URLSearchParams();
            enabledParams.forEach(param => {
              if (param.key) {
                searchParams.append(param.key, param.value);
              }
            });
            const queryString = searchParams.toString();
            urlInput.value = queryString ? \`\${baseURL}?\${queryString}\` : baseURL;
          } else {
            urlInput.value = baseURL;
          }
          
          saveState();
        }


        function showLoading() {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseBody = document.getElementById('responseBody');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          
          responseContainer.style.display = 'block';
          responseBox.className = 'response-container';
          responseStatus.textContent = 'Sending request...';
          
          // Clear timing displays
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) timeSpan.textContent = '';
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) sizeSpan.textContent = '';
          
          responseBody.innerHTML = '<div class="loading">🚀 Processing your request<br>Please wait...</div>';
        }

        function formatJSONWithCollapsible(json) {
          try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            const container = document.createElement('div');
            container.className = 'json-container';
            
            // Create expand/collapse all controls
            const controls = document.createElement('div');
            controls.className = 'json-expand-controls';
            controls.innerHTML = \`
              <button class="json-expand-btn" onclick="expandAllJson(this)">
                <span class="material-icons">unfold_more</span><span>Expand</span>
              </button>
              <button class="json-expand-btn" onclick="collapseAllJson(this)">
                <span class="material-icons">unfold_less</span><span>Collapse</span>
              </button>
            \`;
            container.appendChild(controls);
            
            // For large payloads, render nested nodes collapsed & unbuilt so the
            // initial DOM stays small; they build on first expand. Small payloads
            // render fully expanded as before.
            jsonLazyMode = countJsonNodes(obj, 200) >= 200;

            // Create the JSON tree
            const tree = document.createElement('div');
            tree.className = 'json-tree';
            tree.appendChild(renderJsonNode(obj, '', true, 0));
            container.appendChild(tree);
            
            return container;
          } catch (e) {
            const container = document.createElement('div');
            container.className = 'json-container';
            container.textContent = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
            return container;
          }
        }

        // When true, nested object/array nodes start collapsed and their children
        // are built only on first expand (set per-render in formatJSONWithCollapsible).
        let jsonLazyMode = false;

        // Cheap bounded node count to decide whether to render lazily. Stops
        // counting once it reaches the cap so huge payloads don't get fully walked.
        function countJsonNodes(obj, cap) {
          let n = 0;
          const stack = [obj];
          while (stack.length && n < cap) {
            const cur = stack.pop();
            if (Array.isArray(cur)) {
              n += cur.length;
              for (const x of cur) { if (x && typeof x === 'object') stack.push(x); }
            } else if (cur && typeof cur === 'object') {
              const ks = Object.keys(cur);
              n += ks.length;
              for (const k of ks) { if (cur[k] && typeof cur[k] === 'object') stack.push(cur[k]); }
            }
          }
          return n;
        }

        function renderJsonNode(value, key, isLast, depth) {
          depth = depth || 0;
          const keyHtml = key ? \`<span class="json-key">"\${escapeHtml(key)}"</span>: \` : '';
          const comma = isLast ? '' : '<span class="json-comma">,</span>';

          // For primitive values, return a simple line
          if (value === null) {
            const line = document.createElement('div');
            line.className = 'json-line';
            line.innerHTML = \`<span class="json-toggle-placeholder"></span>\${keyHtml}<span class="json-null">null</span>\${comma}\`;
            return line;
          } else if (typeof value === 'boolean') {
            const line = document.createElement('div');
            line.className = 'json-line';
            line.innerHTML = \`<span class="json-toggle-placeholder"></span>\${keyHtml}<span class="json-boolean">\${value}</span>\${comma}\`;
            return line;
          } else if (typeof value === 'number') {
            const line = document.createElement('div');
            line.className = 'json-line';
            line.innerHTML = \`<span class="json-toggle-placeholder"></span>\${keyHtml}<span class="json-number">\${value}</span>\${comma}\`;
            return line;
          } else if (typeof value === 'string') {
            const line = document.createElement('div');
            line.className = 'json-line';
            line.innerHTML = \`<span class="json-toggle-placeholder"></span>\${keyHtml}<span class="json-string">"\${escapeHtml(value)}"</span>\${comma}\`;
            return line;
          }

          // For objects and arrays, use a wrapper container
          const isArray = Array.isArray(value);
          const count = isArray ? value.length : Object.keys(value).length;
          const openBracket = isArray ? '[' : '{';
          const closeBracket = isArray ? ']' : '}';
          const previewText = isArray ? \`\${count} items\` : \`\${count} properties\`;

          const wrapper = document.createElement('div');
          wrapper.className = 'json-node-wrapper';

          // Opening line with toggle
          const openLine = document.createElement('div');
          openLine.className = 'json-line json-collapsible-line';
          openLine.innerHTML = \`
            <button class="json-toggle" onclick="toggleJsonNode(this)">
              <span class="toggle-icon material-icons" style="font-size: 12px;">expand_more</span>
            </button>
            \${keyHtml}<span class="json-bracket">\${openBracket}</span>
            <span class="json-collapsed-preview">\${previewText}</span>
          \`;
          wrapper.appendChild(openLine);

          // Children container (always present so toggle has a target)
          const children = document.createElement('div');
          children.className = 'json-children';
          wrapper.appendChild(children);

          // Closing bracket line
          const closeLine = document.createElement('div');
          closeLine.className = 'json-line json-closing-line';
          closeLine.innerHTML = \`<span class="json-toggle-placeholder"></span><span class="json-bracket">\${closeBracket}</span>\${comma}\`;
          wrapper.appendChild(closeLine);

          // Stash data for lazy (re)builds.
          wrapper.__jsonValue = value;
          wrapper.__childDepth = depth + 1;
          wrapper.__built = false;

          // In lazy mode, collapse nested non-empty nodes and defer building their
          // children until the user expands them. Otherwise build immediately.
          if (count > 0 && jsonLazyMode && depth >= 1) {
            const toggle = openLine.querySelector('.json-toggle');
            toggle.classList.add('collapsed');
            children.classList.add('collapsed');
            closeLine.style.display = 'none';
          } else {
            buildJsonChildren(wrapper);
          }

          return wrapper;
        }

        // Build (or rebuild) a node's children from its stashed value. No-op if
        // already built or if the value has no children.
        function buildJsonChildren(wrapper) {
          if (!wrapper || wrapper.__built) return;
          wrapper.__built = true;
          const value = wrapper.__jsonValue;
          const depth = wrapper.__childDepth || 1;
          const children = wrapper.querySelector(':scope > .json-children');
          if (!children || !value || typeof value !== 'object') return;

          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              children.appendChild(renderJsonNode(item, '', index === value.length - 1, depth));
            });
          } else {
            const keys = Object.keys(value);
            keys.forEach((k, index) => {
              children.appendChild(renderJsonNode(value[k], k, index === keys.length - 1, depth));
            });
          }
        }

        function escapeHtml(str) {
          // Plain string replace — avoids creating a DOM node per call, which
          // is significant when rendering thousands of JSON nodes.
          return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }

        function toggleJsonNode(button) {
          if (!button || !button.classList.contains('json-toggle')) return;

          const wrapper = button.closest('.json-node-wrapper');
          // Expanding a not-yet-built node: build its children lazily first.
          const expanding = button.classList.contains('collapsed');
          if (expanding && wrapper && !wrapper.__built) {
            buildJsonChildren(wrapper);
          }

          button.classList.toggle('collapsed');
          if (wrapper) {
            const children = wrapper.querySelector(':scope > .json-children');
            const closingLine = wrapper.querySelector(':scope > .json-closing-line');

            if (children) {
              children.classList.toggle('collapsed');
            }
            if (closingLine) {
              closingLine.style.display = button.classList.contains('collapsed') ? 'none' : '';
            }
          }
        }

        function expandAllJson(btn) {
          const container = btn.closest('.json-container');
          // Build any lazily-deferred nodes first. Building a node can add more
          // unbuilt descendants, so repeat until none remain.
          let guard = 0;
          while (guard++ < 10000) {
            let builtAny = false;
            container.querySelectorAll('.json-node-wrapper').forEach(w => {
              if (!w.__built) { buildJsonChildren(w); builtAny = true; }
            });
            if (!builtAny) break;
          }
          container.querySelectorAll('.json-toggle.collapsed').forEach(toggle => {
            toggle.classList.remove('collapsed');
          });
          container.querySelectorAll('.json-children.collapsed').forEach(children => {
            children.classList.remove('collapsed');
          });
          container.querySelectorAll('.json-closing-line').forEach(line => {
            line.style.display = '';
          });
        }

        function collapseAllJson(btn) {
          const container = btn.closest('.json-container');
          container.querySelectorAll('.json-toggle').forEach(toggle => {
            toggle.classList.add('collapsed');
          });
          container.querySelectorAll('.json-children').forEach(children => {
            children.classList.add('collapsed');
          });
          container.querySelectorAll('.json-closing-line').forEach(line => {
            line.style.display = 'none';
          });
        }

        function syntaxHighlightJSON(jsonString) {
          return jsonString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
              let cls = 'json-number';
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'json-key';
                } else {
                  cls = 'json-string';
                }
              } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
              } else if (/null/.test(match)) {
                cls = 'json-null';
              }
              return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        // Build a colored status pill for a response status code.
        function statusPillHtml(status, statusText) {
          let cls = 'success';
          if (status >= 500 || status === null || status === undefined) cls = 'error';
          else if (status >= 400) cls = 'warning';
          else if (status >= 300) cls = 'redirect';
          const code = (status === null || status === undefined) ? 'Error' : status;
          const text = statusText ? '<span class="status-text">' + escapeHtml(String(statusText)) + '</span>' : '';
          return '<span class="status-pill ' + cls + '"><span class="status-dot"></span>' + escapeHtml(String(code)) + '</span>' + text;
        }

        function showResponse(data, status, statusText, responseTime, headers = {}, isLargeResponse = false, sizeInMB = 0, tempFilePath = '', timing = null) {
          console.log('showResponse called with:', { data, status, statusText, responseTime, headers, isLargeResponse, sizeInMB, tempFilePath });
          
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          const copyButton = document.getElementById('copyButton');
          const copyAsCurlButton = document.getElementById('copyAsCurlButton');

          responseContainer.style.display = 'block';
          
          let statusClass = 'response-success';
          if (status >= 500) {
            statusClass = 'response-error';
          } else if (status >= 400) {
            statusClass = 'response-warning';
          } else if (status >= 300) {
            statusClass = 'response-warning';
          }

          responseBox.className = 'response-container ' + statusClass;
          responseStatus.innerHTML = statusPillHtml(status, statusText);

  // Clear any existing large response warning
  const existingWarning = document.getElementById('large-response-warning');
  if (existingWarning) existingWarning.remove();

  if (isLargeResponse) {
    const warningHtml = \`
                <div id="large-response-warning" style="background: var(--warning); color: white; padding: var(--space-3); margin-bottom: var(--space-3); border-radius: var(--radius); display: flex; flex-direction: column; gap: var(--space-2); box-shadow: var(--shadow-sm);">
                    <div style="font-weight: 600; display: flex; align-items: center; gap: var(--space-2);">
                        <span class="material-icons">warning</span>
                        Large Response (\${sizeInMB} MB)
                    </div>
                    <div style="font-size: 0.9em;">
                        The response is too large to fully display in the preview. A truncated version is shown below.
                    </div>
                    <div style="display: flex; gap: var(--space-2); margin-top: var(--space-1);">
                        <button id="openFileBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85em; transition: background 0.2s;">
                           <span class="material-icons" style="font-size: 16px;">open_in_new</span> Open in Editor
                        </button>
                        <button id="saveFileBtn" style="background: white; color: var(--warning-dark); border: none; padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85em; font-weight: 600; transition: transform 0.1s;">
                           <span class="material-icons" style="font-size: 16px;">save</span> Save to File...
                        </button>
                    </div>
                </div>
             \`;
             responseStatus.insertAdjacentHTML('afterend', warningHtml);

    // Add listeners
    setTimeout(() => {
      const openBtn = document.getElementById('openFileBtn');
      const saveBtn = document.getElementById('saveFileBtn');

      if (openBtn) {
        openBtn.addEventListener('click', () => {
          vscode.postMessage({ type: 'openFile', filePath: tempFilePath });
        });
        openBtn.addEventListener('mouseenter', () => openBtn.style.background = 'rgba(255,255,255,0.3)');
        openBtn.addEventListener('mouseleave', () => openBtn.style.background = 'rgba(255,255,255,0.2)');
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          vscode.postMessage({ type: 'saveResponse', filePath: tempFilePath });
        });
        saveBtn.addEventListener('mousedown', () => saveBtn.style.transform = 'scale(0.95)');
        saveBtn.addEventListener('mouseup', () => saveBtn.style.transform = 'scale(1)');
      }
    }, 0);
  }

  // Update response time
  const timeSpan = responseTimeEl.querySelector('span:last-child');
  if (timeSpan) {
    timeSpan.textContent = formatResponseTime(responseTime);
  }

  // Calculate and display response size
  // If large response, use the size passed from backend, otherwise calc string length
  let sizeDisplay = 0;
  if (isLargeResponse) {
    sizeDisplay = sizeInMB * 1024 * 1024; // approx bytes
  } else {
    sizeDisplay = data ? JSON.stringify(data).length : 0;
  }

  const sizeSpan = responseSizeEl.querySelector('span:last-child');
  if (sizeSpan) {
    sizeSpan.textContent = formatResponseSize(sizeDisplay);
  }

  // Display response data in body tab
  resetResponseSearch();
  displayResponseData(data, 'pretty');

  // Display headers
  displayResponseHeaders(headers);

  // Update timing breakdown
  updateTimingBreakdown(timing, responseTime);

  // Show buttons
  copyButton.style.display = 'block';
  copyAsCurlButton.style.display = 'block';
  copyButton.className = 'copy-button';
  copyAsCurlButton.className = 'copy-as-curl';
  copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
  copyAsCurlButton.innerHTML = '<span class="material-icons">terminal</span>';
}

function showError(message, data, headers = {}, status = null, statusText = null) {
  console.log('showError called with:', { message, data, headers, status, statusText });

  const responseContainer = document.getElementById('responseContainer');
  const responseBox = document.getElementById('responseBox');
  const responseStatus = document.getElementById('responseStatus');
  const responseTimeEl = document.getElementById('responseTime');
  const responseSizeEl = document.getElementById('responseSize');
  const copyButton = document.getElementById('copyButton');
  const copyAsCurlButton = document.getElementById('copyAsCurlButton');

  responseContainer.style.display = 'block';
  responseBox.className = 'response-container response-error';
  
  if (status) {
    responseStatus.innerHTML = statusPillHtml(status, statusText || 'Error');
  } else {
    // Try to parse status code from message like "HTTP 400 - Bad Request"
    if (message && message.indexOf('HTTP ') === 0) {
      var dashIdx = message.indexOf(' - ');
      if (dashIdx > 0) {
        var codeStr = parseInt(message.substring(5, dashIdx), 10);
        var textStr = message.substring(dashIdx + 3);
        responseStatus.innerHTML = statusPillHtml(isNaN(codeStr) ? null : codeStr, textStr);
      } else {
        responseStatus.innerHTML = statusPillHtml(null, message);
      }
    } else {
      responseStatus.innerHTML = statusPillHtml(null, message || 'Error');
    }
  }
          
          // Clear timing displays
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) timeSpan.textContent = '';
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) sizeSpan.textContent = '';
          
          // Display error data if available
          if (data) {
            displayResponseData(data, 'pretty');
              copyButton.style.display = 'block';
          } else {
            const responseBody = document.getElementById('responseBody');
            responseBody.innerHTML = \`<div style="text-align: center; padding: 2rem; color: var(--gray-600);">
              <span class="material-icons" style="font-size: 3rem; margin-bottom: 1rem; display: block;">error</span>
              <div style="font-size: 1.1rem; font-weight: 500;">\${message}</div>
            </div>\`;
            copyButton.style.display = 'none';
          }
          
          // Display headers if available
          displayResponseHeaders(headers);
          
          copyAsCurlButton.style.display = 'block';
        }

        function copyResponse() {
          const responseBody = document.getElementById('responseBody');
          const button = document.getElementById('copyButton');

          // Copy the actual response payload, not the rendered tree text
          // (which would include toggle labels and "N items" previews).
          const rawData = responseBody.dataset.rawData;
          let textToCopy;
          if (rawData) {
            try {
              textToCopy = JSON.stringify(JSON.parse(rawData), null, 2);
            } catch (e) {
              textToCopy = rawData;
            }
          } else {
            textToCopy = responseBody.textContent;
          }

          vscode.postMessage({
            type: 'copyToClipboard',
            text: textToCopy
          });
          
          // Enhanced copy feedback
          const originalHtml = button.innerHTML;
          button.innerHTML = '<span class="material-icons">check</span>';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('success');
          }, 2000);
          
          showCopyFeedback('Response copied to clipboard!');
        }

        function copyAsCurl() {
          const method = document.getElementById('method-select').value;
          const url = document.getElementById('url-input').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          const button = document.getElementById('copyAsCurlButton');
          
          vscode.postMessage({
            type: 'copyAsCurl',
            method,
            url,
            headers,
            body
          });
          
          // Enhanced copy feedback
          const originalHtml = button.innerHTML;
          button.innerHTML = '<span class="material-icons">check</span>';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('success');
          }, 2000);
          
          showCopyFeedback('cURL command copied to clipboard!');
        }

        function showCopyFeedback(message) {
          // Remove existing feedback
          const existingFeedback = document.querySelector('.copy-feedback');
          if (existingFeedback) {
            existingFeedback.remove();
          }
          
          // Create new feedback
          const feedback = document.createElement('div');
          feedback.className = 'copy-feedback';
          feedback.innerHTML = \`
            <span class="material-icons">check_circle</span>
            \${message}
          \`;
          
          document.body.appendChild(feedback);
          
          setTimeout(() => {
            feedback.remove();
          }, 3000);
        }

        // Whether a request is currently in flight. While true, the Send buttons
        // act as Cancel buttons.
        let requestInFlight = false;

        // Toggle both Send buttons between "Send" and "Cancel" states.
        function setSendingState(inFlight) {
          requestInFlight = inFlight;
          ['send-btn', 'graphql-send-btn'].forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.disabled = false;
            if (inFlight) {
              btn.classList.add('is-cancelling');
              btn.innerHTML = '<span class="material-icons">close</span>Cancel';
            } else {
              btn.classList.remove('is-cancelling');
              btn.innerHTML = '<span class="material-icons">send</span>Send';
            }
          });
        }

        // Cancel the in-flight request (used when a Send button is clicked mid-flight).
        function cancelRequest() {
          vscode.postMessage({ type: 'cancelRequest' });
        }

        function sendRequest() {
          // While a request is running, the button acts as Cancel.
          if (requestInFlight) {
            cancelRequest();
            return;
          }

          const method = document.getElementById('method-select').value;
          const url = document.getElementById('url-input').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          // Array form preserves the enabled flag and duplicate keys (e.g.
          // ?id=1&id=2); the object form would collapse those to a single value.
          const queryParams = collectParamsArray('queryParams');

          if (!url) {
            showError('Please enter a URL');
            return;
          }

          try {
            new URL(url);
          } catch {
            showError('Please enter a valid URL');
            return;
          }

          if (body) {
            try {
              JSON.parse(body);
            } catch {
              showError('Invalid JSON in request body');
              return;
            }
          }

          setSendingState(true);
          showLoading();
          saveState();

          vscode.postMessage({
            type: 'sendRequest',
            method,
            url,
            headers,
            body,
            queryParams
          });
        }

        // Reveal the free-text input only when "New collection…" is picked.
        function onCollectionSelectChange() {
          const select = document.getElementById('collection-select');
          const newInput = document.getElementById('new-collection-name');
          if (!select || !newInput) return;
          if (select.value === '__new__') {
            newInput.style.display = 'block';
            setTimeout(() => newInput.focus(), 50);
          } else {
            newInput.style.display = 'none';
          }
        }

        function openSaveDialog() {
          const dialog = document.getElementById('save-dialog');
          const nameInput = document.getElementById('request-name');
          const select = document.getElementById('collection-select');
          // If there are no collections yet, default straight to the new-collection field.
          if (select && (select.value === '' || select.options.length === 1)) {
            select.value = '__new__';
          }
          onCollectionSelectChange();
          dialog.classList.add('active');
          setTimeout(() => nameInput.focus(), 100);
        }

        function closeSaveDialog() {
          const dialog = document.getElementById('save-dialog');
          dialog.classList.remove('active');
        }

        function saveRequest() {
          const name = document.getElementById('request-name').value;
          if (!name.trim()) {
            document.getElementById('request-name').focus();
            return;
          }

          const select = document.getElementById('collection-select');
          const newInput = document.getElementById('new-collection-name');
          let collectionId = select ? select.value : '';
          let newCollectionName = '';
          if (collectionId === '__new__') {
            newCollectionName = (newInput && newInput.value.trim()) || '';
            if (!newCollectionName) {
              if (newInput) newInput.focus();
              return;
            }
            collectionId = '';
          }

          const requestData = {
            name: name.trim(),
            method: document.getElementById('method-select').value,
            url: document.getElementById('url-input').value,
            headers: collectParamsArray('headers'),
            body: document.getElementById('body').value,
            queryParams: collectParamsArray('queryParams')
          };

          vscode.postMessage({
            type: 'saveRequest',
            request: requestData,
            collectionId: collectionId,
            newCollectionName: newCollectionName
          });

          closeSaveDialog();
          showCopyFeedback(\`Request "\${name}" saved successfully!\`);
        }

        // Enhanced event listeners
        document.addEventListener('DOMContentLoaded', () => {
          initializeForm();
          initializeEnhancedFeatures();

          // Tab switching
          document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
              switchTab(tab.dataset.tab);
            });
          });

          // Response tab switching
          document.querySelectorAll('.response-tab').forEach(tab => {
            tab.addEventListener('click', () => {
              switchResponseTab(tab.dataset.responseTab);
            });
          });

          // Response format switching
          document.querySelectorAll('.response-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              switchResponseFormat(btn.dataset.format);
            });
          });

          // Button event listeners
          document.getElementById('send-btn').addEventListener('click', sendRequest);
          document.getElementById('save-btn').addEventListener('click', openSaveDialog);
          document.getElementById('copyButton').addEventListener('click', copyResponse);
          document.getElementById('copyAsCurlButton').addEventListener('click', copyAsCurl);
          
          // Dialog event listeners
          document.getElementById('dialog-cancel').addEventListener('click', closeSaveDialog);
          document.getElementById('dialog-save').addEventListener('click', saveRequest);
          const collectionSelect = document.getElementById('collection-select');
          if (collectionSelect) collectionSelect.addEventListener('change', onCollectionSelectChange);
          
          // Close dialog on backdrop click
          document.getElementById('save-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'save-dialog') {
              closeSaveDialog();
            }
          });

          // Setup response search
          setupResponseSearch();
          
          // Keyboard shortcuts
          document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to send request
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              sendRequest();
            }
            
            // Escape to close dialog
            if (e.key === 'Escape') {
              closeSaveDialog();
            }
            
            // Ctrl/Cmd + S to save request
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              openSaveDialog();
            }
          });

          // Input change listeners
          document.getElementById('method-select').addEventListener('change', () => {
            updateMethodSelectColor();
            saveState();
          });
          document.getElementById('url-input').addEventListener('input', saveState);
          document.getElementById('body').addEventListener('input', saveState);
          
          // Enhanced URL input with better UX
          const urlInput = document.getElementById('url-input');
          urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendRequest();
            }
          });
          
          // Auto-save request name when typing
          const nameInput = document.getElementById('request-name');
          nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveRequest();
            }
          });
        });

        // Optimized Feature Initialization
        function initializeEnhancedFeatures() {
          // Minimal essential features only
          document.documentElement.style.scrollBehavior = 'smooth';
          
          // Initialize core features without delays
          initializeTooltips();
          initializeNotificationSystem();
        }

        // Removed button enhancements for faster loading

        function createRippleEffect(element, event) {
          const ripple = document.createElement('span');
          const rect = element.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;
          
          ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
          \`;
          
          element.style.position = 'relative';
          element.style.overflow = 'hidden';
          element.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        }

        function initializeTooltips() {
          // Add tooltips to elements with data-tooltip attribute
          document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.classList.add('tooltip');
          });
          
          // Add tooltips to common elements
          const tooltipElements = [
            { selector: '#send-btn', text: 'Send Request (Ctrl+Enter)' },
            { selector: '#save-btn', text: 'Save Request (Ctrl+S)' },
            { selector: '#copyButton', text: 'Copy Response' },
            { selector: '#copyAsCurlButton', text: 'Copy as cURL' },
            { selector: '#method-select', text: 'Select HTTP Method' },
            { selector: '#url-input', text: 'Enter API URL' }
          ];
          
          tooltipElements.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            if (element && !element.hasAttribute('data-tooltip')) {
              element.setAttribute('data-tooltip', text);
              element.classList.add('tooltip');
            }
          });
        }

        // Removed focus enhancements for faster loading

        function initializeNotificationSystem() {
          // Create notification container if it doesn't exist
          if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = \`
              position: fixed;
              top: 1rem;
              right: 1rem;
              z-index: 10000;
              pointer-events: none;
            \`;
            document.body.appendChild(container);
          }
        }

        function showNotification(message, type = 'info', duration = 4000) {
          const container = document.getElementById('notification-container');
          const notification = document.createElement('div');
          
          const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
          };
          
          notification.className = \`notification \${type}\`;
          notification.innerHTML = \`
            <div class="notification-content">
              <div class="notification-icon" style="background: var(--\${type})">
                \${icons[type] || icons.info}
              </div>
              <div class="notification-text">
                <div class="notification-message">\${message}</div>
              </div>
            </div>
          \`;
          
          container.appendChild(notification);
          
          // Auto remove after duration
          setTimeout(() => {
            notification.style.animation = 'slideInFromRight 0.3s reverse';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove();
              }
            }, 300);
          }, duration);
          
          return notification;
        }

        function setButtonLoading(button, loading = true) {
          if (loading) {
            button.dataset.loading = 'true';
            button.classList.add('btn-loading');
            button.disabled = true;
          } else {
            button.dataset.loading = 'false';
            button.classList.remove('btn-loading');
            button.disabled = false;
          }
        }

        function animateElement(element, animation, duration = 300) {
          return new Promise(resolve => {
            element.style.animation = \`\${animation} \${duration}ms ease-out\`;
            setTimeout(() => {
              element.style.animation = '';
              resolve();
            }, duration);
          });
        }

        function smoothScrollTo(element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }

        // Enhanced form interactions
        function enhanceFormInputs() {
          // Add floating label effect
          document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
              input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
              if (!input.value) {
                input.parentElement.classList.remove('focused');
              }
            });
            
            // Check initial state
            if (input.value) {
              input.parentElement.classList.add('focused');
            }
          });
        }

        // Removed enhanced parameter row animations for better performance

        // Request Type Switching
        function switchRequestType(type) {
          currentState.type = type;
          
          // Update tabs
          document.querySelectorAll('.type-tab').forEach(tab => {
            if (tab.dataset.type === type) {
              tab.classList.add('active');
            } else {
              tab.classList.remove('active');
            }
          });

          // Update content visibility
          document.querySelectorAll('.request-content').forEach(content => {
            content.classList.remove('active');
          });
          
          if (type === 'graphql') {
            document.getElementById('graphql-content').classList.add('active');
          } else {
            document.getElementById('rest-content').classList.add('active');
          }
          
          saveState();
        }

        function switchGraphQLTab(tabId) {
          const tabs = document.querySelectorAll('#graphql-content .tab');
          const sections = document.querySelectorAll('#graphql-content .content-section');
          
          tabs.forEach(tab => tab.classList.remove('active'));
          sections.forEach(section => section.classList.remove('active'));
          
          document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
          
          // Map tab IDs to section IDs
          const sectionMap = {
            'query': 'query-section',
            'variables': 'variables-section',
            'graphql-headers': 'graphql-headers-section'
          };
          
          document.getElementById(sectionMap[tabId]).classList.add('active');
        }

        // Enhanced method select with smooth transitions
        function updateMethodSelectColorEnhanced() {
          const select = document.getElementById('method-select');
          const method = select.value;
          
          // Add pulse animation
          select.style.animation = 'pulse 0.3s ease-out';
          
          setTimeout(() => {
            select.style.animation = '';
          }, 300);
          
          // Update color with transition
          const colors = {
            'GET': 'var(--method-get)',
            'POST': 'var(--method-post)',
            'PUT': 'var(--method-put)',
            'DELETE': 'var(--method-delete)',
            'PATCH': 'var(--method-patch)',
            'HEAD': 'var(--method-head)',
            'OPTIONS': 'var(--method-options)'
          };
          
          select.style.background = colors[method] || 'var(--gray-500)';
        }

        function sendGraphQLRequest() {
          // While a request is running, the button acts as Cancel.
          if (requestInFlight) {
            cancelRequest();
            return;
          }

          const url = document.getElementById('graphql-url-input').value;
          const query = document.getElementById('graphql-query').value;
          const variables = document.getElementById('graphql-variables').value;
          const headers = collectParams('graphql-headers');

          if (!url) {
            showError('Please enter a GraphQL URL');
            return;
          }

          if (!query) {
            showError('Please enter a GraphQL Query');
            return;
          }

          // Validate variables JSON before sending (avoids a silent throw here).
          let parsedVariables;
          if (variables) {
            try {
              parsedVariables = JSON.parse(variables);
            } catch {
              showError('Invalid JSON in GraphQL variables');
              return;
            }
          }

          setSendingState(true);
          showLoading();
          saveState();

          vscode.postMessage({
            type: 'sendRequest',
            requestType: 'graphql',
            method: 'POST', // GraphQL is always POST
            url,
            headers,
            body: JSON.stringify({
              query,
              variables: parsedVariables
            })
          });
        }

        // This function is now defined above, removing duplicate

        // Update initializeForm to restore GraphQL fields
        function initializeForm() {
          // Restore request type
          if (currentState.type) {
            switchRequestType(currentState.type);
          }

          // REST fields
          document.getElementById('method-select').value = currentState.method || 'GET';
          document.getElementById('url-input').value = currentState.url || '';
          document.getElementById('body').value = currentState.body || '';

          // Update method select color on initialization
          updateMethodSelectColor();

          // Restore query parameters - handle empty arrays properly
          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          if (currentState.queryParams && Array.isArray(currentState.queryParams) && currentState.queryParams.length > 0) {
            currentState.queryParams.forEach(param => {
              if (param && (param.key || param.value)) {
                addParamRow('queryParams', param);
              }
            });
          }
          // Always ensure at least one empty row exists
          if (queryParamsContainer.children.length === 0) {
            addParamRow('queryParams');
          }

          // Restore headers - handle empty arrays properly
          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          if (currentState.headers && Array.isArray(currentState.headers) && currentState.headers.length > 0) {
            currentState.headers.forEach(header => {
              if (header && (header.key || header.value)) {
                addParamRow('headers', header);
              }
            });
          }
          // Always ensure at least one empty row exists
          if (headersContainer.children.length === 0) {
            addParamRow('headers');
          }

          // GraphQL fields
          document.getElementById('graphql-url-input').value = currentState.graphqlUrl || '';
          document.getElementById('graphql-query').value = currentState.graphqlQuery || '';
          document.getElementById('graphql-variables').value = currentState.graphqlVariables || '';

          // Restore GraphQL headers - handle empty arrays properly
          const graphqlHeadersContainer = document.getElementById('graphql-headers');
          graphqlHeadersContainer.innerHTML = '';
          if (currentState.graphqlHeaders && Array.isArray(currentState.graphqlHeaders) && currentState.graphqlHeaders.length > 0) {
            currentState.graphqlHeaders.forEach(header => {
              if (header && (header.key || header.value)) {
                addParamRow('graphql-headers', header);
              }
            });
          }
          // Always ensure at least one empty row exists
          if (graphqlHeadersContainer.children.length === 0) {
            addParamRow('graphql-headers');
          }
        }

        // Message handler for VS Code communication
        window.addEventListener('message', event => {
          const message = event.data;
          console.log('Received message:', message);
          
          switch (message.type) {
            case 'response':
              console.log('Handling response:', message);
              setSendingState(false);
              showResponse(message.data, message.status, message.statusText, message.responseTime, message.headers || {}, message.isLargeResponse, message.sizeInMB, message.tempFilePath, message.timing || null);
              break;

            case 'error':
              console.log('Handling error:', message);
              setSendingState(false);
              showError(message.message, message.data, message.headers || {}, message.status || null, message.statusText || null);
              break;

            case 'cancelled':
              console.log('Request cancelled');
              setSendingState(false);
              showError('Request cancelled');
              break;

            case 'copySuccess':
              console.log('Copy success:', message);
              showCopyFeedback(message.message || 'Copied to clipboard!');
              break;
              
            default:
              console.warn('Unknown message type:', message.type);
          }
        });

        // Add event listeners for GraphQL elements
        document.addEventListener('DOMContentLoaded', () => {
            // ... existing listeners ...
            document.getElementById('graphql-send-btn').addEventListener('click', sendGraphQLRequest);
            
            // GraphQL input listeners for auto-save
            document.getElementById('graphql-url-input').addEventListener('input', saveState);
            document.getElementById('graphql-query').addEventListener('input', saveState);
            document.getElementById('graphql-variables').addEventListener('input', saveState);
        });
      </script>
    </body>
    </html>
  `;
} 
