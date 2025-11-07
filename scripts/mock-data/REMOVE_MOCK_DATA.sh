#!/bin/bash
# Script to remove all mock data from Sanity

echo "🗑️  Removing mock data from Sanity..."

npx sanity documents delete mock-banana-adventure --force
npx sanity documents delete mock-author-banana --force
npx sanity documents delete mock-genre-adventure --force
npx sanity documents delete mock-genre-fiction --force
npx sanity documents delete image.banana-cover --force

echo "✅ Mock data removed successfully!"
