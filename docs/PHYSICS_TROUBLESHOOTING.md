# Physics Page Turn - Troubleshooting & Best Practices

## 🚨 Common Issues & Solutions

### Issue 1: Animation is Laggy / Not 60fps

**Symptoms:**
- Stuttering during page turn
- Dropped frames
- Slow response to drag

**Possible Causes & Solutions:**

**1. Not Using GPU Acceleration**
```css
/* ❌ Wrong */
.physics-page {
  transform: translateX(100px);
}

/* ✅ Correct */
.physics-page {
  will-change: transform;
  transform: translateZ(0) translateX(100px);
  backface-visibility: hidden;
}
```

**2. Animating Wrong Properties**
```typescript
// ❌ Wrong - CPU-intensive
api.start({ width: 500, marginLeft: 100 })

// ✅ Correct - GPU-accelerated
api.start({ x: 100, scale: 1.2 })
```

**3. Too Many Shadow Updates**
```typescript
// ❌ Wrong - Updates every frame
onDrag: ({ movement }) => {
  setShadowIntensity(movement[0] / window.innerWidth)
}

// ✅ Correct - Throttled
const throttledUpdate = throttle((value) => {
  setShadowIntensity(value)
}, 16) // 60fps

onDrag: ({ movement }) => {
  throttledUpdate(movement[0] / window.innerWidth)
}
```

**4. Heavy Re-renders**
```typescript
// ❌ Wrong - Re-renders entire component
const [dragProgress, setDragProgress] = useState(0)

// ✅ Correct - Use animated values
const [{ x }] = useSpring(() => ({ x: 0 }))
```

---

### Issue 2: Text Selection Interferes with Drag

**Symptoms:**
- Text gets selected when dragging
- Drag doesn't start smoothly
- Blue selection highlight appears

**Solution:**

```typescript
// In usePageGesture hook
onDragStart: () => {
  // Prevent text selection
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
  
  // Clear any existing selection
  window.getSelection()?.removeAllRanges()
}

onDragEnd: () => {
  // Re-enable text selection
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
}
```

**Additional Prevention:**
```css
.physics-page {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
```

---

### Issue 3: Shadows Don't Match Theme

**Symptoms:**
- Shadows too dark in light mode
- Shadows invisible in dark mode
- Highlights not visible

**Solution:**

Check CSS variables are properly defined:

```css
:root {
  --physics-page-shadow: rgba(0, 0, 0, 0.15);
  --physics-curl-highlight: rgba(255, 255, 255, 0.3);
}

.dark {
  --physics-page-shadow: rgba(0, 0, 0, 0.6);
  --physics-curl-highlight: rgba(212, 175, 55, 0.3);
}
```

Verify theme prop is passed correctly:

```typescript
<PhysicsPageTurn
  theme={theme} // Must be 'light' | 'sepia' | 'dark'
  // ...
/>
```

---

### Issue 4: Page Turns Accidentally

**Symptoms:**
- Page turns when scrolling
- Page turns when clicking
- Page turns when selecting text

**Solution:**

Add drag threshold:

```typescript
const bind = useGesture({
  onDrag: ({ movement: [mx], first }) => {
    // Ignore small movements
    if (Math.abs(mx) < 10 && !first) {
      return
    }
    // ... rest of logic
  }
}, {
  drag: {
    filterTaps: true,
    threshold: 10, // Minimum 10px drag to start
  }
})
```

Check for text selection before starting:

```typescript
onDragStart: ({ event }) => {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    return // Don't start drag if text is selected
  }
}
```

---

### Issue 5: Animation Doesn't Reset After Page Turn

**Symptoms:**
- Page stuck in mid-animation
- Next page appears rotated
- Transform not reset

**Solution:**

Ensure proper reset in `onRest` callback:

```typescript
api.start({
  x: direction === 'next' ? -window.innerWidth : window.innerWidth,
  rotateY: direction === 'next' ? -180 : 180,
  onRest: () => {
    onPageTurn(direction)
    // CRITICAL: Reset transform
    api.set({ x: 0, rotateY: 0 })
    setCurlProgress(0)
  }
})
```

