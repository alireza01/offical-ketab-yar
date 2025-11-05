# Sound Effects for Ketab-Yar

This directory contains sound effects for gamification features (Agent 3 - Psychology).

## Required Sound Files

Place the following MP3 files in this directory:

1. **xp-gain.mp3** - Short, pleasant "ding" sound (100-300ms)
   - Plays when user earns XP
   - Should be subtle and satisfying

2. **level-up.mp3** - Triumphant fanfare (1-2 seconds)
   - Plays when user reaches a new level
   - Should feel rewarding and exciting

3. **streak.mp3** - Fire/flame sound effect (300-500ms)
   - Plays when maintaining daily streak
   - Should feel motivating

4. **achievement.mp3** - Badge unlock sound (500ms-1s)
   - Plays when earning a new achievement
   - Should feel special and rare

5. **celebration.mp3** - Full celebration sound (2-3 seconds)
   - Plays when completing a book or major milestone
   - Should feel epic and rewarding

6. **page-turn.mp3** - Subtle paper rustle (200-400ms)
   - Plays when turning pages (optional, can be disabled)
   - Should be very subtle

7. **bookmark.mp3** - Soft click/tap (100-200ms)
   - Plays when adding a bookmark
   - Should be quick and satisfying

8. **error.mp3** - Gentle error tone (300-500ms)
   - Plays on errors or failed actions
   - Should not be harsh or annoying

9. **success.mp3** - Positive confirmation (200-400ms)
   - Plays on successful actions
   - Should be pleasant and quick

## Sound Guidelines (Agent 3 Psychology)

- **Volume**: All sounds should be normalized to similar volume levels
- **Duration**: Keep sounds short (< 2 seconds except celebration)
- **Format**: MP3 format for broad browser support
- **Quality**: 128kbps is sufficient, keeps file sizes small
- **Tone**: Warm, positive, never harsh or annoying
- **Frequency**: Avoid high-pitched sounds that might be irritating

## Free Sound Resources

You can find free sound effects at:
- **Freesound.org** - Community-uploaded sounds (CC licenses)
- **Zapsplat.com** - Free sound effects library
- **Mixkit.co** - Free sound effects and music
- **Pixabay** - Free sound effects

## Implementation

Sounds are managed by `/lib/utils/sound-effects.ts` and:
- Fail gracefully if files are missing
- Respect user preferences (can be disabled)
- Are cached for performance
- Have adjustable volume

## User Controls

Users can:
- Enable/disable all sounds in settings
- Adjust master volume
- Sounds are disabled by default until user interacts with page (browser policy)

## Performance Notes (Agent 2)

- Sounds are lazy-loaded (not in initial bundle)
- Audio elements are cached after first play
- Total size of all sounds should be < 500KB
- Sounds don't block page rendering
