# Dictionary & Vocabulary System

## Overview

This system provides **free** English-to-Persian dictionary functionality using:
- **Free Dictionary API** (no API key required)
- **Google Gemini** (for Persian translations)

## Features

✅ **Free & Unlimited**: No API key, no rate limits  
✅ **Comprehensive Data**: Definitions, pronunciation, audio, synonyms, antonyms  
✅ **Persian Translation**: Powered by Gemini AI  
✅ **Context-Aware**: Uses sentence context for better translations  
✅ **Vocabulary Saving**: Save words with definitions and translations  
✅ **Freemium Model**: 20 words free, unlimited for premium users  

---

## API Endpoints

### 1. Free Dictionary API (External)
```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

**Example Response**:
```json
[
  {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "phonetics": [
      {
        "text": "/həˈloʊ/",
        "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3"
      }
    ],
    "meanings": [
      {
        "partOfSpeech": "noun",
        "definitions": [
          {
            "definition": "A greeting (salutation) said when meeting someone or acknowledging someone's arrival or presence.",
            "example": "She greeted me with a warm hello.",
            "synonyms": ["greeting", "salutation"],
            "antonyms": ["goodbye"]
          }
        ]
      }
    ]
  }
]
```

### 2. Translation API (Internal)
```
POST /api/dictionary/translate
```

**Request Body**:
```json
{
  "word": "hello",
  "context": "She greeted me with a warm hello."
}
```

**Response**:
```json
{
  "translation": "سلام، درود"
}
```

### 3. Vocabulary Save API (Internal)
```
POST /api/vocabulary/save
```

**Request Body**:
```json
{
  "word": "hello",
  "definition": "A greeting said when meeting someone",
  "translation": "سلام، درود",
  "context": "She greeted me with a warm hello.",
  "bookId": "uuid-here"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* vocabulary record */ }
}
```

---

## Usage in Reader

### 1. Import the Hook
```typescript
import { useWordSelection } from '@/hooks/use-word-selection'
import { WordPopupDictionary } from '@/components/reader/word-popup-dictionary'
```

### 2. Use in Component
```typescript
export function BookReader({ bookId }: { bookId: string }) {
  const { selectedWord, handleTextSelection, clearSelection, saveWord } = useWordSelection(bookId)

  return (
    <div>
      {/* Book content with text selection */}
      <div 
        onMouseUp={handleTextSelection}
        className="select-text cursor-text"
      >
        {bookContent}
      </div>

      {/* Dictionary popup */}
      {selectedWord && (
        <WordPopupDictionary
          word={selectedWord.word}
          position={selectedWord.position}
          context={selectedWord.context}
          onClose={clearSelection}
          onSaveWord={saveWord}
        />
      )}
    </div>
  )
}
```

---

## Database Schema

### `vocabulary` Table
```sql
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  translation TEXT, -- Persian translation
  context TEXT, -- Sentence where word was found
  book_id UUID REFERENCES books(id),
  mastery_level INTEGER DEFAULT 0, -- For spaced repetition
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, word)
);

-- Index for fast lookups
CREATE INDEX idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX idx_vocabulary_word ON vocabulary(word);
```

---

## Freemium Logic

### Free Tier Limits
- **20 words maximum** in vocabulary
- When limit reached, show upgrade prompt

### Premium Tier
- **Unlimited words**
- Advanced flashcard features (future)
- Spaced repetition system (future)

### Implementation
```typescript
// Check in /api/vocabulary/save route
if (userData?.subscription_tier === 'free') {
  const { count } = await supabase
    .from('vocabulary')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count >= 20) {
    return NextResponse.json(
      { error: 'Free tier limit reached' },
      { status: 403 }
    )
  }
}
```

---

## Performance Optimization

### Caching Strategy
```typescript
// Cache dictionary results in localStorage
const CACHE_KEY = 'dictionary_cache'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

function getCachedDefinition(word: string) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  const cached = cache[word]
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  return null
}

function setCachedDefinition(word: string, data: any) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  cache[word] = {
    data,
    timestamp: Date.now()
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}
```

---

## Future Enhancements

### Phase 2 Features
- [ ] Flashcard system with spaced repetition
- [ ] Quiz mode for vocabulary review
- [ ] Word difficulty heatmap in reader
- [ ] Export vocabulary to CSV/PDF
- [ ] Pronunciation practice with speech recognition
- [ ] Word usage statistics
- [ ] Personalized word recommendations

### Phase 3 Features
- [ ] Offline dictionary (PWA)
- [ ] Multiple language support (not just Persian)
- [ ] AI-powered example sentences
- [ ] Word etymology and history
- [ ] Integration with Anki

---

## Troubleshooting

### Issue: Dictionary API returns 404
**Solution**: Word might not exist in dictionary. Show fallback message and offer AI translation only.

### Issue: Translation is slow
**Solution**: Implement caching and show loading state with typing animation.

### Issue: Audio pronunciation not working
**Solution**: Check if `audioUrl` exists. Some words don't have audio. Show pronunciation text instead.

### Issue: Free tier limit not enforced
**Solution**: Check RLS policies in Supabase. Ensure `subscription_tier` is correctly set in `users` table.

---

## Testing

### Test Dictionary API
```bash
curl https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

### Test Translation API
```bash
curl -X POST http://localhost:3000/api/dictionary/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","context":"She said hello"}'
```

### Test Vocabulary Save
```bash
curl -X POST http://localhost:3000/api/vocabulary/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "word":"hello",
    "definition":"A greeting",
    "translation":"سلام"
  }'
```

---

## Credits

- **Free Dictionary API**: https://dictionaryapi.dev/
- **Google Gemini**: For Persian translations
- **Inspiration**: Duolingo, Anki, Readlang

---

*Last Updated: 2025-01-06*
