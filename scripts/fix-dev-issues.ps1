# Ketab-Yar Development Issue Fixer
# Run this script when you encounter build or runtime errors

Write-Host "🔧 Ketab-Yar Development Issue Fixer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear build cache
Write-Host "1️⃣  Clearing Next.js build cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✅ Build cache cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No build cache found" -ForegroundColor Gray
}

# Step 2: Clear node_modules cache
Write-Host ""
Write-Host "2️⃣  Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path node_modules/.cache) {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "   ✅ Node modules cache cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No node modules cache found" -ForegroundColor Gray
}

# Step 3: Check environment variables
Write-Host ""
Write-Host "3️⃣  Checking environment variables..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "NEXT_PUBLIC_USE_MOCK_DATA=true") {
        Write-Host "   ✅ Mock data mode is enabled" -ForegroundColor Green
    } elseif ($envContent -match "NEXT_PUBLIC_USE_MOCK_DATA=false") {
        Write-Host "   ⚠️  Real Supabase mode is enabled" -ForegroundColor Yellow
        Write-Host "      Make sure your Supabase credentials are correct" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  NEXT_PUBLIC_USE_MOCK_DATA not set" -ForegroundColor Yellow
  