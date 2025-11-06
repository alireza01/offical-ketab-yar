/**
 * Generate Placeholder PWA Icons
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const publicDir = path.join(__dirname, '..', 'public')

// Create SVG icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#C9A961"/>
  <text x="50%" y="50%" font-size="${size * 0.6}" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold">
    ک
  </text>
</svg>
`

console.log('🎨 Generating placeholder PWA icons...\n')

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`
  const svgContent = createSVG(size)
  
  // For now, save as SVG (you'll need to convert to PNG manually or use a tool)
  const svgFilename = `icon-${size}x${size}.svg`
  fs.writeFileSync(path.join(publicDir, svgFilename), svgContent.trim())
  
  console.log(`✅ Created ${svgFilename}`)
})

console.log('\n📝 Note: SVG files created. To convert to PNG:')
console.log('   1. Use online tool: https://cloudconvert.com/svg-to-png')
console.log('   2. Or install ImageMagick and run:')
console.log('      magick icon-512x512.svg icon-512x512.png')
console.log('\n✨ Done!')