---

### Issue 6: Memory Leak After Multiple Page Turns

**Symptoms:**
- Browser slows down over time
- Memory usage increases
- Eventually crashes

**Solution:**

Clean up event listeners:

```typescript
useEffect(() => {
  const unsubscribe = x.onChange((value) => {
    // ... update logic
  })
  
  // CRITICAL: Cleanup
  return () => unsubscribe()
}, [x])
```

Remove gesture bindings on unmount:

```typescript
useEffect(() => {
  return () => {
    // Cleanup gesture handlers
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
  }
}, [])
```

---

### Issue 7: Doesn't Work on Mobile

**Symptoms:**
- No response to touch
- Drag doesn't start
- Works on desktop but not mobile

**Solution:**

Ensure touch events are enabled:

```typescript
const bind = useGesture({
  onDrag: ({ event, movement }) => {
    // Handle both mouse and touch
    event.preventDefault()
    // ... rest of logic
  }
}, {
  drag: {
    // Enable touch events
    pointer: { touch: true }
  }
})
```

Prevent default touch behaviors:

```css
.physics-page {
  touch-action: pan-y; /* Allow vertical scroll, prevent horizontal */
}
```

---

### Issue 8: Conflicts with Vocabulary Popup

**Symptoms:**
- Vocabulary popup appears during drag
- Dictionary opens when turning page
- Text selection menu shows

**Solution:**

Disable other interactions during drag:

```typescript
const [isDragging, setIsDragging] = useState(false)

// In vocabulary component
if (isDragging) {
  return null // Don't render during drag
}

// In gesture handler
onDragStart: () => {
  setIsDragging(true)
  // Disable other interactions
}

onDragEnd: () => {
  setIsDragging(false)
  // Re-enable interactions
}
```

---

## 🎯 Best Practices

### 1. Always Use GPU-Accelerated Properties

**✅ DO:**
- `transform: translateX()`, `translateY()`, `translateZ()`
- `transform: scale()`, `rotate()`, `rotateY()`
- `opacity`

**❌ DON'T:**
- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom`
- `background-position`

### 2. Throttle Expensive Operations

```typescript
// Shadow updates
const updateShadow = throttle((intensity) => {
  setShadowIntensity(intensity)
}, 16) // 60fps

// Curl progress
const updateCurl = throttle((progress) => {
  setCurlProgress(progress)
}, 16)
```

### 3. Use `useMemo` for Complex Calculations

```typescript
const shadowStyle = useMemo(() => {
  return {
    background: `linear-gradient(...)`,
    opacity: curlProgress * 0.3,
  }
}, [curlProgress, theme])
```

### 4. Lazy Load Heavy Components

```typescript
const PhysicsPageTurn = dynamic(
  () => import('./physics/PhysicsPageTurn'),
  {
    loading: () => <PageTransition />,
    ssr: false,
  }
)
```

### 5. Respect User Preferences

```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

if (prefersReducedMotion) {
  return <PageTransition /> // Fallback to simple animation
}
```

### 6. Test on Real Devices

**Don't rely on:**
- Chrome DevTools device emulation
- Desktop browser only
- High-end devices only

**Do test on:**
- Real iPhone (Safari)
- Real Android (Chrome)
- Mid-range devices (2-3 years old)
- Slow network conditions

### 7. Monitor Performance

```typescript
// Add performance monitoring
useEffect(() => {
  let frameCount = 0
  let lastTime = performance.now()
  
  const measureFPS = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      console.log(`FPS: ${fps}`)
      
      if (fps < 50) {
        console.warn('Low FPS detected!')
      }
      
      frameCount = 0
      lastTime = currentTime
    }
    
    requestAnimationFrame(measureFPS)
  }
  
  const rafId = requestAnimationFrame(measureFPS)
  return () => cancelAnimationFrame(rafId)
}, [])
```

### 8. Provide Fallback

```typescript
// Always have a fallback
try {
  return <PhysicsPageTurn {...props} />
} catch (error) {
  console.error('Physics animation failed:', error)
  return <PageTransition {...props} />
}
```

---

## 🔍 Debugging Tips

### 1. Visual Debugging

Add visual indicators:

```typescript
// Show drag progress
<div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded">
  Drag: {Math.round(curlProgress * 100)}%
  <br />
  Velocity: {velocity.toFixed(2)}
