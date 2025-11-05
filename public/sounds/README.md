# 🔊 Sound Effects for Ketab-Yar
## Agent 3 (Psychology) - Audio Feedback System

This folder contains all audio files for gamification and user feedback.

## Required Sound Files

### Gamification Sounds
- **xp-gain.mp3** (150-250ms)
  - Soft, pleasant "ping" sound
  - Plays when user earns XP
  - Volume: 30% (subtle, not intrusive)
  - Format: MP3, 32kbps, mono

- **level-up.mp3** (1-2s)
  - Celebratory, uplifting sound
  - Plays when user reaches new level
  - Volume: 50% (more prominent)
  - Format: MP3, 64kbps, stereo

- **streak-flame.mp3** (300-500ms)
  - Soft "whoosh" or flame ignition sound
  - Plays when streak is maintained
  - Volume: 40%
  - Format: MP3, 32kbps, mono

- **badge-unlock.mp3** (1-1.5s)
  - Achievement unlock sound (like trophy)
  - Plays when user unlocks new badge
  - Volume: 50%
  - Format: MP3, 64kbps, stereo

### Reading Experience Sounds
- **page-turn.mp3** (200-300ms)
  - Subtle paper rustling sound
  - Plays during page turn animation
  - Volume: 20% (very subtle)
  - Format: MP3, 32kbps, mono
  - Optional: Can be disabled in settings

- **bookmark-add.mp3** (150ms)
  - Soft "click" or "tap" sound
  - Plays when adding bookmark
  - Volume: 25%
  - Format: MP3, 32kbps, mono

- **word-save.mp3** (200ms)
  - Soft "pop" or "bubble" sound
  - Plays when saving word to vocabulary
  - Volume: 30%
  - Format: MP3, 32kbps, mono

### UI Feedback Sounds
- **button-click.mp3** (50-100ms)
  - Subtle click sound for important buttons
  - Volume: 20%
  - Format: MP3, 32kbps, mono

- **notification.mp3** (500ms)
  - Gentle notification sound
  - For streak reminders, friend activity
  - Volume: 40%
  - Format: MP3, 48kbps, stereo

- **error.mp3** (300ms)
  - Soft, non-alarming error sound
  - For validation errors, failed actions
  - Volume: 35%
  - Format: MP3, 32kbps, mono

## Implementation Guidelines

### Loading Strategy (Agent 2 - Performance)
```typescript
// Lazy load sounds only when needed
const loadSound = (filename: string) => {
  const audio = new Audio(`/sounds/${filename}`)
  audio.preload = 'none' // Don't preload
  return audio
}

// Preload critical sounds after page load
useEffect(() => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const xpSound = new Audio('/sounds/xp-gain.mp3')
      xpSound.load()
    }, 2000) // After 2 seconds
  }
}, [])
```

### Usage Example
```typescript
// hooks/use-sound-effects.ts
export function useSoundEffects() {
  const playXPGain = () => {
    const audio = new Audio('/sounds/xp-gain.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {}) // Ignore errors
  }
  
  const playLevelUp = () => {
    const audio = new Audio('/sounds/level-up.mp3')
    audio.volume = 0.5
    audio.play().catch(() => {})
  }
  
  return { playXPGain, playLevelUp }
}
```

### User Settings
All sounds should respect user preferences:
- Global mute toggle in settings
- Individual sound volume controls
- Respect system "reduced motion" preference

## File Size Optimization
- Total folder size should be < 500KB
- Use MP3 format (best browser support)
- Low bitrate for short sounds (32kbps)
- Higher bitrate for longer sounds (64kbps)
- Mono for simple sounds, stereo for celebrations

## Browser Compatibility
- MP3: Supported by all modern browsers
- Fallback: Gracefully fail if audio not supported
- Mobile: Respect silent mode

## Accessibility
- Sounds are OPTIONAL enhancement
- Never rely on sound alone for critical feedback
- Always pair with visual feedback
- Provide option to disable in settings

---

**Status**: 🚧 Placeholder files needed
**Priority**: Medium (Phase 2 - After MVP core features)
**Agent 3 Impact**: High (enhances gamification feel)
**Agent 2 Impact**: Low (small file sizes, lazy loaded)
