# 🧪 PWA Testing Guide
## How to Test "Install App" Prompt & Offline Features

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Generate Icons
```bash
# Open in browser:
http://localhost:3000/generate-icons.html

# Download all icons and save to public/ folder
```

### Step 2: Build Production
```bash
npm run build
npm start
```

### Step 3: Test Install Prompt
```bash
# Open in Chrome:
http://localhost:3000

# Wait 30 seconds or look for install icon in address bar
```

---

## 📱 Testing Install Prompt

### Method 1: Browser Native Prompt (Automatic)

**Chrome/Edge Desktop:**
1. Build production: `npm run build && npm start`
2. Open `http://localhost:3000`
3. Look for **⊕ Install icon** in address bar (right side)
4. Click it → "Install" → App opens in standalone window

**Chrome Android:**
1. Deploy to production (Vercel) or use ngrok
2. Open in Chrome mobile
3. Banner appears: "Add Ketab-Yar to Home screen"
4. Tap "Install" → App icon added to home screen

**Safari iOS:**
1. Deploy to HTTPS (required for iOS)
2. Open in Safari
3. Tap Share button → "Add to Home Screen"
4. App icon added to home screen

### Method 2: Custom Install Prompt (Our UI)

**What Happens:**
1. User visits site
2. After 30 seconds, our custom prompt appears (bottom of screen)
3. Shows benefits: offline reading, quick access, etc.
4. User clicks "Install" → Browser native prompt appears
5. User confirms → App installs

**To Test:**
```javascript
// Force show prompt immediately (for testing)
// Add to browser console:
localStorage.removeItem('pwa-install-dismissed')
window.location.reload()
```

### Method 3: DevTools Manual Trigger

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Manifest** in left sidebar
4. Click **"Add to home screen"** button
5. Confirm install

---

## 🔍 Debugging Install Issues

### Issue: Install Prompt Not Showing

**Check 1: PWA Requirements Met**
```
DevTools → Application → Manifest
✅ Manifest exists and is valid
✅ Service worker is active
✅ Site is served over HTTPS (or localhost)
✅ Has at least 192x192 and 512x512 icons
```

**Check 2: Browser Support**
```
✅ Chrome 68+ (Desktop & Android)
✅ Edge 79+
✅ Safari 16.4+ (iOS/macOS)
❌ Firefox (limited support)
```

**Check 3: Already Installed**
```
If app is already installed, prompt won't show again.
Solution: Uninstall app first, then test.
```

**Check 4: User Dismissed**
```
If user dismissed prompt, browser won't show again for ~3 months.
Solution: Test in Incognito mode or clear site data.
```

**Fix Steps:**
1. Clear all site data: DevTools → Application → Clear storage
2. Close all tabs of the site
3. Open in Incognito mode
4. Visit site again

---

## 🌐 Testing Offline Mode

### Test 1: Offline Fallback Page

**Steps:**
1. Visit site while online
2. Open DevTools → Network tab
3. Check **"Offline"** checkbox
4. Refresh page
5. Should see offline page with "You are offline" message

**Expected Result:**
```
✅ Shows custom offline page (not browser error)
✅ Has "Retry" button
✅ Shows offline indicator at top
```

### Test 2: Offline Book Reading

**Steps:**
1. While online:
   - Go to a book detail page
   - Click "Download Offline" button
   - Wait for download to complete
2. Go offline (DevTools → Network → Offline)
3. Navigate to the book reader
4. Should be able to read the downloaded book

**Expected Result:**
```
✅ Book loads from IndexedDB (not network)
✅ Can turn pages
✅ Can switch languages
✅ XP tracking works (queued for sync)
```

### Test 3: Background Sync

**Steps:**
1. Go offline
2. Read a book, earn XP
3. Check DevTools → Application → IndexedDB → sync-queue
4. Should see queued XP updates
5. Go back online
6. Wait 5 seconds
7. Check if XP synced to server

**Expected Result:**
```
✅ XP queued while offline
✅ Automatically syncs when back online
✅ Queue cleared after successful sync
✅ Shows "Syncing..." indicator
```

---

## 📊 PWA Audit Checklist

### Run Lighthouse Audit:

**Steps:**
1. Build production: `npm run build && npm start`
2. Open DevTools → Lighthouse tab
3. Select **"Progressive Web App"** category
4. Click **"Generate report"**

**Target Scores:**
```
✅ PWA Score: 90+ (100 is perfect)
✅ Performance: 90+
✅ Accessibility: 90+
✅ Best Practices: 90+
✅ SEO: 95+
```

### Manual PWA Checklist:

**Core Requirements:**
- ✅ Served over HTTPS (or localhost)
- ✅ Registers a service worker
- ✅ Has a web app manifest
- ✅ Manifest includes name, icons, start_url
- ✅ Has at least 192x192 and 512x512 icons
- ✅ Responds with 200 when offline

**Installability:**
- ✅ Browser shows install prompt
- ✅ App installs to home screen/desktop
- ✅ Opens in standalone mode
- ✅ Has splash screen

**Offline Support:**
- ✅ Works offline after first visit
- ✅ Shows custom offline page
- ✅ Cached assets load offline
- ✅ Background sync works