</div>
```

### 2. Console Logging

```typescript
onDrag: ({ movement, velocity, last }) => {
  console.log({
    movement,
    velocity,
    last,
    progress: movement[0] / window.innerWidth,
  })
}
```

### 3. Chrome DevTools Performance Tab

1. Open DevTools → Performance
2. Click Record
3. Perform page turn
4. Stop recording
5. Look for:
   - Long tasks (> 50ms)
   - Layout thrashing
   - Excessive repaints

### 4. React DevTools Profiler

1. Open React DevTools → Profiler
2. Click Record
3. Perform page turn
4. Stop recording
5. Look for:
   - Unnecessary re-renders
   - Slow components
   - Render time

---

## 📊 Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| FPS | 60 | 50-59 | < 50 |
| Animation Duration | 400-800ms | 300-1000ms | > 1000ms |
| CPU Usage | < 20% | 20-30% | > 30% |
| Memory | < 50MB | 50-100MB | > 100MB |
| Input Lag | < 16ms | 16-32ms | > 32ms |

### Testing Commands

```bash
# Check bundle size
npm run build
npm run analyze

# Run performance tests
npm run test:performance

# Check memory leaks
npm run test:memory
```

---

## 🛠️ Development Tools

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Error Translator**
- **CSS Peek**

### Browser Extensions

- **React Developer Tools**
- **Redux DevTools** (if using Redux)
- **Lighthouse**
- **Web Vitals**

### Testing Tools

- **Chrome DevTools Performance**
- **Chrome DevTools Memory**
- **Lighthouse CI**
- **WebPageTest**

---

## 📚 Additional Resources

### Documentation
- [react-spring docs](https://www.react-spring.dev/)
- [@use-gesture docs](https://use-gesture.netlify.app/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

### Performance
- [Google Web Vitals](https://web.dev/vitals/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [GPU Acceleration](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Reduced Motion](https://web.dev/prefers-reduced-motion/)
- [Keyboard Navigation](https://webaim.org/techniques/keyboard/)

---

## 🎓 Learning Path

### Beginner
1. Understand basic CSS transforms
2. Learn Framer Motion basics
3. Understand React hooks
4. Practice with simple animations

### Intermediate
1. Learn react-spring
2. Understand gesture handling
3. Learn performance optimization
4. Practice with complex animations

### Advanced
1. Master physics-based animations
2. Understand GPU acceleration
3. Learn advanced performance profiling
4. Create custom animation systems

---

## 💡 Pro Tips

1. **Start Simple**: Get basic drag working before adding physics
2. **Test Early**: Test on real devices from day 1
3. **Profile Often**: Use Chrome DevTools regularly
4. **Iterate**: Don't expect perfection on first try
5. **Get Feedback**: Show to users early and often
6. **Document**: Write down what works and what doesn't
7. **Be Patient**: Physics animations are complex, take your time

---

## 🆘 Getting Help

### Internal Resources
- Check existing documentation
- Review code comments
- Ask team members
- Check git history

### External Resources
- Stack Overflow
- GitHub Issues (react-spring, @use-gesture)
- Discord communities
- Twitter #ReactJS

### When to Ask for Help
- Stuck for > 2 hours
- Performance issues persist
- Accessibility concerns
- Security questions

---

*Troubleshooting Guide v1.0*  
*Last Updated: 2025-01-07*  
*Keep this document updated as you discover new issues!*
