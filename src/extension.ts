import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  // Register view container
  const restApiContainer = vscode.window.createTreeView('restApiTesterView', {
    treeDataProvider: new RestApiTreeProvider(),
    showCollapseAll: true
  });

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('restApiTesterView', new RestApiTreeProvider())
  );

  let disposable = vscode.commands.registerCommand('restApiTest.sendRequest', async () => {
    const panel = vscode.window.createWebviewPanel(
      'restApiTest',
      'REST TEST',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

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
          await context.globalState.update('restApiTesterState', message.state);
          return;

        case 'copyToClipboard':
          await vscode.env.clipboard.writeText(message.text);
          panel.webview.postMessage({
            type: 'copySuccess',
            source: 'response'
          });
          return;

        case 'copyAsCurl':
          const curlCommand = generateCurlCommand(message);
          await vscode.env.clipboard.writeText(curlCommand);
          panel.webview.postMessage({
            type: 'copySuccess',
            source: 'curl'
          });
          return;

        case 'sendRequest':
          const { method, url, body, headers, queryParams } = message;
          try {
            const urlObj = new URL(url);
            if (queryParams) {
              Object.entries(queryParams).forEach(([key, value]) => {
                if (value) {
                  urlObj.searchParams.append(key, value as string);
                }
              });
            }

            const startTime = Date.now();
            const response = await axios({
              method: method.toLowerCase(),
              url: urlObj.toString(),
              data: body ? JSON.parse(body) : undefined,
              headers: headers || {},
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            panel.webview.postMessage({
              type: 'response',
              status: response.status,
              statusText: response.statusText,
              data: JSON.stringify(response.data, null, 2),
              responseTime: responseTime
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

// Tree Data Provider for the sidebar
class RestApiTreeProvider implements vscode.TreeDataProvider<RestApiItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RestApiItem | undefined | null | void> = new vscode.EventEmitter<RestApiItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RestApiItem | undefined | null | void> = this._onDidChangeTreeData.event;

  getTreeItem(element: RestApiItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RestApiItem): Thenable<RestApiItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const items = [
      new RestApiItem(
        'New Request',
        'Send a new API request',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'restApiTest.sendRequest',
          title: 'Send Request',
          arguments: []
        }
      )
    ];

    return Promise.resolve(items);
  }
}

// Tree Item class for the sidebar
class RestApiItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
  }

  iconPath = new vscode.ThemeIcon('arrow-right');
}

function generateCurlCommand(request: any): string {
  const { method, url, headers, body } = request;
  let curlCmd = `curl -X ${method} '${url}'`;

  // Add headers
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (key && value) {
        curlCmd += `\n  -H '${key}: ${value}'`;
      }
    });
  }

  // Add request body if present
  if (body) {
    try {
      // Ensure the body is properly formatted JSON
      const formattedBody = JSON.stringify(JSON.parse(body));
      curlCmd += `\n  -d '${formattedBody}'`;
    } catch {
      curlCmd += `\n  -d '${body}'`;
    }
  }

  return curlCmd;
}

export function deactivate() {}

