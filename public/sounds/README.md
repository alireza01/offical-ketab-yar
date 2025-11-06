# Sound Effects for Ketab-Yar Gamification

This folder contains sound effects for gamification features.

## Required Sound Files

The following sound files should be placed in this directory:

### Gamification Sounds
- `xp-gain.mp3` - Short, pleasant "ping" sound for XP rewards (150-300ms)
- `level-up.mp3` - Triumphant fanfare for level ups (1-2s)
- `streak.mp3` - Energetic sound for streak milestones (500ms-1s)
- `achievement.mp3` - Celebratory sound for achievement unlocks (1-2s)
- `celebration.mp3` - Grand celebration sound for major milestones (2-3s)

### Reading Sounds
- `page-turn.mp3` - Subtle page flip sound (200-400ms)
- `bookmark.mp3` - Soft click for bookmarking (100-200ms)

### Feedback Sounds
- `success.mp3` - Positive feedback sound (300-500ms)
- `error.mp3` - Gentle error notification (300-500ms)

## Sound Guidelines (Agent 3 - Psychology)

### Volume Levels
- All sounds should be normalized to -6dB to -3dB
- Default playback volume is 30% (0.3)
- Users can adjust master volume in settings

### Duration
- Keep sounds short and non-intrusive
- Maximum duration: 3 seconds
- Ideal duration: 200ms - 1s for most sounds

### Format
- Format: MP3 (best browser compatibility)
- Bitrate: 128kbps (good quality, small file size)
- Sample Rate: 44.1kHz

### Tone
- Positive, uplifting, encouraging
- Not annoying or jarring
- Culturally neutral

## Free Sound Resources

You can find free, high-quality sound effects from:

1. **Freesound.org** - https://freesound.org/
   - Search for: "coin", "level up", "achievement", "success"
   - Filter by: CC0 (Public Domain) license

2. **Zapsplat** - https://www.zapsplat.com/
   - Free sound effects library
   - Requires attribution

3. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Free sound effects
   - No attribution required

4. **Web Audio API** (Fallback)
   - If sound files are not available, the app will fail gracefully
   - Consider generating simple beep sounds with Web Audio API

## Implementation Notes

- All sounds are optional and fail gracefully if not available
- Sounds are cached after first load for performance
- Users can disable sounds in settings
- Sounds respect user's system volume and mute settings

## Testing

To test sounds:
1. Place sound files in this directory
2. Open the app and trigger gamification events
3. Check browser console for any loading errors
4. Adjust volume levels if needed

## Performance (Agent 2)

- Total size of all sounds should be < 500KB
- Sounds are lazy-loaded (only when needed)
- Audio cache prevents re-downloading
- No impact on initial page load
