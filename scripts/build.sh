#!/bin/bash
# Build script for production deployment

echo "🔨 Building Zizo Backend..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Type checking
echo "🔍 Running type check..."
npm run type-check

# Run linter
echo "📝 Running linter..."
npm run lint

# Build TypeScript
echo "🏗️  Compiling TypeScript..."
npm run build

echo "✅ Build completed successfully!"
