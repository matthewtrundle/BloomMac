#!/bin/bash

# Fix Tailwind Configuration Script
echo "🔧 Starting Tailwind configuration fix..."

# 1. Rename postcss.config.mjs to postcss.config.js if it exists
if [ -f postcss.config.mjs ]; then
  echo "📄 Renaming postcss.config.mjs to postcss.config.js"
  mv postcss.config.mjs postcss.config.js
fi

# 2. Create or overwrite postcss.config.js
echo "📝 Creating postcss.config.js"
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# 3. Create app/globals.css if missing
if [ ! -f app/globals.css ]; then
  echo "📝 Creating app/globals.css"
  mkdir -p app
  cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
else
  # Check if file contains tailwind directives, if not, add them
  if ! grep -q "@tailwind" app/globals.css; then
    echo "📝 Adding Tailwind directives to app/globals.css"
    sed -i '' '1i\
@tailwind base;\
@tailwind components;\
@tailwind utilities;\

' app/globals.css
  else
    echo "✓ Tailwind directives already present in app/globals.css"
  fi
fi

# 4. Insert import statement at the top of app/layout.tsx if not present
if [ -f app/layout.tsx ]; then
  if ! grep -q "import './globals.css'" app/layout.tsx; then
    echo "📝 Adding import statement to app/layout.tsx"
    sed -i '' '1i\
import '"'"'./globals.css'"'"';\

' app/layout.tsx
  else
    echo "✓ globals.css import already present in app/layout.tsx"
  fi
else
  echo "⚠️ app/layout.tsx not found. Cannot add import statement."
fi

# Make script executable
chmod +x fix-tailwind-formatting.sh

echo "✅ Done. Now run: npm run dev"
