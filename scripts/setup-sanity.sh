#!/bin/bash

# Ketab-Yar Sanity CMS Setup Script
# This script automates the initial setup of Sanity CMS

echo "🚀 Ketab-Yar Sanity CMS Setup"
echo "================================"
echo ""

# Check if studio folder exists
if [ ! -d "studio" ]; then
  echo "❌ Error: studio folder not found"
  echo "   Please make sure you're in the project root"
  exit 1
fi

# Step 1: Install dependencies in studio
echo "📦 Step 1: Installing Sanity Studio dependencies..."
cd studio
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Check for environment variables
echo "🔧 Step 2: Checking environment variables..."
cd ..

if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local not found. Creating from example..."
  cp .env.local.example .env.local
  echo "✅ Created .env.local"
  echo ""
  echo "⚠️  IMPORTANT: You need to add your Sanity credentials to .env.local"
  echo "   1. Go to https://www.sanity.io/manage"
  echo "   2. Create a new project or select existing"
  echo "   3. Copy your Project ID and create an Admin Token"
  echo "   4. Add them to .env.local:"
  echo "      NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id"
  echo "      NEXT_PUBLIC_SANITY_DATASET=production"
  echo "      SANITY_ADMIN_TOKEN=your_admin_token"
  echo ""
  read -p "Press Enter when you've added your credentials..."
fi

# Check if Sanity credentials are set
if ! grep -q "NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id" .env.local; then
  echo "✅ Sanity credentials found in .env.local"
else
  echo "⚠️  Sanity credentials not configured in .env.local"
  echo "   Please add your credentials before continuing"
  exit 1
fi

# Step 3: Create studio .env
echo "🔧 Step 3: Configuring Sanity Studio..."
if [ ! -f "studio/.env" ]; then
  # Extract values from main .env.local
  PROJECT_ID=$(grep NEXT_PUBLIC_SANITY_PROJECT_ID .env.local | cut -d '=' -f2)
  DATASET=$(grep NEXT_PUBLIC_SANITY_DATASET .env.local | cut -d '=' -f2)
  
  echo "SANITY_STUDIO_PROJECT_ID=$PROJECT_ID" > studio/.env
  echo "SANITY_STUDIO_DATASET=$DATASET" >> studio/.env
  echo "✅ Created studio/.env"
else
  echo "✅ studio/.env already exists"
fi
echo ""

# Step 4: Install main project dependencies
echo "📦 Step 4: Installing main project dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 5: Success message
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start Sanity Studio:"
echo "   cd studio && npm run dev"
echo "   Studio will be at: http://localhost:3333"
echo ""
echo "2. Import sample data:"
echo "   node scripts/import-book.mjs scripts/import-example.json"
echo ""
echo "3. Start Next.js dev server:"
echo "   npm run dev"
echo "   App will be at: http://localhost:3000"
echo ""
echo "4. Deploy Sanity Studio (optional):"
echo "   cd studio && npm run deploy"
echo ""
echo "📚 Documentation: docs/SANITY_CMS_INTEGRATION.md"
echo ""
