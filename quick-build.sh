#!/bin/bash

echo "🔧 Quick Build & Test"
echo "===================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first:"
    echo "   sudo apt install nodejs npm"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first:"
    echo "   sudo apt install nodejs npm"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To test the extension:"
    echo "1. Open this project in VS Code"
    echo "2. Press F5 to run the extension"
    echo "3. In the new VS Code window, use Ctrl+Shift+P"
    echo "4. Type 'REST TEST' to open the API tester"
    echo ""
    echo "🐛 Debug info:"
    echo "- Check the Debug Console for logs"
    echo "- Open Developer Tools in the webview (right-click → Inspect)"
    echo "- Look for console.log messages to debug response issues"
else
    echo "❌ Build failed!"
    exit 1
fi 