function getWebviewContent(initialState: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>REST API Tester</title>
      <style>
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --success: #22c55e;
          --error: #ef4444;
          --gray-50: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-300: #cbd5e1;
          --gray-400: #94a3b8;
          --gray-500: #64748b;
          --gray-600: #475569;
          --gray-700: #334155;
          --gray-800: #1e293b;
          --gray-900: #0f172a;
          --radius-sm: 4px;
          --radius: 8px;
          --radius-lg: 12px;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          line-height: 1.5;
          background: var(--gray-50);
          color: var(--gray-800);
          padding: 1rem;
        }

        .form-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .request-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
          align-items: center;
        }

        select,
        input,
        textarea {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          background: white;
          color: var(--gray-800);
          font-size: 0.875rem;
          line-height: 1.25rem;
          transition: all 0.2s;
        }

        select:hover,
        input:hover,
        textarea:hover {
          border-color: var(--gray-300);
        }

        select:focus,
        input:focus,
        textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .method-select {
          width: 120px;
          height: 40px;
          border-radius: var(--radius);
          cursor: pointer;
          font-weight: 500;
        }

        .url-input {
          height: 40px;
        }

        .send-button {
          height: 40px;
          padding: 0 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .send-button:hover {
          background: var(--primary-dark);
        }

        .send-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 1rem 0;
          border-bottom: 1px solid var(--gray-200);
          background: var(--gray-50);
        }

        .tab {
          padding: 0.75rem 1.5rem;
          color: var(--gray-600);
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          user-select: none;
        }

        .tab:hover {
          color: var(--primary);
        }

        .tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .tab-content {
          padding: 1.5rem;
        }

        .content-section {
          display: none;
        }

        .content-section.active {
          display: block;
        }

        .param-row {
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .add-param-button {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          color: var(--primary);
          background: transparent;
          border: 1px dashed var(--primary);
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-param-button:hover {
          background: var(--gray-50);
        }

        .remove-param-button {
          padding: 0.5rem;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--error);
          background: transparent;
          border: 1px solid currentColor;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .remove-param-button:hover {
          background: var(--error);
          color: white;
          border-color: var(--error);
        }

        .remove-param-button:active {
          transform: scale(0.95);
        }

        .remove-param-button svg {
          width: 16px;
          height: 16px;
        }

        .response-container {
          margin-top: 1rem;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .response-header {
          padding: 0.75rem 1rem;
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .response-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .response-time {
          font-size: 0.875rem;
          color: var(--gray-600);
          padding: 0.25rem 0.75rem;
          background: var(--gray-100);
          border-radius: var(--radius);
        }

        .response-success .response-time {
          color: white;
          background: rgba(255, 255, 255, 0.2);
        }

        .response-error .response-time {
          color: white;
          background: rgba(255, 255, 255, 0.2);
        }

        .response-body {
          padding: 1rem;
          background: white;
          font-family: 'Menlo', Monaco, 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-x: auto;
        }

        .response-success .response-header {
          background: var(--success);
          color: white;
        }

        .response-error .response-header {
          background: var(--error);
          color: white;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
        }

        .copy-button,
        .copy-as-curl {
        padding: 0.25rem 0.75rem;
          background: transparent;
          color: inherit;
          border: 1px solid currentColor;
          border-radius: var(--radius);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .copy-button:hover,
        .copy-as-curl:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .copy-button.success,
        .copy-as-curl.success {
          background: var(--success);
          color: white;
          border-color: var(--success);
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--gray-500);
          gap: 0.5rem;
        }

        .loading::after {
          content: '';
          width: 1rem;
          height: 1rem;
          border: 2px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fade {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }

        .copy-feedback {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          background: var(--success);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          animation: fade 2s ease-in-out;
          pointer-events: none;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <div class="request-row">
          <select id="method" class="method-select">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input type="text" id="url" class="url-input" placeholder="Enter request URL" />
          <button onclick="sendRequest()" id="sendButton" class="send-button">
            Send
          </button>
        </div>

        <div class="tabs">
          <div class="tab active" data-tab="params">Params</div>
          <div class="tab" data-tab="headers">Headers</div>
          <div class="tab" data-tab="body">Body</div>
        </div>

        <div class="tab-content">
          <div id="params-section" class="content-section active">
            <div id="queryParams" class="param-rows"></div>
            <button class="add-param-button" onclick="addParamRow('queryParams')">
              + Add Parameter
            </button>
          </div>

          <div id="headers-section" class="content-section">
            <div id="headers" class="param-rows"></div>
            <button class="add-param-button" onclick="addParamRow('headers')">
              + Add Header
            </button>
          </div>

          <div id="body-section" class="content-section">
            <textarea id="body" placeholder="{\n  \\"key\\": \\"value\\"\n}" rows="10"></textarea>
          </div>
        </div>

        <div id="responseContainer" style="display: none;">
          <div id="responseBox" class="response-container">
            <div id="responseHeader" class="response-header">
              <div class="response-status">
                <span id="responseStatus"></span>
                <span id="responseTime" class="response-time"></span>
              </div>
              <div class="button-group">
                <button id="copyAsCurlButton" class="copy-as-curl" onclick="copyAsCurl()">
                  Copy as cURL
                </button>
                <button id="copyButton" class="copy-button" onclick="copyResponse()">
                  Copy Response
                </button>
              </div>
            </div>
            <div id="responseBody" class="response-body"></div>
          </div>
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const initialState = ${JSON.stringify(initialState)};
        let currentState = { ...initialState };

        function switchTab(tabId) {
          document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
          });
          document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
          });
          
          document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
          document.getElementById(\`\${tabId}-section\`).classList.add('active');
        }

        function initializeForm() {
          document.getElementById('method').value = currentState.method;
          document.getElementById('url').value = currentState.url;
          document.getElementById('body').value = currentState.body;

          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          currentState.queryParams.forEach(param => addParamRow('queryParams', param));
          if (currentState.queryParams.length === 0) {
            addParamRow('queryParams');
          }

          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          currentState.headers.forEach(header => addParamRow('headers', header));
          if (currentState.headers.length === 0) {
            addParamRow('headers');
          }
        }

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

        function addParamRow(containerId, initialValue = { key: '', value: '' }) {
          const container = document.getElementById(containerId);
          const row = document.createElement('div');
          row.className = 'param-row';
          
          row.innerHTML = \`
            <input type="text" placeholder="Key" value="\${initialValue.key}" />
            <input type="text" placeholder="Value" value="\${initialValue.value}" />
            <button class="remove-param-button" onclick="removeParamRow(this)" aria-label="Delete parameter">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          \`;

          const inputs = row.getElementsByTagName('input');
          for (const input of inputs) {
            input.addEventListener('input', () => {
              if (containerId === 'queryParams') {
                updateURLWithParams();
              } else {
                saveState();
              }
            });
          }

          container.appendChild(row);
        }

        function removeParamRow(button) {
          const row = button.parentElement;
          const container = row.parentElement;
          container.removeChild(row);
          
          if (container.children.length === 0) {
            addParamRow(container.id);
          }
          
          if (container.id === 'queryParams') {
            updateURLWithParams();
          } else {
            saveState();
          }
        }

        function formatResponseTime(ms) {
          if (ms < 1000) {
            return \`\${ms}ms\`;
          }
          return \`\${(ms / 1000).toFixed(2)}s\`;
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

        function updateURLWithParams() {
          const urlInput = document.getElementById('url');
          const baseURL = urlInput.value.split('?')[0];
          const queryParams = collectParamsArray('queryParams');
          
          if (queryParams.length > 0 && queryParams.some(param => param.key)) {
            const searchParams = new URLSearchParams();
            queryParams.forEach(param => {
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
          
          responseContainer.style.display = 'block';
          responseBox.className = 'response-container';
          responseStatus.textContent = 'Sending request...';
          responseTimeEl.textContent = '';
          responseBody.innerHTML = '<div class="loading">Processing request</div>';
        }

        function showResponse(data, status, statusText, responseTime) {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseTimeEl = document.getElementById('responseTime');
          const responseBody = document.getElementById('responseBody');
          const copyButton = document.getElementById('copyButton');
          const copyAsCurlButton = document.getElementById('copyAsCurlButton');

          responseContainer.style.display = 'block';
          responseBox.className = 'response-container response-success';
          responseStatus.textContent = \`Status: \${status} - \${statusText}\`;
          responseTimeEl.textContent = formatResponseTime(responseTime);
          responseBody.textContent = formatJSON(data);
          copyButton.style.display = 'block';
          copyAsCurlButton.style.display = 'block';
          copyButton.className = 'copy-button';
          copyAsCurlButton.className = 'copy-as-curl';
          copyButton.textContent = 'Copy Response';
          copyAsCurlButton.textContent = 'Copy as cURL';
        }

        function showError(message) {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseTimeEl = document.getElementById('responseTime');
          const responseBody = document.getElementById('responseBody');
          const copyButton = document.getElementById('copyButton');
          const copyAsCurlButton = document.getElementById('copyAsCurlButton');

          responseContainer.style.display = 'block';
          responseBox.className = 'response-container response-error';
          responseStatus.textContent = 'Error';
          responseTimeEl.textContent = '';
          responseBody.textContent = message;
          copyButton.style.display = 'none';
          copyAsCurlButton.style.display = 'none';
        }

        function formatJSON(json) {
          try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return JSON.stringify(obj, null, 2);
          } catch {
            return json;
          }
        }

        function copyResponse() {
          const responseBody = document.getElementById('responseBody');
          vscode.postMessage({
            type: 'copyToClipboard',
            text: responseBody.textContent
          });
        }

        function copyAsCurl() {
          const method = document.getElementById('method').value;
          const url = document.getElementById('url').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          
          vscode.postMessage({
            type: 'copyAsCurl',
            method,
            url,
            headers,
            body
          });
        }

        function sendRequest() {
          const method = document.getElementById('method').value;
          const url = document.getElementById('url').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          const queryParams = collectParams('queryParams');

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

          const sendButton = document.getElementById('sendButton');
          sendButton.disabled = true;
          showLoading();

          vscode.postMessage({ 
            type: 'sendRequest',
            method, 
            url, 
            body, 
            headers, 
            queryParams 
          });
        }

        // Add event listeners
        document.querySelectorAll('.tab').forEach(tab => {
          tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
          });
        });

        document.getElementById('method').addEventListener('change', saveState);
        document.getElementById('url').addEventListener('input', (e) => {
          if (!e.target.value.includes('?')) {
            updateURLWithParams();
          }
          saveState();
        });
        document.getElementById('body').addEventListener('input', saveState);

        window.addEventListener('message', event => {
          const message = event.data;
          const sendButton = document.getElementById('sendButton');
          sendButton.disabled = false;

          if (message.type === 'response') {
          showResponse(message.data, message.status, message.statusText, message.responseTime);
          } else if (message.type === 'error') {
            showError(message.message);
          } else if (message.type === 'copySuccess') {
            const buttonId = message.source === 'curl' ? 'copyAsCurlButton' : 'copyButton';
            const button = document.getElementById(buttonId);
            
            if (message.source === 'curl') {
              button.className = 'copy-as-curl success';
            } else {
              button.className = 'copy-button success';
            }
            button.textContent = 'Copied!';

            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = message.source === 'curl' ? 
              'cURL command copied to clipboard' : 
              'Response copied to clipboard';
            document.body.appendChild(feedback);

            setTimeout(() => {
              if (message.source === 'curl') {
                button.className = 'copy-as-curl';
                button.textContent = 'Copy as cURL';
              } else {
                button.className = 'copy-button';
                button.textContent = 'Copy Response';
              }
            }, 2000);

            setTimeout(() => {
              document.body.removeChild(feedback);
            }, 2000);
          }
        });

        // Initialize the form when the page loads
        document.addEventListener('DOMContentLoaded', () => {
          initializeForm();
          updateURLWithParams();
        });
      </script>
    </body>
    </html>
  `;
}