---

## 🎯 Real Device Testing

### Android Testing:

**Option 1: Deploy to Production**
```bash
# Deploy to Vercel
vercel --prod

# Visit on Android Chrome
# Install prompt should appear automatically
```

**Option 2: Local Testing with ngrok**
```bash
# Install ngrok
npm install -g ngrok

# Build and start
npm run build
npm start

# In another terminal
ngrok http 3000

# Visit ngrok URL on Android
```

**What to Test:**
1. ✅ Install prompt appears
2. ✅ App installs to home screen
3. ✅ Icon looks good
4. ✅ Opens in fullscreen (no browser UI)
5. ✅ Splash screen shows
6. ✅ Works offline
7. ✅ Download books works
8. ✅ Background sync works

### iOS Testing:

**Requirements:**
- Must be HTTPS (no localhost)
- Must deploy to production

**Steps:**
1. Deploy to Vercel: `vercel --prod`
2. Open in Safari on iOS
3. Tap Share → "Add to Home Screen"
4. Test offline (limited support on iOS)

**iOS Limitations:**
- ⚠️ No automatic install prompt
- ⚠️ Limited service worker support
- ⚠️ Background sync not supported
- ⚠️ Push notifications not supported

---

## 🐛 Common Issues & Solutions

### Issue 1: "Service Worker Registration Failed"

**Cause:** Running in development mode

**Solution:**
```bash
# Service worker only works in production
npm run build
npm start
```

### Issue 2: "Manifest Not Found"

**Cause:** Manifest path incorrect

**Solution:**
```typescript
// Check app/layout.tsx has:
manifest: "/manifest.json"

// Check public/manifest.json exists
```

### Issue 3: "Icons Not Loading"

**Cause:** Icon files missing

**Solution:**
```bash
# Generate icons:
# 1. Open http://localhost:3000/generate-icons.html
# 2. Download all icons
# 3. Save to public/ folder
```

### Issue 4: "Install Prompt Not Showing"

**Cause:** Multiple possible reasons

**Solution:**
```bash
# 1. Clear site data
DevTools → Application → Clear storage → Clear site data

# 2. Test in Incognito
Ctrl+Shift+N (Chrome)

# 3. Check requirements
DevTools → Application → Manifest
DevTools → Application → Service Workers

# 4. Check console for errors
```

### Issue 5: "Offline Mode Not Working"

**Cause:** Service worker not caching properly

**Solution:**
```bash
# 1. Check service worker is active
DevTools → Application → Service Workers

# 2. Check cache storage
DevTools → Application → Cache Storage

# 3. Force update service worker
DevTools → Application → Service Workers → Update

# 4. Clear cache and reload
DevTools → Application → Clear storage
```

---

## 📱 User Experience Testing

### Test Scenario 1: First-Time User

**Flow:**
1. User visits site
2. Browses books
3. After 30 seconds, install prompt appears
4. User clicks "Install"
5. Browser confirms installation
6. App opens in standalone mode

**What to Check:**
- ✅ Prompt appears at right time
- ✅ Prompt is attractive and clear
- ✅ Install process is smooth
- ✅ App opens correctly

### Test Scenario 2: Offline Reading

**Flow:**
1. User downloads a book
2. Goes offline (airplane mode)
3. Opens app from home screen
4. Reads downloaded book
5. Earns XP (queued)
6. Goes back online
7. XP syncs automatically

**What to Check:**
- ✅ Download is fast
- ✅ Offline indicator shows
- ✅ Book loads from cache
- ✅ Reading works smoothly
- ✅ Sync happens automatically

### Test Scenario 3: Return User

**Flow:**
1. User opens app from home screen
2. App loads instantly (cached)
3. Continues reading
4. Closes app
5. Returns later
6. Progress is saved

**What to Check:**
- ✅ Fast load time
- ✅ No browser UI
- ✅ Progress persists
- ✅ Feels like native app

---

## ✅ Final Checklist Before Launch

### Pre-Launch:
- [ ] All icons generated (72px to 512px)
- [ ] Icons are professional (not placeholders)
- [ ] Manifest.json has correct app name
- [ ] Manifest.json has correct theme colors
- [ ] Screenshots added to manifest
- [ ] Tested on Chrome Desktop
- [ ] Tested on Chrome Android
- [ ] Tested on Safari iOS
- [ ] Lighthouse PWA score > 90
- [ ] Offline mode works
- [ ] Background sync works
- [ ] Install prompt works

### Post-Launch:
- [ ] Monitor install rate
- [ ] Monitor offline usage
- [ ] Monitor sync errors
- [ ] Collect user feedback
- [ ] A/B test install prompt timing

---

## 🎉 Success Metrics

Your PWA is successful when:

✅ **Install Rate:** > 10% of visitors install
✅ **Offline Usage:** > 20% of users read offline
✅ **Return Rate:** Installed users return 3x more
✅ **Engagement:** Installed users read 2x more pages
✅ **Lighthouse Score:** PWA score > 90

---

**Need Help?** Check browser console for errors or run Lighthouse audit for detailed feedback.
