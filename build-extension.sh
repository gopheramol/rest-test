#!/bin/bash

# REST API Tester Extension Build Script
# This script builds and packages the VS Code extension

echo "🚀 Building REST API Tester Extension with Modern UI"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js first:"
    echo "sudo apt update && sudo apt install -y nodejs npm"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    echo "Please install npm first:"
    echo "sudo apt update && sudo apt install -y nodejs npm"
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install vsce if not already installed
if ! command -v vsce &> /dev/null; then
    print_warning "vsce is not installed. Installing globally..."
    npm install -g @vscode/vsce
    if [ $? -eq 0 ]; then
        print_success "vsce installed successfully!"
    else
        print_error "Failed to install vsce. You may need to run with sudo:"
        echo "sudo npm install -g @vscode/vsce"
        exit 1
    fi
fi

print_status "vsce version: $(vsce --version)"

# Install project dependencies
print_status "Installing project dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf out/
rm -f *.vsix

# Compile TypeScript
print_status "Compiling TypeScript..."
npm run compile
if [ $? -eq 0 ]; then
    print_success "TypeScript compilation successful!"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Run linting
print_status "Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_success "Linting passed!"
else
    print_warning "Linting issues found, but continuing..."
fi

# Package the extension
print_status "Packaging extension..."
vsce package
if [ $? -eq 0 ]; then
    print_success "Extension packaged successfully!"
    
    # Find the generated .vsix file
    VSIX_FILE=$(ls *.vsix 2>/dev/null | head -n 1)
    if [ -n "$VSIX_FILE" ]; then
        print_success "Generated: $VSIX_FILE"
        echo ""
        echo "🎉 Extension built successfully!"
        echo "📦 Package: $VSIX_FILE"
        echo ""
        echo "To install in VS Code:"
        echo "1. Open VS Code"
        echo "2. Press Ctrl+Shift+P"
        echo "3. Type 'Extensions: Install from VSIX'"
        echo "4. Select the file: $VSIX_FILE"
        echo ""
        echo "Or run: code --install-extension $VSIX_FILE"
        echo ""
        echo "🎨 Features included:"
        echo "  ✅ Beautiful gradient header"
        echo "  ✅ Modern card-based layout"
        echo "  ✅ Enhanced UX with larger inputs"
        echo "  ✅ Smooth animations"
        echo "  ✅ Mobile responsive design"
        echo "  ✅ Professional styling"
    else
        print_error "Could not find generated .vsix file"
    fi
else
    print_error "Failed to package extension"
    exit 1
fi

# Optional: Install the extension automatically
read -p "Would you like to install the extension in VS Code now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        print_status "Installing extension in VS Code..."
        code --install-extension "$VSIX_FILE"
        if [ $? -eq 0 ]; then
            print_success "Extension installed successfully!"
            print_status "Restart VS Code to see the new modern UI!"
        else
            print_error "Failed to install extension"
        fi
    else
        print_warning "VS Code command not found. Please install manually."
    fi
fi

echo ""
print_success "Build process completed! 🚀" 