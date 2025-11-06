@echo off
REM Ketab-Yar Sanity CMS Setup Script (Windows)
REM This script automates the initial setup of Sanity CMS

echo.
echo ================================
echo Ketab-Yar Sanity CMS Setup
echo ================================
echo.

REM Check if studio folder exists
if not exist "studio" (
  echo Error: studio folder not found
  echo Please make sure you're in the project root
  exit /b 1
)

REM Step 1: Install dependencies in studio
echo Step 1: Installing Sanity Studio dependencies...
cd studio
call npm install
if errorlevel 1 (
  echo Failed to install dependencies
  exit /b 1
)
echo Dependencies installed
echo.

REM Step 2: Check for environment variables
echo Step 2: Checking environment variables...
cd ..

if not exist ".env.local" (
  echo .env.local not found. Creating from example...
  copy .env.local.example .env.local
  echo Created .env.local
  echo.
  echo IMPORTANT: You need to add your Sanity credentials to .env.local
  echo 1. Go to https://www.sanity.io/manage
  echo 2. Create a new project or select existing
  echo 3. Copy your Project ID and create an Admin Token
  echo 4. Add them to .env.local:
  echo    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
  echo    NEXT_PUBLIC_SANITY_DATASET=production
  echo    SANITY_ADMIN_TOKEN=your_admin_token
  echo.
  pause
)

REM Step 3: Create studio .env
echo Step 3: Configuring Sanity Studio...
if not exist "studio\.env" (
  echo Creating studio\.env...
  REM Note: Manual configuration needed on Windows
  echo Please create studio\.env manually with:
  echo SANITY_STUDIO_PROJECT_ID=your_project_id
  echo SANITY_STUDIO_DATASET=production
  echo.
  pause
) else (
  echo studio\.env already exists
)
echo.

REM Step 4: Install main project dependencies
echo Step 4: Installing main project dependencies...
call npm install
if errorlevel 1 (
  echo Failed to install dependencies
  exit /b 1
)
echo Dependencies installed
echo.

REM Step 5: Success message
echo ================================
echo Setup Complete!
echo.
echo Next Steps:
echo.
echo 1. Start Sanity Studio:
echo    cd studio
echo    npm run dev
echo    Studio will be at: http://localhost:3333
echo.
echo 2. Import sample data:
echo    node scripts/import-book.mjs scripts/import-example.json
echo.
echo 3. Start Next.js dev server:
echo    npm run dev
echo    App will be at: http://localhost:3000
echo.
echo 4. Deploy Sanity Studio (optional):
echo    cd studio
echo    npm run deploy
echo.
echo Documentation: docs/SANITY_CMS_INTEGRATION.md
echo.
pause
