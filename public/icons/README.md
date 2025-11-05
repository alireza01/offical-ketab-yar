# PWA Icons Directory

## Required Icons for PWA

Place the following icon files in this directory:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## How to Generate Icons

### Option 1: Use Online Tool
Visit: https://www.pwabuilder.com/imageGenerator
- Upload your logo (512x512 recommended)
- Download all sizes
- Place in this folder

### Option 2: Use ImageMagick
```bash
# Install ImageMagick first
# Then run:
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Option 3: Use Figma/Photoshop
- Create artboards for each size
- Export as PNG
- Place in this folder

## Design Guidelines

- Use the Ketab-Yar logo with gold (#D4AF37) theme
- Ensure icons work on both light and dark backgrounds
- Add padding (10-15%) around the logo
- Use transparent background or solid color
- Test on both iOS and Android

## Testing

After adding icons:
1. Run `npm run build`
2. Deploy to Vercel
3. Open site on mobile
4. Check "Add to Home Screen" prompt
5. Verify icon appears correctly
