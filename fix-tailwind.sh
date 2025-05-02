#!/bin/bash

# Fix Tailwind CSS configuration script
echo "🔧 Starting Tailwind CSS configuration fix..."

# 1. Install the latest Tailwind v4 dependencies
echo "📦 Installing Tailwind dependencies..."
npm install -D tailwindcss@latest @tailwindcss/postcss autoprefixer

# 2. Check package.json for --turbopack flag and remove if present
if grep -q "\"dev\".*--turbopack" package.json; then
  echo "📝 Removing --turbopack flag from package.json"
  sed -i.bak 's/"dev": "next dev --turbopack"/"dev": "next dev"/g' package.json
  sed -i.bak 's/"dev": "next dev.*--turbopack.*"/"dev": "next dev"/g' package.json
  rm -f package.json.bak
else
  echo "✓ No --turbopack flag found in dev script"
fi

# 3. Create proper PostCSS configuration
echo "📝 Setting up postcss.config.js"
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
};
EOF

# 4. Create proper Tailwind config
echo "📝 Setting up tailwind.config.js"
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: { DEFAULT: '#2C3E50', accent: '#A3D8F4', blush: '#F4C2C2' },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
EOF

# 5. Ensure Tailwind directives in globals.css
echo "📝 Checking app/globals.css"
if [ ! -f app/globals.css ]; then
  echo "📝 Creating app/globals.css"
  mkdir -p app
  cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
else
  # Check if file contains tailwind directives at the top
  if ! grep -q "@tailwind base" app/globals.css; then
    echo "📝 Adding Tailwind directives to app/globals.css"
    # Create a temp file with the tailwind directives
    cat > temp_globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

EOF
    # Append the existing content
    cat app/globals.css >> temp_globals.css
    # Replace the original file
    mv temp_globals.css app/globals.css
  else
    echo "✓ Tailwind directives already present in app/globals.css"
  fi
fi

# 6. Check app/layout.tsx to ensure globals.css is imported
if [ -f app/layout.tsx ]; then
  if ! grep -q "import './globals.css'" app/layout.tsx; then
    echo "📝 Adding globals.css import to app/layout.tsx"
    # Create a temp file with the import at the top
    echo "import './globals.css';" > temp_layout.tsx
    cat app/layout.tsx >> temp_layout.tsx
    # Replace the original file
    mv temp_layout.tsx app/layout.tsx
  else
    echo "✓ globals.css import already present in app/layout.tsx"
  fi
else
  echo "⚠️ app/layout.tsx not found. Cannot add import statement."
fi

# 7. Add 'use client' directive to components that use client-side features
echo "📝 Checking UI components for client directives..."
for file in components/ui/*.tsx; do
  if grep -q "useState\|useEffect\|useRef\|motion\|useCallback\|useMemo" "$file"; then
    if ! grep -q "'use client'" "$file"; then
      echo "📝 Adding 'use client' directive to $file"
      sed -i.bak "1i\\\n'use client';\n" "$file"
      rm -f "$file.bak"
    else
      echo "✓ Client directive already present in $file"
    fi
  fi
done

# 8. Clean Next.js cache
echo "🧹 Cleaning Next.js cache"
rm -rf .next

# Make script executable
chmod +x fix-tailwind.sh

echo "✅ Done! Run: npm run dev"
