import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('restApiTest.sendRequest', async () => {
    const panel = vscode.window.createWebviewPanel(
      'restApiTest',
      'REST TEST',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true // Keep the webview's content loaded when hidden
      }
    );

    // Get the stored state
    const storedState = context.globalState.get('restApiTesterState', {
      method: 'GET',
      url: '',
      body: '',
      headers: [{ key: '', value: '' }],
      queryParams: [{ key: '', value: '' }]
    });

    panel.webview.html = getWebviewContent(storedState);

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'saveState':
          // Save the current state
          await context.globalState.update('restApiTesterState', message.state);
          return;

        case 'sendRequest':
          const { method, url, body, headers, queryParams } = message;
          try {
            // Convert query params to URL search params
            const urlObj = new URL(url);
            if (queryParams) {
              Object.entries(queryParams).forEach(([key, value]) => {
                if (value) {
                  urlObj.searchParams.append(key, value as string);
                }
              });
            }

            const response = await axios({
              method: method.toLowerCase(),
              url: urlObj.toString(),
              data: body ? JSON.parse(body) : undefined,
              headers: headers || {},
            });

            panel.webview.postMessage({
              type: 'response',
              status: response.status,
              statusText: response.statusText,
              data: JSON.stringify(response.data, null, 2),
            });
          } catch (error) {
            let errorMessage = 'An unknown error occurred.';
            if (axios.isAxiosError(error) && error.response) {
              errorMessage = `Status: ${error.response.status} - ${error.response.statusText}`;
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }
            panel.webview.postMessage({
              type: 'error',
              message: errorMessage,
            });
          }
          break;
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(initialState: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>REST API</title>
      <style>
        :root {
          --blue-500: #0066FF;
          --blue-600: #0055D4;
          --gray-50: #F9FAFB;
          --gray-100: #F3F4F6;
          --gray-200: #E5E7EB;
          --gray-300: #D1D5DB;
          --gray-700: #374151;
          --gray-800: #1F2937;
          --green-100: #DCFCE7;
          --green-500: #22C55E;
          --red-100: #FEE2E2;
          --red-500: #EF4444;
          --radius: 8px;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 2rem;
          background: white;
          color: var(--gray-800);
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          color: var(--blue-500);
          font-size: 2rem;
          margin: 0;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: var(--gray-50);
          padding: 2rem;
          border-radius: var(--radius);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        select, input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          background: white;
          font-size: 0.875rem;
          font-family: inherit;
        }

        select {
          max-width: 150px;
        }

        .params-container {
          margin-bottom: 1rem;
        }

        .param-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .param-row input {
          flex: 1;
        }

        .param-row button {
          width: auto;
          padding: 0.75rem 1rem;
        }

        .add-row-button {
          background: var(--green-500);
        }

        .remove-row-button {
          background: var(--red-500);
        }

        button {
          padding: 0.75rem;
          background: var(--blue-500);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .send-button {
          width: 100%;
        }

        button:hover {
          background: var(--blue-600);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .response-container {
          margin-top: 1.5rem;
        }

        .response-box {
          background: var(--green-100);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .response-header {
          padding: 0.75rem 1rem;
          background: var(--green-500);
          color: white;
          font-weight: 500;
        }

        .response-error {
          background: var(--red-100);
        }

        .response-error .response-header {
          background: var(--red-500);
        }

        .response-body {
          padding: 1rem;
          font-family: 'Menlo', Monaco, 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--gray-700);
        }

        .loading::after {
          content: '';
          width: 1rem;
          height: 1rem;
          border: 2px solid var(--gray-300);
          border-top-color: var(--blue-500);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-left: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .section-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--gray-700);
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>REST TEST</h1>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="method">Request Method</label>
          <select id="method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div class="form-group">
          <label for="url">Request URL</label>
          <input type="text" id="url" placeholder="https://api.example.com/endpoint" />
        </div>

        <div class="form-group">
          <div class="section-title">Query Parameters</div>
          <div id="queryParams" class="params-container">
          </div>
          <button class="add-row-button" onclick="addParamRow('queryParams')">Add Query Parameter</button>
        </div>

        <div class="form-group">
          <div class="section-title">Headers</div>
          <div id="headers" class="params-container">
          </div>
          <button class="add-row-button" onclick="addParamRow('headers')">Add Header</button>
        </div>

        <div class="form-group">
          <label for="body">Request Body (JSON)</label>
          <textarea id="body" placeholder="{\n  \"key\": \"value\"\n}" rows="5"></textarea>
        </div>

        <button onclick="sendRequest()" id="sendButton" class="send-button">Send Request</button>

        <div class="response-container" id="responseContainer" style="display: none;">
          <div class="response-box" id="responseBox">
            <div class="response-header" id="responseHeader"></div>
            <div class="response-body" id="responseBody"></div>
          </div>
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const initialState = ${JSON.stringify(initialState)};
        let currentState = { ...initialState };

        // Initialize the form with saved state
        function initializeForm() {
          document.getElementById('method').value = currentState.method;
          document.getElementById('url').value = currentState.url;
          document.getElementById('body').value = currentState.body;

          // Initialize query parameters
          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          currentState.queryParams.forEach(param => addParamRow('queryParams', param));
          if (currentState.queryParams.length === 0) {
            addParamRow('queryParams');
          }

          // Initialize headers
          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          currentState.headers.forEach(header => addParamRow('headers', header));
          if (currentState.headers.length === 0) {
            addParamRow('headers');
          }
        }

        // Save current state
        function saveState() {
          currentState = {
            method: document.getElementById('method').value,
            url: document.getElementById('url').value,
            body: document.getElementById('body').value,
            queryParams: collectParamsArray('queryParams'),
            headers: collectParamsArray('headers')
          };
          
          vscode.postMessage({
            type: 'saveState',
            state: currentState
          });
        }

        // Add input event listeners to all form elements
        function addStateListeners() {
          document.getElementById('method').addEventListener('change', saveState);
          document.getElementById('url').addEventListener('input', saveState);
          document.getElementById('body').addEventListener('input', saveState);
        }

        function addParamRow(containerId, initialValue = { key: '', value: '' }) {
          const container = document.getElementById(containerId);
          const row = document.createElement('div');
          row.className = 'param-row';
          row.innerHTML = \`
            <input type="text" placeholder="Key" value="\${initialValue.key}" />
            <input type="text" placeholder="Value" value="\${initialValue.value}" />
            <button class="remove-row-button" onclick="removeParamRow(this)">×</button>
          \`;

          // Add input listeners to new row
          const inputs = row.getElementsByTagName('input');
          for (const input of inputs) {
            input.addEventListener('input', saveState);
          }

          container.appendChild(row);
        }

        function removeParamRow(button) {
          const row = button.parentElement;
          const container = row.parentElement;
          if (container.children.length > 1) {
            container.removeChild(row);
            saveState();
          }
        }

        function collectParamsArray(containerId) {
          const params = [];
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const inputs = row.getElementsByTagName('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key || value) {
              params.push({ key, value });
            }
          }
          
          return params;
        }

        function collectParams(containerId) {
          const params = {};
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const inputs = row.getElementsByTagName('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key) {
              params[key] = value;
            }
          }
          
          return params;
        }

        function formatJSON(json) {
          try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return JSON.stringify(obj, null, 2);
          } catch {
            return json;
          }
        }

        function sendRequest() {
          const method = document.getElementById('method').value;
          const url = document.getElementById('url').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          const queryParams = collectParams('queryParams');

          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseHeader = document.getElementById('responseHeader');
          const responseBody = document.getElementById('responseBody');
          const sendButton = document.getElementById('sendButton');

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
              showError('Please enter valid JSON in the request body');
              return;
            }
          }

          sendButton.disabled = true;
          responseContainer.style.display = 'block';
          responseBox.className = 'response-box';
          responseHeader.textContent = 'Sending request...';
          responseBody.innerHTML = '<div class="loading"></div>';

          vscode.postMessage({ 
            type: 'sendRequest',
            method, 
            url, 
            body, 
            headers, 
            queryParams 
          });
        }

        function showError(message) {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseHeader = document.getElementById('responseHeader');
          const responseBody = document.getElementById('responseBody');

          responseContainer.style.display = 'block';
          responseBox.className = 'response-box response-error';
          responseHeader.textContent = 'Error';
          responseBody.textContent = message;
        }

        window.addEventListener('message', event => {
          const message = event.data;
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseHeader = document.getElementById('responseHeader');
          const responseBody = document.getElementById('responseBody');
          const sendButton = document.getElementById('sendButton');

          sendButton.disabled = false;
          responseContainer.style.display = 'block';

          if (message.type === 'response') {
            responseBox.className = 'response-box';
            responseHeader.textContent = \`Status: \${message.status} \${message.statusText}\`;
            responseBody.textContent = formatJSON(message.data);
          } else if (message.type === 'error') {
            responseBox.className = 'response-box response-error';
            responseHeader.textContent = 'Error';
            responseBody.textContent = message.message;
          }
        });

        // Initialize the form and add listeners when the page loads
        document.addEventListener('DOMContentLoaded', () => {
          initializeForm();
          addStateListeners();
        });
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}